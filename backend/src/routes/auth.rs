use crate::auth::{create_jwt, AuthUser};
use crate::db::DbPool;
use crate::models::{NewUser, User};
use crate::schema::employer_employees::dsl as employer_employees_dsl;
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
    Json(mut payload): Json<crate::models::SignupRequest>,
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
    
    // Password is required in SignupRequest, so we can use it directly
    if payload.password.is_empty() {
         return Err((
            StatusCode::BAD_REQUEST,
            Json(json!({ "error": "Password is required" })),
        ));
    }

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
        password: Some(password_hash),
        temp_password: None,
        role: "employer".to_string(), // Default to employer for self-signup
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

    // New employers don't need onboarding
    let token = create_jwt(user.id.unwrap(), &user.email, &user.role, false).map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": e.to_string() })),
        )
    })?;

    Ok((
        StatusCode::CREATED,
        Json(json!({ "token": token, "user": { "id": user.id, "email": user.email, "fullname": user.fullname, "role": user.role, "needs_onboarding": false } })),
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

    let user_opt = users::table
        .filter(users::email.eq(&payload.email))
        .first::<User>(&mut conn)
        .optional()
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?;

    // We need to handle verifying against either password (priority) or temp_password
    let (target_hash, user_id, user_email, user_fullname, user_role, needs_onb) = if let Some(user) = &user_opt {
        let needs_onboarding = user.role == "employee" && user.password.is_none();
        
        let hash_to_check = if user.password.is_some() {
             user.password.as_deref()
        } else {
             user.temp_password.as_deref()
        };
        
        (hash_to_check, Some(user.id), Some(&user.email), Some(&user.fullname), Some(&user.role), needs_onboarding)
    } else {
        (Some(DUMMY_HASH), None, None, None, None, false)
    };

    let password_hash = target_hash.unwrap_or(DUMMY_HASH);
    
    let parsed_hash = PasswordHash::new(password_hash).map_err(|_e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": "Invalid password hash configuration" })),
        )
    })?;

    if Argon2::default().verify_password(payload.password.as_bytes(), &parsed_hash).is_ok() {
        if let (Some(id), Some(email), Some(fullname), Some(role)) = (user_id, user_email, user_fullname, user_role) {
            if role == "employee" {
                let employee_id = id.unwrap();
                let statuses = employer_employees_dsl::employer_employees
                    .filter(employer_employees_dsl::employee_id.eq(employee_id))
                    .select(employer_employees_dsl::status)
                    .load::<String>(&mut conn)
                    .map_err(|e| {
                        (
                            StatusCode::INTERNAL_SERVER_ERROR,
                            Json(json!({ "error": e.to_string() })),
                        )
                    })?;

                let has_active_relationship = statuses.iter().any(|status| status != "deactivated");

                if !has_active_relationship {
                    return Err((
                        StatusCode::FORBIDDEN,
                        Json(json!({ "error": "This account has been deactivated" })),
                    ));
                }
            }
            let token = create_jwt(id.unwrap(), email, role, needs_onb).map_err(|e| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({ "error": e.to_string() })),
                )
            })?;
            return Ok(Json(
                json!({ "token": token, "user": { "id": id, "email": email, "fullname": fullname, "role": role, "needs_onboarding": needs_onb } }),
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
        .filter(users::id.eq(auth_user.user_id))
        .first::<User>(&mut conn)
        .optional()
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?;

    if let Some(user) = user {
        // Deactivation guard for employees
        if user.role == "employee" {
            let statuses = employer_employees_dsl::employer_employees
                .filter(employer_employees_dsl::employee_id.eq(user.id.unwrap()))
                .select(employer_employees_dsl::status)
                .load::<String>(&mut conn)
                .map_err(|e| {
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(json!({ "error": e.to_string() })),
                    )
                })?;

            let has_active_relationship = statuses.iter().any(|status| status != "deactivated");

            if !has_active_relationship {
                return Err((
                    StatusCode::FORBIDDEN,
                    Json(json!({ "error": "This account has been deactivated" })),
                ));
            }
        }

        let needs_onboarding = user.role == "employee" && user.password.is_none();
        return Ok(Json(json!({
            "user": {
                "id": user.id,
                "email": user.email,
                "fullname": user.fullname,
                "role": user.role,
                "needs_onboarding": needs_onboarding
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

    diesel::update(users::table.filter(users::id.eq(auth_user.user_id)))
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
        .filter(users::id.eq(auth_user.user_id))
        .first::<User>(&mut conn)
        .optional()
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": e.to_string() })),
            )
        })?;

    if let Some(user) = user {
        // Verify current password - Must have a password to change it here
        let current_password_hash = user.password.as_deref().unwrap_or(DUMMY_HASH);
        
        let parsed_hash = PasswordHash::new(current_password_hash).map_err(|_e| {
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
        diesel::update(users::table.filter(users::id.eq(auth_user.user_id)))
            .set(users::password.eq(Some(new_password_hash))) // Wrap in Some
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
