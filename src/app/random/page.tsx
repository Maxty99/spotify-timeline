'use client'

import SpotifyLink from "@/components/spotify-link"
import TableInfoCard from "@/components/table-info-card"
import TableSongCard from "@/components/table-song-card"
import { SpotifyHistoryEntry } from "@/utils/spotify-history-file"
import { Button } from "@nextui-org/react"
import { invoke } from "@tauri-apps/api/tauri"
import { useState } from "react"

export default function Random() {

    let [randomEntry, setRandomEntry] = useState<SpotifyHistoryEntry | undefined>(undefined)
    let [loading, setLoading] = useState(false);

    let getRandomEntry = () => {
        setLoading(true);
        invoke<SpotifyHistoryEntry>('get_random_entry')
            .then((entry) => {
                setRandomEntry(entry);
                setLoading(false);
            })
            .catch(console.log)
    };

    return (
        <main className="flex flex-1 flex-col gap-4 items-center justify-center">
            {randomEntry ?
                <div className="flex flex-col gap-1 items-center w-[50%]">
                    <TableSongCard spotify_entry={randomEntry} />
                    <TableInfoCard spotify_entry={randomEntry} />
                    <SpotifyLink spotify_entry={randomEntry} />
                </div> : null}

            <Button onPress={getRandomEntry}> Get Random Entry </Button>
        </main>
    )
}