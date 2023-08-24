'use client'

import TimelineBlock from "@/components/timeline-block";
import useSpotifyFile from "@/hooks/spotify-file-hook"
import { SpotifyHistoryEntry } from "@/utils/spotify-history-file";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

export default function Timeline() {
    let spotify = useSpotifyFile();
    let [entries, setEntries] = useState<SpotifyHistoryEntry[]>([]);

    useEffect(() => {
        invoke<SpotifyHistoryEntry[]>('read_spotify_file', { name: spotify.context_storage })
            .then((read_entries) => { setEntries(read_entries) })
            .catch(console.log)
    }, [spotify])

    return (
        <main className="flex flex-1 items-center">
            <div className="flex flex-row">
                {entries.map((entry) => {
                    return <TimelineBlock key={entry.timestamp} spotify_entry={entry} />
                })}
            </div>
        </main>
    )
}