use crate::auth::{create_jwt, AuthUser};
use crate::db::DbPool;
use crate::models::{User, CompleteOnboardingRequest};
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

pub async fn complete_onboarding(
    State(pool): State<DbPool>,
    auth_user: AuthUser,
    Json(payload): Json<CompleteOnboardingRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    if auth_user.role != "employee" {
         return Err((
            StatusCode::FORBIDDEN,
            Json(json!({ "error": "Only employees can complete onboarding" })),
        ));
    }

    let mut conn: Conn = pool.get().map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": e.to_string() })),
        )
    })?;

    let user = users::table
        .find(auth_user.user_id)
        .first::<User>(&mut conn)
        .optional()
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?;

    if let Some(user) = user {
        if user.password.is_some() {
             return Err((
                StatusCode::BAD_REQUEST,
                Json(json!({ "error": "Onboarding already completed" })),
            ));
        }

        // Verify temp password
        let temp_password_hash = user.temp_password.as_deref().ok_or((
             StatusCode::INTERNAL_SERVER_ERROR,
             Json(json!({ "error": "No temporary password set for this user" })),
        ))?;

        let parsed_hash = PasswordHash::new(temp_password_hash).map_err(|_e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": "Invalid hash configuration" })),
            )
        })?;

        if Argon2::default().verify_password(payload.temp_password.as_bytes(), &parsed_hash).is_err() {
            return Err((
                StatusCode::UNAUTHORIZED,
                Json(json!({ "error": "Invalid temporary password" })),
            ));
        }

        // Validate new password strength
        if payload.new_password.len() < 8 {
             return Err((
                StatusCode::BAD_REQUEST,
                Json(json!({ "error": "Password must be at least 8 characters" })),
            ));
        }

        // Hash new password
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        let new_password_hash = argon2
            .hash_password(payload.new_password.as_bytes(), &salt)
            .map_err(|e| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({ "error": e.to_string() })),
                )
            })?
            .to_string();

        // Update user: set password, clear temp_password
        diesel::update(users::table.find(user.id))
            .set((
                users::password.eq(Some(new_password_hash)),
                users::temp_password.eq(None::<String>),
            ))
            .execute(&mut conn)
            .map_err(|e| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({ "error": e.to_string() })),
                )
            })?;

        // Generate new token
        let token = create_jwt(user.id, &user.email, &user.role, false).map_err(|e| {
             (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?;

        return Ok((StatusCode::OK, Json(json!({ 
            "message": "Onboarding complete",
            "token": token
        }))));
    }

    Err((
        StatusCode::NOT_FOUND,
        Json(json!({ "error": "User not found" })),
    ))
}
