export type SpotifyHistoryEntry = {
  timestamp: string;
  username: string;
  platform: string;
  ms_played: number;
  conn_country: string;
  ip_addr_decrypted: string;
  user_agent_decrypted: string;
  master_metadata_track_name?: string;
  master_metadata_album_artist_name?: string;
  master_metadata_album_album_name?: string;
  spotify_track_uri?: string;
  consecutive: number;
};

export type SpotifyHistoryFile = {
  path: string;
  data: SpotifyHistoryEntry[];
};

//TODO: Add util functions
