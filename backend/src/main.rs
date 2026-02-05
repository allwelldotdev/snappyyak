use axum::{
    routing::{get, post},
    Router,
};
use dotenvy::dotenv;
use std::env;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

mod auth;
mod db;
mod models;
mod routes;
mod schema;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = db::establish_connection(&database_url);

    let app = Router::new()
        .route("/api/auth/signup", post(routes::auth::signup))
        .route("/api/auth/login", post(routes::auth::login))
        .route("/api/auth/me", get(routes::auth::me))
        .route("/api/auth/update-profile", post(routes::auth::update_profile))
        .route("/api/auth/change-password", post(routes::auth::change_password))
        // Employer routes
        .route("/api/employer/employees", post(routes::employer::add_employee).get(routes::employer::list_employees))
        .route("/api/employer/employees/:id", get(routes::employer::get_employee).delete(routes::employer::delete_employee))
        // Onboarding routes
        .route("/api/onboarding/complete", post(routes::onboarding::complete_onboarding))
        .layer(CorsLayer::permissive())
        .with_state(pool);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
