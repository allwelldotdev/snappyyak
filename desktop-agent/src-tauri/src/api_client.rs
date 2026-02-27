use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;
use std::time::Duration;

#[derive(Clone)]
pub struct ApiClient {
    pub client: Client,
    pub token: Arc<Mutex<Option<String>>>,
    pub base_url: String,
}

#[derive(Serialize)]
pub struct LoginPayload<'a> {
    pub email: &'a str,
    pub password: &'a str,
}

#[derive(Deserialize)]
struct LoginResponse {
    token: String,
    user: UserRoleInfo,
}

#[derive(Deserialize)]
struct UserRoleInfo {
    role: String,
    needs_onboarding: bool,
}

#[derive(Serialize)]
pub struct SyncMetricsPayload {
    pub date: String,
    pub work_time_minutes: i32,
    pub computer_activity_minutes: i32,
    pub manual_time_minutes: i32,
    pub productive_minutes: i32,
    pub unproductive_minutes: i32,
    pub neutral_minutes: i32,
}

#[derive(Deserialize)]
struct MetricsResponse {
    date: String,
    work_time_minutes: i32,
    computer_activity_minutes: i32,
    manual_time_minutes: i32,
    productive_minutes: i32,
    unproductive_minutes: i32,
    neutral_minutes: i32,
}

impl ApiClient {
    pub fn new() -> Self {
        let client = Client::builder()
            .timeout(Duration::from_secs(10))
            .build()
            .unwrap();
            
        Self {
            client,
            token: Arc::new(Mutex::new(None)),
            base_url: "http://localhost:8080/api".to_string(),
        }
    }

    pub async fn login(&self, email: &str, password: &str) -> Result<String, String> {
        let payload = LoginPayload { email, password };
        let url = format!("{}/auth/login", self.base_url);
        
        let res = self.client.post(&url)
            .json(&payload)
            .send()
            .await
            .map_err(|e| format!("Network error: {}", e))?;

        if res.status().is_success() {
            let data: LoginResponse = res
                .json()
                .await
                .map_err(|e| format!("Invalid response format: {}", e))?;

            if data.user.role != "employee" {
                return Err("This app only allows Employee user accounts".to_string());
            }

            if data.user.needs_onboarding {
                return Err(
                    "This account has not been onboarded yet. Check your email to complete onboarding process"
                        .to_string(),
                );
            }

            // Save token
            let mut t = self.token.lock().await;
            *t = Some(data.token.clone());

            Ok(data.token)
        } else {
            let error_text = match res.json::<serde_json::Value>().await {
                Ok(value) => value
                    .get("error")
                    .and_then(|v| v.as_str())
                    .unwrap_or("Login failed")
                    .to_string(),
                Err(_) => "Login failed".to_string(),
            };
            Err(error_text)
        }
    }

    pub async fn sync_metrics(&self, payload: &SyncMetricsPayload) -> Result<(), String> {
        let t = self.token.lock().await;
        let token = match &*t {
            Some(tk) => tk.clone(),
            None => return Err("Not authenticated".to_string()),
        };

        let url = format!("{}/employee/metrics/sync", self.base_url);
        let res = self.client.post(&url)
            .header("Authorization", format!("Bearer {}", token))
            .json(payload)
            .send()
            .await
            .map_err(|e| format!("Network error: {}", e))?;

        let status = res.status();
        if status.is_success() {
            Ok(())
        } else {
            let error_text = res
                .text()
                .await
                .unwrap_or_else(|_| "unknown response body".to_string());
            Err(format!("Sync failed ({}): {}", status.as_u16(), error_text))
        }
    }

    pub async fn get_metrics_for_date(&self, date: &str) -> Result<SyncMetricsPayload, String> {
        let t = self.token.lock().await;
        let token = match &*t {
            Some(tk) => tk.clone(),
            None => return Err("Not authenticated".to_string()),
        };

        let url = format!("{}/employee/metrics/{}", self.base_url, date);
        let res = self.client
            .get(&url)
            .header("Authorization", format!("Bearer {}", token))
            .send()
            .await
            .map_err(|e| format!("Network error: {}", e))?;

        let status = res.status();
        if status.is_success() {
            let data: MetricsResponse = res
                .json()
                .await
                .map_err(|e| format!("Invalid response format: {}", e))?;
            Ok(SyncMetricsPayload {
                date: data.date,
                work_time_minutes: data.work_time_minutes,
                computer_activity_minutes: data.computer_activity_minutes,
                manual_time_minutes: data.manual_time_minutes,
                productive_minutes: data.productive_minutes,
                unproductive_minutes: data.unproductive_minutes,
                neutral_minutes: data.neutral_minutes,
            })
        } else {
            let error_body = res.text().await.unwrap_or_default();
            let error_text = serde_json::from_str::<serde_json::Value>(&error_body)
                .ok()
                .and_then(|value| value.get("error").and_then(|v| v.as_str()).map(str::to_string))
                .unwrap_or_else(|| {
                    if error_body.is_empty() {
                        "Failed to fetch metrics".to_string()
                    } else {
                        error_body
                    }
                });
            let formatted = format!("{} (status {})", error_text, status.as_u16());
            Err(formatted)
        }
    }
}
