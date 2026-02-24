use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;
use chrono::NaiveDate;
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
}

#[derive(Serialize)]
pub struct SyncMetricsPayload {
    pub date: String,
    pub work_time_minutes: i32,
    pub computer_activity_minutes: i32,
    pub productive_minutes: i32,
    pub unproductive_minutes: i32,
    pub neutral_minutes: i32,
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
            let data: LoginResponse = res.json().await.map_err(|e| format!("Invalid response format: {}", e))?;
            
            if data.user.role != "employee" {
                return Err("Only an Employee user account is allowed.".to_string());
            }

            // Save token
            let mut t = self.token.lock().await;
            *t = Some(data.token.clone());
            
            Ok(data.token)
        } else {
            let error_text = res.text().await.unwrap_or_default();
            Err(format!("Login failed: {}", error_text))
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

        if res.status().is_success() {
            Ok(())
        } else {
            let error_text = res.text().await.unwrap_or_default();
            Err(format!("Sync failed: {}", error_text))
        }
    }
}
