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
    payload.fullname = payload.fullname.trim().to_string();
    
    // Basic validation
    if payload.email.is_empty() || payload.fullname.is_empty() {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(json!({ "error": "Email and full name are required" })),
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
        fullname: payload.fullname,
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
        Json(json!({ "token": token, "user": { "id": user.id, "email": user.email, "fullname": user.fullname } })),
    ))
}

const DUMMY_HASH: &str = "$argon2id$v=19$m=19456,t=2,p=1$voLGulSHQm6aDD+/HZDwSA$3xKrqcmLa6a6D+p8eKIawzICI36oozQUYzbjJfKA2iw";

pub async fn login(
    State(pool): State<DbPool>,
    Json(mut payload): Json<crate::models::LoginRequest>,
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

    let (password_hash, user_id, user_email, user_fullname) = if let Some(user) = &user {
        (user.password.as_str(), Some(user.id), Some(&user.email), Some(&user.fullname))
    } else {
        (DUMMY_HASH, None, None, None)
    };

    let parsed_hash = PasswordHash::new(password_hash).map_err(|_e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": "Invalid password hash configuration" })),
        )
    })?;

    if Argon2::default().verify_password(payload.password.as_bytes(), &parsed_hash).is_ok() {
        if let (Some(id), Some(email), Some(fullname)) = (user_id, user_email, user_fullname) {
            let token = create_jwt(id, email).map_err(|e| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({ "error": e.to_string() })),
                )
            })?;
            return Ok(Json(
                json!({ "token": token, "user": { "id": id, "email": email, "fullname": fullname } }),
            ));
        }
    }

    Err((
        StatusCode::UNAUTHORIZED,
        Json(json!({ "error": "Invalid credentials" })),
    ))
}

pub async fn me(
    State(pool): State<DbPool>,
    auth_user: AuthUser,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
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
        return Ok(Json(json!({
            "user": {
                "id": user.id,
                "email": user.email,
                "fullname": user.fullname,
            }
        })));
    }

    Err((
        StatusCode::NOT_FOUND,
        Json(json!({ "error": "User not found" })),
    ))
}

pub async fn update_profile(
    State(pool): State<DbPool>,
    auth_user: AuthUser,
    Json(payload): Json<crate::models::UpdateProfileRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    let mut conn: Conn = pool.get().map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": e.to_string() })),
        )
    })?;

    diesel::update(users::table.find(auth_user.user_id))
        .set(users::fullname.eq(payload.fullname.trim()))
        .execute(&mut conn)
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?;

    Ok((StatusCode::OK, Json(json!({ "message": "Profile updated successfully" }))))
}

pub async fn change_password(
    State(pool): State<DbPool>,
    auth_user: AuthUser,
    Json(payload): Json<crate::models::ChangePasswordRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
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
        // Verify current password
        let parsed_hash = PasswordHash::new(&user.password).map_err(|_e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": "Invalid password hash in database" })),
            )
        })?;

        if Argon2::default()
            .verify_password(payload.current_password.as_bytes(), &parsed_hash)
            .is_err()
        {
            return Err((
                StatusCode::BAD_REQUEST,
                Json(json!({ "error": "Incorrect current password" })),
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

        // Update password
        diesel::update(users::table.find(auth_user.user_id))
            .set(users::password.eq(new_password_hash))
            .execute(&mut conn)
            .map_err(|e| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({ "error": e.to_string() })),
                )
            })?;

        return Ok((StatusCode::OK, Json(json!({ "message": "Password updated successfully" }))));
    }

    Err((
        StatusCode::NOT_FOUND,
        Json(json!({ "error": "User not found" })),
    ))
}
