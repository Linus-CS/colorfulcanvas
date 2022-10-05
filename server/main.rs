use axum::{
    http::StatusCode,
    routing::{get, get_service, post},
    Router,
};
use axum_server::tls_rustls::RustlsConfig;
use mongodb::{
    bson::{document, Document},
    options::ClientOptions,
    Client,
};
use serde::{Deserialize, Serialize};
use serde_json::{Map, Number, Value};
use std::{io, net::SocketAddr};
use tower_http::services::ServeDir;

#[tokio::main]
async fn main() {
    let app = Router::new().route("/save", post(save_canvas)).fallback(
        get_service(ServeDir::new("../client")).handle_error(|_error: io::Error| async move {
            (StatusCode::FORBIDDEN, format!("Internal server error.."))
        }),
    );

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

async fn save_canvas(body: String) {
    let mut client_options = ClientOptions::parse("mongodb://localhost:27017")
        .await
        .unwrap();
    let grid: Grid = serde_json::from_str(&body).expect("Could not parse json to Grid struct.");
    println!("{:?}", grid);

    let client = Client::with_options(client_options).unwrap();

    let database = client.database("test");

    let collections = database.collection::<Document>("grids");
    let mut document = Document::new();
    document.insert("test", 10);
    collections.insert_one(document, None).await.unwrap();
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Grid {
    grid: Value,
    size: Value,
    outline: bool,
    color: String,
}
