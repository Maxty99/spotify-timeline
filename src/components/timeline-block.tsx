import { SpotifyHistoryEntry } from "@/utils/spotify-history-file"
import { Card } from "@heroui/react"

export default function TimelineBlock(props: { spotify_entry: SpotifyHistoryEntry }) {
    let parsed_date = Date.parse(props.spotify_entry.timestamp);
    return (
        <Card className="mx-4">
            {props.spotify_entry.consecutive == 1 ?
                `{${parsed_date}}` :
                `{${parsed_date} x ${props.spotify_entry.consecutive}}`}
        </Card>
    )
}