// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod error;
mod serde_chrono;
mod serde_spotify;

use std::{fs, path::PathBuf};

use error::BackendError;
use serde::{Deserialize, Serialize};
use serde_chrono::{deserialize_datetime, deserialize_milis, serialize_milis};
use serde_spotify::TrackURI;

#[derive(Deserialize, Serialize)]
struct SpotifyHistoryEntry {
    #[serde(rename(deserialize = "ts"))]
    #[serde(deserialize_with = "deserialize_datetime")]
    timestamp: chrono::NaiveDate,
    username: String,
    platform: String,
    #[serde(deserialize_with = "deserialize_milis")]
    #[serde(serialize_with = "serialize_milis")]
    ms_played: chrono::Duration,
    conn_country: String,
    ip_addr_decrypted: String,
    user_agent_decrypted: String,
    master_metadata_track_name: Option<String>,
    master_metadata_album_artist_name: Option<String>,
    master_metadata_album_album_name: Option<String>,
    spotify_track_uri: Option<TrackURI>,
}

#[derive(Serialize)]
struct SpotifyHistoryFile {
    path: PathBuf,
    data: Vec<SpotifyHistoryEntry>,
}

#[tauri::command]
fn move_files_to_data_folder(
    app_handle: tauri::AppHandle,
    paths: Vec<String>,
) -> Result<(), BackendError> {
    let data_folder = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or(BackendError::CouldNotGetDataDir)?;
    println!("{paths:?}");
    for file_path in paths.iter() {
        let file_name = file_path
            .split(|chr| -> bool { matches!(chr, '\\' | '/') })
            .last()
            .expect("Split of filepath must give at least one entry")
            .to_owned();
        let mut dest = data_folder.clone();
        dest.push(file_name);
        println!("{file_path:?} -> {dest:?}");
        fs::copy(file_path, dest)?;
    }
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![move_files_to_data_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
