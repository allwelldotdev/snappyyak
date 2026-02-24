use crate::auth::AuthUser;
use crate::db::DbPool;
use crate::models::{
    AddEmployeeRequest, AddEmployeeResponse, EmployeeWithRelationship, NewEmployerEmployee,
    NewUser, StatusUpdateRequest, User,
};
use crate::schema::{employer_employees, users};
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHasher, SaltString},
    Argon2,
};
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use diesel::prelude::*;
use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::SqliteConnection;
use passwords::PasswordGenerator;
use serde::Deserialize;
use serde_json::{json, Value};

type Conn = PooledConnection<ConnectionManager<SqliteConnection>>;

#[derive(Deserialize)]
pub struct EmployeeListQuery {
    pub status: Option<String>,
}

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

    // Check if user already exists
    let existing_user = users::table
        .filter(users::email.eq(&payload.email))
        .first::<User>(&mut conn)
        .optional()
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?;

    if let Some(existing) = existing_user {
        // User exists - check if relationship already exists
        let relationship_exists = employer_employees::table
            .filter(employer_employees::employer_id.eq(auth_user.user_id))
            .filter(employer_employees::employee_id.eq(existing.id.unwrap()))
            .first::<crate::models::EmployerEmployee>(&mut conn)
            .optional()
            .map_err(|e| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({ "error": e.to_string() })),
                )
            })?;

        if relationship_exists.is_some() {
            return Err((
                StatusCode::CONFLICT,
                Json(json!({ "error": "This employee is already added to your organization" })),
            ));
        }

        // Create relationship for existing user
        let new_relationship = NewEmployerEmployee {
            employer_id: auth_user.user_id,
            employee_id: existing.id.unwrap(),
            status: "pending".to_string(),
        };

        diesel::insert_into(employer_employees::table)
            .values(&new_relationship)
            .execute(&mut conn)
            .map_err(|e| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({ "error": e.to_string() })),
                )
            })?;

        return Ok((
            StatusCode::CREATED,
            Json(json!(AddEmployeeResponse {
                id: existing.id.unwrap(),
                email: existing.email,
                temp_password: "User already exists - no temp password generated".to_string(),
            })),
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
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": "Failed to generate password" })),
        )
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

    // Create employer-employee relationship
    let new_relationship = NewEmployerEmployee {
        employer_id: auth_user.user_id,
        employee_id: user.id.unwrap(),
        status: "pending".to_string(),
    };

    diesel::insert_into(employer_employees::table)
        .values(&new_relationship)
        .execute(&mut conn)
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?;

    Ok((
        StatusCode::CREATED,
        Json(json!(AddEmployeeResponse {
            id: user.id.unwrap(),
            email: user.email,
            temp_password,
        })),
    ))
}

pub async fn list_employees(
    State(pool): State<DbPool>,
    auth_user: AuthUser,
    Query(params): Query<EmployeeListQuery>,
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

    // Build query: join employer_employees with users
    let mut query = employer_employees::table
        .inner_join(users::table.on(users::id.eq(employer_employees::employee_id.nullable())))
        .filter(employer_employees::employer_id.eq(auth_user.user_id))
        .into_boxed();

    // Filter by status if provided
    if let Some(ref status) = params.status {
        // For "active" status, we show onboarded employees with active relationship
        // For "pending", we show non-onboarded employees with pending relationship
        match status.as_str() {
            "active" => {
                query = query.filter(employer_employees::status.eq("active"));
            }
            "pending" => {
                query = query.filter(employer_employees::status.eq("pending"));
            }
            "deactivated" => {
                query = query.filter(employer_employees::status.eq("deactivated"));
            }
            _ => {} // No filter for unknown status
        }
    }

    let results: Vec<(crate::models::EmployerEmployee, User)> = query
        .load(&mut conn)
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?;

    let today = chrono::Local::now().date_naive();
    let user_ids: Vec<i32> = results.iter().map(|(_, user)| user.id.unwrap()).collect();

    let metrics: Vec<crate::models::EmployeeMetric> = crate::schema::employee_metrics::table
        .filter(crate::schema::employee_metrics::user_id.eq_any(&user_ids))
        .filter(crate::schema::employee_metrics::date.eq(today))
        .load(&mut conn)
        .unwrap_or_default();

    let format_mins = |mins: Option<i32>| -> String {
        let m = mins.unwrap_or(0);
        let hours = m / 60;
        let rem_mins = m % 60;
        format!("{:02}:{:02}", hours, rem_mins)
    };

    let employees: Vec<EmployeeWithRelationship> = results
        .into_iter()
        .map(|(rel, user)| {
            let user_metrics = metrics.iter().find(|m| m.user_id == user.id.unwrap());
            
            EmployeeWithRelationship {
                id: user.id.unwrap(),
                email: user.email,
                fullname: user.fullname,
                status: rel.status,
                onboarded: user.password.is_some(),
                created_at: user.created_at.to_string(),
                work_time: format_mins(user_metrics.and_then(|m| m.work_time_minutes)),
                manual_time: format_mins(user_metrics.and_then(|m| m.manual_time_minutes)),
                computer_activity: format_mins(user_metrics.and_then(|m| m.computer_activity_minutes)),
                productive_time: format_mins(user_metrics.and_then(|m| m.productive_minutes)),
                unproductive_time: format_mins(user_metrics.and_then(|m| m.unproductive_minutes)),
            }
        })
        .collect();

    Ok(Json(json!({ "employees": employees })))
}

pub async fn update_employee_status(
    State(pool): State<DbPool>,
    auth_user: AuthUser,
    Path(employee_id): Path<i32>,
    Json(payload): Json<StatusUpdateRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    if auth_user.role != "employer" {
        return Err((
            StatusCode::FORBIDDEN,
            Json(json!({ "error": "Unauthorized" })),
        ));
    }

    // Validate status
    let valid_statuses = ["active", "pending", "deactivated"];
    if !valid_statuses.contains(&payload.status.as_str()) {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(json!({ "error": format!("Invalid status: {}. Must be one of: active, pending, deactivated", payload.status) })),
        ));
    }

    let mut conn: Conn = pool.get().map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": e.to_string() })),
        )
    })?;

    // Find the relationship
    let relationship = employer_employees::table
        .filter(employer_employees::employer_id.eq(auth_user.user_id))
        .filter(employer_employees::employee_id.eq(employee_id))
        .first::<crate::models::EmployerEmployee>(&mut conn)
        .optional()
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?;

    if relationship.is_none() {
        return Err((
            StatusCode::NOT_FOUND,
            Json(json!({ "error": "Employee relationship not found" })),
        ));
    }

    // Update the status
    diesel::update(
        employer_employees::table
            .filter(employer_employees::employer_id.eq(auth_user.user_id))
            .filter(employer_employees::employee_id.eq(employee_id)),
    )
    .set(employer_employees::status.eq(&payload.status))
    .execute(&mut conn)
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": e.to_string() })),
        )
    })?;

    Ok(Json(
        json!({ "message": format!("Employee status updated to {}", payload.status) }),
    ))
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
        .filter(users::id.eq(id))
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
                StatusCode::NOT_FOUND,
                Json(json!({ "error": "Employee not found" })),
            ));
        }

        return Ok(Json(json!({
            "id": user.id.unwrap(),
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
        .filter(users::id.eq(id))
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

        // Delete the relationship first
        diesel::delete(
            employer_employees::table
                .filter(employer_employees::employer_id.eq(auth_user.user_id))
                .filter(employer_employees::employee_id.eq(id)),
        )
        .execute(&mut conn)
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?;

        return Ok((
            StatusCode::OK,
            Json(json!({ "message": "Employee removed successfully" })),
        ));
    }

    Err((
        StatusCode::NOT_FOUND,
        Json(json!({ "error": "Employee not found" })),
    ))
}
