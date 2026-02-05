use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct User {
    pub id: i32,
    pub email: String,
    pub fullname: String,
    #[serde(skip)]
    pub password: Option<String>,
    #[serde(skip)]
    pub temp_password: Option<String>,
    pub role: String,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = crate::schema::users)]
pub struct NewUser {
    pub email: String,
    pub fullname: String,
    pub password: Option<String>,
    pub temp_password: Option<String>,
    pub role: String,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct ChangePasswordRequest {
    pub current_password: String,
    pub new_password: String,
}

#[derive(Deserialize)]
pub struct UpdateProfileRequest {
    pub fullname: String,
}

#[derive(Deserialize)]
pub struct AddEmployeeRequest {
    pub name: String,
    pub email: String,
}

#[derive(Serialize)]
pub struct AddEmployeeResponse {
    pub id: i32,
    pub email: String,
    pub temp_password: String,
}

#[derive(Deserialize)]
pub struct CompleteOnboardingRequest {
    pub temp_password: String,
    pub new_password: String,
}
