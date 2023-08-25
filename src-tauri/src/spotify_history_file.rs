use serde::{Deserialize, Serialize};

use crate::serde_chrono::{deserialize_milis, serialize_milis};
use crate::serde_spotify::TrackURI;

const ENTRIES_PER_PAGE: usize = 50;

// Annoying thing I have todo becasue serde default
// doesn't support literals
fn return_one() -> u64 {
    1
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct SpotifyHistoryEntry {
    #[serde(rename(deserialize = "ts"))]
    pub timestamp: String,
    pub username: String,
    pub platform: String,
    #[serde(deserialize_with = "deserialize_milis")]
    #[serde(serialize_with = "serialize_milis")]
    pub ms_played: chrono::Duration,
    pub conn_country: String,
    pub ip_addr_decrypted: String,
    pub user_agent_decrypted: String,
    pub master_metadata_track_name: Option<String>,
    pub master_metadata_album_artist_name: Option<String>,
    pub master_metadata_album_album_name: Option<String>,
    pub spotify_track_uri: Option<TrackURI>,
    #[serde(default = "return_one")]
    pub consecutive: u64,
}

#[derive(Serialize, Debug)]
pub struct SpotifyHistoryFile {
    pub filename: String,
    pub data: Vec<SpotifyHistoryEntry>,
}

impl SpotifyHistoryFile {
    pub fn get_page(&self, page: usize) -> &[SpotifyHistoryEntry] {
        //Special empty case
        if self.data.len() == 0 {
            return &[];
        }

        let highest_idx = self.data.len() - 1;
        let start_idx = 0 + ((page - 1) * ENTRIES_PER_PAGE);
        let end_idx = ENTRIES_PER_PAGE + ((page - 1) * ENTRIES_PER_PAGE);
        if (start_idx < highest_idx) && (end_idx < highest_idx) {
            &self.data[start_idx..end_idx]
        } else if (start_idx < highest_idx) && (end_idx >= highest_idx) {
            &self.data[start_idx..]
        } else {
            &[]
        }
    }
}
