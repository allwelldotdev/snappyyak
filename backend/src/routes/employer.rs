use crate::auth::AuthUser;
use crate::db::DbPool;
use crate::models::{NewUser, User, AddEmployeeRequest, AddEmployeeResponse};
use crate::schema::users;
use argon2::{
    password_hash::{
        rand_core::OsRng, PasswordHasher, SaltString,
    },
    Argon2,
};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use diesel::prelude::*;
use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::SqliteConnection;
use passwords::PasswordGenerator;
use serde_json::{json, Value};

type Conn = PooledConnection<ConnectionManager<SqliteConnection>>;

pub async fn add_employee(
    State(pool): State<DbPool>,
    auth_user: AuthUser,
    Json(mut payload): Json<AddEmployeeRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    if auth_user.role != "employer" {
        return Err((
            StatusCode::FORBIDDEN,
            Json(json!({ "error": "Unauthorized. Only employers can add employees." })),
        ));
    }

    payload.email = payload.email.trim().to_string();
    payload.name = payload.name.trim().to_string();

    if payload.email.is_empty() || payload.name.is_empty() {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(json!({ "error": "Email and name are required" })),
        ));
    }
    if !payload.email.contains('@') {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(json!({ "error": "Invalid email address" })),
        ));
    }

    let mut conn: Conn = pool.get().map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": e.to_string() })),
        )
    })?;

    // Check if user exists
    let user_exists = users::table
        .filter(users::email.eq(&payload.email))
        .first::<User>(&mut conn)
        .optional()
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?;

    if user_exists.is_some() {
        return Err((
            StatusCode::CONFLICT,
            Json(json!({ "error": "User with this email already exists" })),
        ));
    }

    // Generate temp password
    let pg = PasswordGenerator {
        length: 12,
        numbers: true,
        lowercase_letters: true,
        uppercase_letters: true,
        symbols: true,
        strict: true,
        exclude_similar_characters: true,
        spaces: false,
    };
    let temp_password = pg.generate_one().map_err(|_e| {
         (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": "Failed to generate password" })))
    })?;

    // Hash temp password
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let temp_password_hash = argon2
        .hash_password(temp_password.as_bytes(), &salt)
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?
        .to_string();

    let new_user = NewUser {
        email: payload.email.clone(),
        fullname: payload.name,
        password: None,
        temp_password: Some(temp_password_hash),
        role: "employee".to_string(),
    };

    let user = diesel::insert_into(users::table)
        .values(&new_user)
        .get_result::<User>(&mut conn)
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?;

    Ok((
        StatusCode::CREATED,
        Json(AddEmployeeResponse {
            id: user.id,
            email: user.email,
            temp_password,
        }),
    ))
}

pub async fn list_employees(
    State(pool): State<DbPool>,
    auth_user: AuthUser,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    if auth_user.role != "employer" {
        return Err((
            StatusCode::FORBIDDEN,
            Json(json!({ "error": "Unauthorized" })),
        ));
    }

    let mut conn: Conn = pool.get().map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": e.to_string() })),
        )
    })?;

    // In a multi-tenant system we would filter by company. 
    // For current single-tenant implementation, we list all 'employee' role users.
    let employees = users::table
        .filter(users::role.eq("employee"))
        .load::<User>(&mut conn)
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?;

    let employees_json: Vec<Value> = employees.into_iter().map(|u| {
        json!({
            "id": u.id,
            "email": u.email,
            "fullname": u.fullname,
            "onboarded": u.password.is_some(),
            "created_at": u.created_at.to_string(),
        })
    }).collect();

    Ok(Json(json!({ "employees": employees_json })))
}

pub async fn get_employee(
    State(pool): State<DbPool>,
    auth_user: AuthUser,
    Path(id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
     if auth_user.role != "employer" {
        return Err((
            StatusCode::FORBIDDEN,
            Json(json!({ "error": "Unauthorized" })),
        ));
    }

    let mut conn: Conn = pool.get().map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": e.to_string() })),
        )
    })?;

    let user = users::table
        .find(id)
        .first::<User>(&mut conn)
        .optional()
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?;

    if let Some(user) = user {
        if user.role != "employee" {
             return Err((
                StatusCode::NOT_FOUND, // Don't expose non-employees as found or forbidden? sticking to 404 for now
                Json(json!({ "error": "Employee not found" })),
            ));
        }

        return Ok(Json(json!({
            "id": user.id,
            "email": user.email,
            "fullname": user.fullname,
            "onboarded": user.password.is_some(),
            "created_at": user.created_at.to_string(),
        })));
    }

    Err((
        StatusCode::NOT_FOUND,
        Json(json!({ "error": "Employee not found" })),
    ))
}

pub async fn delete_employee(
    State(pool): State<DbPool>,
    auth_user: AuthUser,
    Path(id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
     if auth_user.role != "employer" {
        return Err((
            StatusCode::FORBIDDEN,
            Json(json!({ "error": "Unauthorized" })),
        ));
    }

    let mut conn: Conn = pool.get().map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": e.to_string() })),
        )
    })?;

    let target_user = users::table
        .find(id)
        .first::<User>(&mut conn)
        .optional()
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?;

    if let Some(u) = target_user {
        if u.role != "employee" {
             return Err((
                StatusCode::FORBIDDEN,
                Json(json!({ "error": "Cannot delete non-employee users" })),
            ));
        }

        diesel::delete(users::table.find(id))
            .execute(&mut conn)
            .map_err(|e| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({ "error": e.to_string() })),
                )
            })?;

        return Ok((StatusCode::OK, Json(json!({ "message": "Employee deleted successfully" }))));
    }

     Err((
        StatusCode::NOT_FOUND,
        Json(json!({ "error": "Employee not found" })),
    ))
}
