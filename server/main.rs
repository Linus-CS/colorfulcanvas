use axum::{
    http::StatusCode,
    routing::{get, get_service},
    Router,
};
use axum_server::tls_rustls::RustlsConfig;
use std::{io, net::SocketAddr};
use tower_http::services::ServeDir;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/test", get(|| async { "Hello World!" }))
        .fallback(get_service(ServeDir::new("../client")).handle_error(
            |_error: io::Error| async move {
                (StatusCode::FORBIDDEN, format!("Internal server error.."))
            },
        ));

    let config = RustlsConfig::from_pem_file("certs/MyCertificate.crt", "certs/MyKey.key")
        .await
        .unwrap();

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    println!("listening on {}", addr);
    axum_server::bind_rustls(addr, config)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
