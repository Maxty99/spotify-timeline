// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod error;
mod serde_chrono;
mod serde_spotify;
mod spotify_history_file;

use std::{fs, sync::Mutex};

use error::BackendError;

use serde::{Deserialize, Serialize};

use spotify_history_file::{SpotifyHistoryFile, SpotifyHistoryEntry};
use tauri::{Manager, State};

#[derive(Deserialize)]
struct Config {
    spotify: Spotify
}

#[derive(Deserialize, Serialize)]
struct Spotify {
    client_id: String,
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

    for file_path in paths.iter() {
        let file_name = file_path
            .split(|chr| -> bool { matches!(chr, '\\' | '/') })
            .last()
            .expect("Split of filepath must give at least one entry")
            .to_owned();
        let mut dest = data_folder.clone();
        dest.push(file_name);

        fs::copy(file_path, dest)?;
    }
    Ok(())
}

#[tauri::command]
fn get_spotify_secret_and_id(state: State<String>) -> Result<Spotify, BackendError> {
    let config = toml::from_str::<Config>(state.as_str())?;
    Ok(config.spotify)
}

#[tauri::command]
fn update_selected_file( 
    app_handle: tauri::AppHandle, 
    state: State<Mutex<SpotifyHistoryFile>>, 
    filename: String ) -> Result<(), BackendError> {
   
    let mut history_file = state.lock()
        .expect("If something panicked with this, chances are this is going to panic too");
    
    if history_file.filename != filename {
        
        // refresh state to the new selected file
        let new_file_data = read_spotify_file(&app_handle, &filename)?;
        history_file.filename = filename;
        history_file.data = new_file_data;

    }
    Ok(())
}


#[tauri::command]
fn read_spotify_file_page(
    state: State<Mutex<SpotifyHistoryFile>>, 
    page: usize) -> Vec<SpotifyHistoryEntry> {

    let history_file = state.lock()
        .expect("If something panicked with this, chances are this is going to panic too");
    
    let vec = history_file.get_page(page).to_vec();

    vec
}

#[tauri::command]
fn get_number_of_spotify_file_pages(state: State<Mutex<SpotifyHistoryFile>>) -> usize {

    let history_file = state.lock()
        .expect("If something panicked with this, chances are this is going to panic too");
    
    let pages = history_file.get_number_of_pages();

    pages
}



fn read_spotify_file(app_handle: &tauri::AppHandle, name: &String) -> Result<Vec<SpotifyHistoryEntry>, BackendError> {
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
        .manage::<Mutex<SpotifyHistoryFile>>(
            Mutex::new(SpotifyHistoryFile { 
                filename: String::from(""), 
                data: vec![] 
            })
        )
        .invoke_handler(tauri::generate_handler![move_files_to_data_folder, get_spotify_secret_and_id, read_spotify_file_page, update_selected_file, get_number_of_spotify_file_pages])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
