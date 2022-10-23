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

const CONNECTION_STRING: &str = "mongodb://color-user:secretpw@mongodb:27017/colorful";

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
    let client_options = ClientOptions::parse(CONNECTION_STRING).await.unwrap();

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
        Err(e) => {
            println!("{e}");
            return StatusCode::INTERNAL_SERVER_ERROR;
        }
    }
}

async fn retrieve_grids() -> Json<Vec<Grid>> {
    println!("Connecting...");
    let client_options = ClientOptions::parse(CONNECTION_STRING).await.unwrap();
    println!("Connected.");

    let client = match Client::with_options(client_options) {
        Ok(client) => client,
        Err(_) => return Json(vec![]),
    };

    let collection = get_or_build_collection::<Grid>(&client, "colorful", "grids").await;

    let mut results = collection
        .find(None, None)
        .await
        .expect("Failed to find any.");

    match results.advance().await {
        Ok(true) => (),
        _ => return Json(vec![]),
    }

    let mut result: Grid =
        bson::from_slice(results.current().to_raw_document_buf().as_bytes()).unwrap();

    let mut grids = vec![];

    for _ in 0..9 {
        grids.push(result);
        match results.advance().await {
            Ok(true) => {
                result =
                    bson::from_slice(results.current().to_raw_document_buf().as_bytes()).unwrap()
            }
            _ => break,
        }
    }

    Json(grids)
}

async fn select_random_grids() {
    let client_options = ClientOptions::parse(CONNECTION_STRING).await.unwrap();

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
    let database = client.database(db_name);
    let collection = database.collection(col_name);
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
