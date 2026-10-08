use axum::{
    BoxError, Json, Router,
    error_handling::HandleErrorLayer,
    http::{HeaderValue, Method, StatusCode, header},
    routing::get,
};
use serde::Serialize;
use std::{env, net::SocketAddr, time::Duration};
use tower::{ServiceBuilder, limit::ConcurrencyLimitLayer, load_shed::LoadShedLayer};
use tower_http::{cors::CorsLayer, set_header::SetResponseHeaderLayer, timeout::TimeoutLayer};
use utoipa::{OpenApi, ToSchema};

#[derive(Serialize, ToSchema)]
#[serde(rename_all = "lowercase")]
enum HealthStatus {
    Ok,
}

#[derive(Serialize, ToSchema)]
#[serde(deny_unknown_fields)]
struct HealthResponse {
    status: HealthStatus,
}

#[utoipa::path(get, path = "/health", responses(
    (status = 200, description = "Process health only; no persistence or identity readiness", body = HealthResponse),
    (status = 408, description = "Request deadline exceeded"),
    (status = 503, description = "Service admission limit reached")
))]
async fn health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: HealthStatus::Ok,
    })
}

#[derive(OpenApi)]
#[openapi(
    paths(health),
    components(schemas(HealthResponse, HealthStatus)),
    info(title = "FieldStock health API", version = "0.1.0")
)]
struct ApiDoc;

fn app(web_origin: HeaderValue) -> Router {
    Router::new()
        .route("/health", get(health))
        .route("/openapi.json", get(|| async { Json(ApiDoc::openapi()) }))
        .layer(
            ServiceBuilder::new()
                .layer(
                    CorsLayer::new()
                        .allow_origin(web_origin)
                        .allow_methods([Method::GET]),
                )
                .layer(SetResponseHeaderLayer::overriding(
                    header::CACHE_CONTROL,
                    HeaderValue::from_static("no-store"),
                ))
                .layer(TimeoutLayer::with_status_code(
                    StatusCode::REQUEST_TIMEOUT,
                    Duration::from_secs(2),
                ))
                .layer(HandleErrorLayer::new(|_: BoxError| async {
                    StatusCode::SERVICE_UNAVAILABLE
                }))
                .layer(LoadShedLayer::new())
                .layer(ConcurrencyLimitLayer::new(32)),
        )
}

#[tokio::main(worker_threads = 2)]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    if env::args().any(|arg| arg == "--export-openapi") {
        println!("{}", ApiDoc::openapi().to_pretty_json()?);
        return Ok(());
    }
    let bind: SocketAddr = env::var("API_BIND")
        .unwrap_or_else(|_| "127.0.0.1:45106".into())
        .parse()?;
    let origin: HeaderValue = env::var("WEB_ORIGIN")
        .unwrap_or_else(|_| "http://127.0.0.1:45105".into())
        .parse()?;
    let listener = tokio::net::TcpListener::bind(bind).await?;
    eprintln!(
        "FieldStock health API listening on {}",
        listener.local_addr()?
    );
    axum::serve(listener, app(origin))
        .with_graceful_shutdown(shutdown_signal())
        .await?;
    Ok(())
}

async fn shutdown_signal() {
    #[cfg(unix)]
    {
        match tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate()) {
            Ok(mut terminate) => {
                tokio::select! { _ = tokio::signal::ctrl_c() => {}, _ = terminate.recv() => {} }
            }
            Err(_) => {
                let _ = tokio::signal::ctrl_c().await;
            }
        }
    }
    #[cfg(not(unix))]
    {
        let _ = tokio::signal::ctrl_c().await;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::{
        body::{Body, to_bytes},
        http::Request,
    };
    use tower::ServiceExt;

    #[tokio::test]
    async fn health_contract_and_origin_boundary() {
        let router = app(HeaderValue::from_static("http://127.0.0.1:45105"));
        let response = router
            .clone()
            .oneshot(
                Request::builder()
                    .uri("/health")
                    .header("origin", "http://127.0.0.1:45105")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(
            response.headers()[header::ACCESS_CONTROL_ALLOW_ORIGIN],
            "http://127.0.0.1:45105"
        );
        assert_eq!(response.headers()[header::CACHE_CONTROL], "no-store");
        let body = to_bytes(response.into_body(), 1024).await.unwrap();
        assert_eq!(
            serde_json::from_slice::<serde_json::Value>(&body).unwrap(),
            serde_json::json!({"status": "ok"})
        );
        let response = router
            .oneshot(
                Request::builder()
                    .uri("/health")
                    .method(Method::POST)
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::METHOD_NOT_ALLOWED);
    }
}
