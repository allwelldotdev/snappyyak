use axum::{
    extract::{State, Json},
    response::IntoResponse,
};
use serde_json::json;
use diesel::prelude::*;

use crate::auth::AuthUser;
use crate::models::{SyncMetricsRequest, NewEmployeeMetric};
use crate::schema::employee_metrics::dsl::*;

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

    // Upsert logic: SQLite doesn't have raw ON CONFLICT DO UPDATE cleanly in Diesel yet unless configured right,
    // but Diesel supports `replace_into` for SQLite or we can just query and update.
    // Let's do fetch -> then insert or update.
    use crate::schema::employee_metrics;
    let existing_metric = employee_metrics::table
        .filter(user_id.eq(user.user_id))
        .filter(date.eq(payload.date))
        .first::<(
            Option<i32>, // id
            i32, // user_id
            chrono::NaiveDate, // date
            Option<i32>, Option<i32>, Option<i32>, Option<i32>, Option<i32>, Option<i32>, Option<i32>,
            chrono::NaiveDateTime, chrono::NaiveDateTime
        )>(&mut connection)
        .optional();

    match existing_metric {
        Ok(Some(existing)) => {
            // Update
            let update_result = diesel::update(employee_metrics::table
                .filter(user_id.eq(user.user_id))
                .filter(date.eq(payload.date)))
                .set((
                    work_time_minutes.eq(payload.work_time_minutes),
                    computer_activity_minutes.eq(payload.computer_activity_minutes),
                    productive_minutes.eq(payload.productive_minutes),
                    unproductive_minutes.eq(payload.unproductive_minutes),
                    neutral_minutes.eq(payload.neutral_minutes),
                    updated_at.eq(chrono::Utc::now().naive_utc()),
                ))
                .execute(&mut connection);

            if update_result.is_err() {
                return Json(json!({ "error": "Failed to update metrics" })).into_response();
            }
        },
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
                manual_time_minutes: None,
                break_time_minutes: None,
            };

            let insert_result = diesel::insert_into(employee_metrics::table)
                .values(&new_metric)
                .execute(&mut connection);

            if insert_result.is_err() {
                return Json(json!({ "error": "Failed to insert metrics" })).into_response();
            }
        },
        Err(_) => {
            return Json(json!({ "error": "Failed to query database" })).into_response();
        }
    }

    Json(json!({ "status": "success", "message": "Metrics synced successfully" })).into_response()
}
