use crate::auth::{create_jwt, AuthUser};
use crate::db::DbPool;
use crate::models::{NewUser, User};
use crate::schema::users;
use argon2::{
    password_hash::{
        rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString,
    },
    Argon2,
};
use axum::{
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use diesel::prelude::*;
use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::SqliteConnection;
use serde_json::{json, Value};

type Conn = PooledConnection<ConnectionManager<SqliteConnection>>;

pub async fn signup(
    State(pool): State<DbPool>,
    Json(mut payload): Json<NewUser>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    // Sanitize input
    payload.email = payload.email.trim().to_string();
    
    // Basic validation
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
            Json(json!({ "error": "User already exists" })),
        ));
    }

    // Hash password using Argon2
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash = argon2
        .hash_password(payload.password.as_bytes(), &salt)
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?
        .to_string();

    let new_user = NewUser {
        email: payload.email,
        password: password_hash,
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

    let token = create_jwt(user.id, &user.email).map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": e.to_string() })),
        )
    })?;

    Ok((
        StatusCode::CREATED,
        Json(json!({ "token": token, "user": { "id": user.id, "email": user.email } })),
    ))
}

pub async fn login(
    State(pool): State<DbPool>,
    Json(mut payload): Json<NewUser>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    // Sanitize input
    payload.email = payload.email.trim().to_string();

    let mut conn: Conn = pool.get().map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": e.to_string() })),
        )
    })?;

    let user = users::table
        .filter(users::email.eq(&payload.email))
        .first::<User>(&mut conn)
        .optional()
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?;

    if let Some(user) = user {
        let parsed_hash = PasswordHash::new(&user.password).map_err(|_e| {
             (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": "Invalid password hash in database" })), 
            )
        })?; 

       if Argon2::default().verify_password(payload.password.as_bytes(), &parsed_hash).is_ok() {
            let token = create_jwt(user.id, &user.email).map_err(|e| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({ "error": e.to_string() })),
                )
            })?;
            return Ok(Json(
                json!({ "token": token, "user": { "id": user.id, "email": user.email } }),
            ));
        }
    }

    Err((
        StatusCode::UNAUTHORIZED,
        Json(json!({ "error": "Invalid credentials" })),
    ))
}

pub async fn me(auth_user: AuthUser) -> impl IntoResponse {
    Json(json!({
        "user": {
            "id": auth_user.user_id,
            "email": auth_user.email,
        }
    }))
}
