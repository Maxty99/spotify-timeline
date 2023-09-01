// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod error;
mod filter_sort;
mod serde_chrono;
mod serde_spotify;
mod spotify_history_file;

use std::{fs, sync::Mutex};

use error::BackendError;

use filter_sort::{FilterSort, FilterSortOptions};
use spotify_history_file::{SpotifyHistoryEntry, SpotifyHistoryFile};
use tauri::State;

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
fn update_selected_file(
    app_handle: tauri::AppHandle,
    state: State<Mutex<FilterSort>>,
    filename: String,
) -> Result<(), BackendError> {
    let mut filter_sort = state
        .lock()
        .expect("If something panicked with this, chances are this is going to panic too");

    let history_file = filter_sort.access_data();

    if history_file.filename != filename {
        // refresh state to the new selected file
        let new_file_data = read_spotify_file(&app_handle, &filename)?;
        let new_history_file = SpotifyHistoryFile {
            filename,
            data: new_file_data,
        };

        filter_sort.change_file(new_history_file);
    }
    Ok(())
}

#[tauri::command]
fn update_filters(state: State<Mutex<FilterSort>>, filters: FilterSortOptions) {
    let mut filter_sort = state
        .lock()
        .expect("If something panicked with this, chances are this is going to panic too");

    filter_sort.update_filters(filters);
}

#[tauri::command]
fn read_spotify_file_page(
    state: State<Mutex<FilterSort>>,
    page: usize,
) -> Vec<SpotifyHistoryEntry> {
    let filter_sort = state
        .lock()
        .expect("If something panicked with this, chances are this is going to panic too");

    let history_file = filter_sort.access_data();

    let vec = history_file.get_page(page).to_vec();

    vec
}

#[tauri::command]
fn get_number_of_spotify_file_pages(state: State<Mutex<FilterSort>>) -> usize {
    let filter_sort = state
        .lock()
        .expect("If something panicked with this, chances are this is going to panic too");

    let history_file = filter_sort.access_data();

    let pages = history_file.get_number_of_pages();

    pages
}

fn read_spotify_file(
    app_handle: &tauri::AppHandle,
    name: &String,
) -> Result<Vec<SpotifyHistoryEntry>, BackendError> {
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
        .manage::<Mutex<FilterSort>>(Mutex::new(FilterSort::new(SpotifyHistoryFile {
            filename: String::from(""),
            data: vec![],
        })))
        .invoke_handler(tauri::generate_handler![
            move_files_to_data_folder,
            read_spotify_file_page,
            update_selected_file,
            get_number_of_spotify_file_pages,
            update_filters
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
