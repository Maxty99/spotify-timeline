// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod de_chrono;
mod de_spotify;

use std::path::PathBuf;

use de_chrono::{deserialize_datetime, deserialize_milis};
use de_spotify::{deserialize_track_uri, TrackURI};
use serde::Deserialize;

#[derive(Deserialize)]
struct SpotifyHistoryEntry {
    #[serde(rename(deserialize = "ts"))]
    #[serde(deserialize_with = "deserialize_datetime")]
    timestamp: chrono::NaiveDate,
    username: String,
    platform: String,
    #[serde(deserialize_with = "deserialize_milis")]
    ms_played: chrono::Duration,
    conn_country: String,
    ip_addr_decrypted: String,
    user_agent_decrypted: String,
    master_metadata_track_name: String,
    master_metadata_album_artist_name: String,
    master_metadata_album_album_name: String,
    #[serde(deserialize_with = "deserialize_track_uri")]
    spotify_track_uri: TrackURI,
    reason_start: String,
    reason_end: String,
    shuffle: bool,
    skipped: bool,
    offline: bool,
    incognito_mode: bool,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
