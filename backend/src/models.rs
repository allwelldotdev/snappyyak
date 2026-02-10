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
pub struct SignupRequest {
    pub email: String,
    pub fullname: String,
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

// --- Employer-Employee Junction Table ---

#[derive(Debug, Queryable, Selectable, Serialize)]
#[diesel(table_name = crate::schema::employer_employees)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct EmployerEmployee {
    pub id: i32,
    pub employer_id: i32,
    pub employee_id: i32,
    pub department: Option<String>,
    pub role_title: Option<String>,
    pub status: String,
    pub start_date: Option<chrono::NaiveDate>,
    pub end_date: Option<chrono::NaiveDate>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = crate::schema::employer_employees)]
pub struct NewEmployerEmployee {
    pub employer_id: i32,
    pub employee_id: i32,
    pub status: String,
}

// Response struct for employee list with relationship status
#[derive(Debug, Serialize)]
pub struct EmployeeWithRelationship {
    pub id: i32,
    pub email: String,
    pub fullname: String,
    pub status: String,
    pub onboarded: bool,
    pub created_at: String,
    pub work_time: String,
    pub manual_time: String,
    pub computer_activity: String,
    pub productive_time: String,
    pub unproductive_time: String,
}

#[derive(Deserialize)]
pub struct StatusUpdateRequest {
    pub status: String,
}
