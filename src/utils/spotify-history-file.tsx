import SpotifyLink from "@/components/spotify-link";
import TableInfoCard from "@/components/table-info-card";
import TableSongCard from "@/components/table-song-card";

// Commented fields were previously present in
// spotify data downloads but now cause errors
// upon deserialization 
//
// The official sources are inconsistent:
// - ReadMe pdf states they should exist
// - https://support.spotify.com/us/article/understanding-my-data/ 
// 
// Just gonna remove them until spotify gets it together
// They weren't used anywhere anyway
export type SpotifyHistoryEntry = {
    timestamp: string;
    // username: string;
    platform: string;
    ms_played: number;
    conn_country: string;
    // ip_addr_decrypted: string;
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

export function renderTableCell(entry: SpotifyHistoryEntry, columnKey: React.Key) {
    switch (columnKey) {
        case "song":
            return (<TableSongCard spotify_entry={entry} />)
        case "info":
            return (<TableInfoCard spotify_entry={entry} />)
        case "link":
            return <SpotifyLink spotify_entry={entry} />
    }
}

export async function get_album_art_url(entry: SpotifyHistoryEntry): Promise<string | undefined> {
    if (!entry.spotify_track_uri) return undefined;

    const params = new URLSearchParams({
        url: "spotify:track:" + entry.spotify_track_uri
    });
    const resp = await fetch("https://open.spotify.com/oembed?" + params, {
        method: "GET",
    });
    const json = await resp.json()

    return json["thumbnail_url"];

}