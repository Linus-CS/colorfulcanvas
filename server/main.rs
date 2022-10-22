use axum::{
    http::StatusCode,
    routing::{get, get_service, post},
    Json, Router,
};
use axum_server::tls_rustls::RustlsConfig;
use mongodb::{
    bson::{self, doc, Document},
    options::ClientOptions,
    Client, Collection,
};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::{io, net::SocketAddr};
use tower_http::services::ServeDir;

const MONGODB_URL: &str = "mongodb://localhost:27017";

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/save", post(save_grid))
        .route("/retrieve", get(retrieve_grids))
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

async fn save_grid(body: String) -> StatusCode {
    let client_options = ClientOptions::parse(MONGODB_URL).await.unwrap();

    let grid: Grid = match serde_json::from_str(&body) {
        Ok(grid) => grid,
        Err(_) => return StatusCode::EXPECTATION_FAILED,
    };

    let client = match Client::with_options(client_options) {
        Ok(client) => client,
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR,
    };

    let collection = get_or_build_collection(&client, "colorful", "grids").await;

    let document = bson::to_bson(&grid).unwrap();

    match collection.insert_one(document, None).await {
        Ok(_) => return StatusCode::ACCEPTED,
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR,
    }
}

async fn retrieve_grids() -> Json<Vec<Grid>> {
    println!("Connecting...");
    let client_options = ClientOptions::parse(MONGODB_URL).await.unwrap();
    println!("Connected.");

    let client = match Client::with_options(client_options) {
        Ok(client) => client,
        Err(_) => return Json(vec![]),
    };

    let collection = get_or_build_collection(&client, "colorful", "grids").await;

    let mut results = collection
        .find(None, None)
        .await
        .expect("Failed to find any.");

    let mut result = results.current();
    loop {
        println!("Result: {:?}", result);
        match results.advance().await {
            Ok(true) => result = results.current(),
            Err(_) => panic!("hehe"),
            _ => break,
        }
    }

    let result = match collection
        .find_one(
            doc! {
                "id": "1"
            },
            None,
        )
        .await
    {
        Ok(item) => item,
        Err(_) => return Json(vec![]),
    };

    let grid = match result {
        Some(grid) => Json(vec![grid]),
        None => return Json(vec![]),
    };

    println!("Grid: {:?}", grid);

    grid
}

async fn select_random_grids() {
    let client_options = ClientOptions::parse(MONGODB_URL).await.unwrap();

    let client = Client::with_options(client_options).unwrap();
    let collection = get_or_build_collection::<Document>(&client, "colorful", "grids").await;

    let meta_data = collection
        .find_one(doc! {"id": "1"}, None)
        .await
        .unwrap()
        .unwrap();

    let now = chrono::Local::now();
}

async fn get_or_build_collection<T>(
    client: &Client,
    db_name: &str,
    col_name: &str,
) -> Collection<T> {
    let database = client.database("colorful");
    let collection = database.collection("grids");
    collection
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Grid {
    grid: Value,
    size: Value,
    outline: bool,
    color: String,
}
