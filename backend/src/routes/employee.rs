use axum::{
    extract::{Json, Path, State},
    response::IntoResponse,
};
use diesel::prelude::*;
use serde_json::json;

use crate::auth::AuthUser;
use crate::models::{NewEmployeeMetric, SyncMetricsRequest};
use crate::schema::employee_metrics::dsl::*;
use crate::schema::employer_employees::dsl as employer_employees_dsl;

fn has_active_relationship(
    connection: &mut diesel::sqlite::SqliteConnection,
    employee_id_value: i32,
) -> Result<bool, diesel::result::Error> {
    let active_relationship = employer_employees_dsl::employer_employees
        .filter(employer_employees_dsl::employee_id.eq(employee_id_value))
        .filter(employer_employees_dsl::status.eq("active"))
        .select(employer_employees_dsl::id)
        .first::<Option<i32>>(connection)
        .optional()?;

    Ok(matches!(active_relationship, Some(Some(_))))
}

pub async fn sync_metrics(
    State(pool): State<crate::db::DbPool>,
    user: AuthUser,
    Json(payload): Json<SyncMetricsRequest>,
) -> impl IntoResponse {
    if user.role != "employee" {
        return Json(json!({ "error": "Only employees can sync metrics" })).into_response();
    }

    let mut connection = match pool.get() {
        Ok(conn) => conn,
        Err(_) => return Json(json!({ "error": "Database error" })).into_response(),
    };

    match has_active_relationship(&mut connection, user.user_id) {
        Ok(true) => {}
        Ok(false) => {
            return Json(json!({ "error": "Employee relationship is not active" })).into_response();
        }
        Err(_) => {
            return Json(json!({ "error": "Failed to validate employee relationship" })).into_response();
        }
    }

    // Upsert logic: SQLite doesn't have raw ON CONFLICT DO UPDATE cleanly in Diesel yet unless configured right,
    // but Diesel supports `replace_into` for SQLite or we can just query and update.
    // Let's do fetch -> then insert or update.
    use crate::schema::employee_metrics;
    let existing_metric = employee_metrics::table
        .filter(user_id.eq(user.user_id))
        .filter(date.eq(payload.date))
        .first::<(
            Option<i32>,       // id
            i32,               // user_id
            chrono::NaiveDate, // date
            Option<i32>,
            Option<i32>,
            Option<i32>,
            Option<i32>,
            Option<i32>,
            Option<i32>,
            Option<i32>,
            chrono::NaiveDateTime,
            chrono::NaiveDateTime,
        )>(&mut connection)
        .optional();

    match existing_metric {
        Ok(Some(_)) => {
            // Update
            let update_result = diesel::update(
                employee_metrics::table
                    .filter(user_id.eq(user.user_id))
                    .filter(date.eq(payload.date)),
            )
            .set((
                work_time_minutes.eq(payload.work_time_minutes),
                computer_activity_minutes.eq(payload.computer_activity_minutes),
                manual_time_minutes.eq(payload.manual_time_minutes),
                productive_minutes.eq(payload.productive_minutes),
                unproductive_minutes.eq(payload.unproductive_minutes),
                neutral_minutes.eq(payload.neutral_minutes),
                updated_at.eq(chrono::Utc::now().naive_utc()),
            ))
            .execute(&mut connection);

            if update_result.is_err() {
                return Json(json!({ "error": "Failed to update metrics" })).into_response();
            }
        }
        Ok(None) => {
            // Insert
            let new_metric = NewEmployeeMetric {
                user_id: user.user_id,
                date: payload.date,
                work_time_minutes: payload.work_time_minutes,
                computer_activity_minutes: payload.computer_activity_minutes,
                productive_minutes: payload.productive_minutes,
                unproductive_minutes: payload.unproductive_minutes,
                neutral_minutes: payload.neutral_minutes,
                manual_time_minutes: payload.manual_time_minutes,
                break_time_minutes: None,
            };

            let insert_result = diesel::insert_into(employee_metrics::table)
                .values(&new_metric)
                .execute(&mut connection);

            if insert_result.is_err() {
                return Json(json!({ "error": "Failed to insert metrics" })).into_response();
            }
        }
        Err(_) => {
            return Json(json!({ "error": "Failed to query database" })).into_response();
        }
    }

    Json(json!({ "status": "success", "message": "Metrics synced successfully" })).into_response()
}

pub async fn get_metrics_for_date(
    State(pool): State<crate::db::DbPool>,
    user: AuthUser,
    Path(metric_date): Path<chrono::NaiveDate>,
) -> impl IntoResponse {
    if user.role != "employee" {
        return Json(json!({ "error": "Only employees can fetch metrics" })).into_response();
    }

    let mut connection = match pool.get() {
        Ok(conn) => conn,
        Err(_) => return Json(json!({ "error": "Database error" })).into_response(),
    };

    match has_active_relationship(&mut connection, user.user_id) {
        Ok(true) => {}
        Ok(false) => {
            return Json(json!({ "error": "Employee relationship is not active" })).into_response();
        }
        Err(_) => {
            return Json(json!({ "error": "Failed to validate employee relationship" })).into_response();
        }
    }

    use crate::schema::employee_metrics;
    let existing_metric = employee_metrics::table
        .filter(user_id.eq(user.user_id))
        .filter(date.eq(metric_date))
        .first::<(
            Option<i32>,
            i32,
            chrono::NaiveDate,
            Option<i32>,
            Option<i32>,
            Option<i32>,
            Option<i32>,
            Option<i32>,
            Option<i32>,
            Option<i32>,
            chrono::NaiveDateTime,
            chrono::NaiveDateTime,
        )>(&mut connection)
        .optional();

    match existing_metric {
        Ok(Some(row)) => Json(json!({
            "date": row.2.to_string(),
            "work_time_minutes": row.3.unwrap_or(0),
            "manual_time_minutes": row.4.unwrap_or(0),
            "computer_activity_minutes": row.5.unwrap_or(0),
            "productive_minutes": row.6.unwrap_or(0),
            "unproductive_minutes": row.7.unwrap_or(0),
            "neutral_minutes": row.8.unwrap_or(0)
        }))
        .into_response(),
        Ok(None) => Json(json!({
            "date": metric_date.to_string(),
            "work_time_minutes": 0,
            "manual_time_minutes": 0,
            "computer_activity_minutes": 0,
            "productive_minutes": 0,
            "unproductive_minutes": 0,
            "neutral_minutes": 0
        }))
        .into_response(),
        Err(_) => Json(json!({ "error": "Failed to query metrics" })).into_response(),
    }
}
