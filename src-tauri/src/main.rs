// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod error;
mod serde_chrono;
mod serde_spotify;

use std::{fs, path::PathBuf};

use chrono::Utc;
use error::BackendError;
use serde::{Deserialize, Serialize};
use serde_chrono::{deserialize_datetime, serialize_datetime, deserialize_milis, serialize_milis};
use serde_spotify::TrackURI;
use tauri::{Manager, State};

// Annoying thing I have todo becasue serde default
// doesn't support literals
fn return_one() -> u64 {
    1
}

#[derive(Deserialize, Serialize)]
struct SpotifyHistoryEntry {
    #[serde(rename(deserialize = "ts"))]
    #[serde(deserialize_with = "deserialize_datetime")]
    #[serde(serialize_with = "serialize_datetime")]
    timestamp: chrono::DateTime<Utc>,
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
    #[serde(default = "return_one")]
    consecutive: u64
}

#[derive(Serialize)]
struct SpotifyHistoryFile {
    path: PathBuf,
    data: Vec<SpotifyHistoryEntry>,
}

#[derive(Deserialize)]
struct Config {
    spotify: Spotify
}

#[derive(Deserialize)]
struct Spotify {
    secret: String
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

#[tauri::command]
fn get_spotify_secret(state: State<String>) -> Result<String, BackendError> {
    let config = toml::from_str::<Config>(state.as_str())?;
    Ok(config.spotify.secret)
}

#[tauri::command]
fn read_spotify_file(app_handle: tauri::AppHandle, name: String) -> Result<Vec<SpotifyHistoryEntry>, BackendError> {
    let mut data_folder = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or(BackendError::CouldNotGetDataDir)?;
    data_folder.push(name);

    let json_string = fs::read_to_string(data_folder)?;

    let mut spotify_entries = serde_json::from_str::<Vec<SpotifyHistoryEntry>>(&json_string)?;
    // Optimize consecutive duplicates in rust for speed
    spotify_entries.dedup_by(|a, b| {
        if a.master_metadata_track_name == b.master_metadata_track_name {
            b.consecutive += a.consecutive;
            true
        } else {
            false
        }
    });
    Ok(spotify_entries)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let main_window = app.get_window("main");
            let file_read_result = tauri::api::file::read_string("./spotify_config.toml");
            if let Ok(toml_string) = file_read_result {
                app.manage(toml_string);
            } else {
                // Add an empty string to state otherwise app crashes on launch
                app.manage(String::from(""));
                // Can't read the file (missing/permissions)
                // Can't end with err because it just closes immediately 
                tauri::api::dialog::message(main_window.as_ref(), "Warning", "Could not read the spotify_config.toml file, please make sure it exists and is readable. The program will not work correctly without it")
            }
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![move_files_to_data_folder, get_spotify_secret, read_spotify_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
