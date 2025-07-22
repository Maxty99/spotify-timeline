import { SpotifyHistoryEntry } from "@/utils/spotify-history-file";
import { Link } from "@heroui/react";

export default function SpotifyLink(props: { spotify_entry: SpotifyHistoryEntry }) {
    if (props.spotify_entry.spotify_track_uri) {
        return (<Link
            isExternal
            href={`https://open.spotify.com/track/${props.spotify_entry.spotify_track_uri}`}
            showAnchorIcon
        >
            Spotify Link
        </Link>)
    } else {
        return (<Link
            isExternal
            isDisabled
            showAnchorIcon
        >
            No URI provided
        </Link>)
    }
}