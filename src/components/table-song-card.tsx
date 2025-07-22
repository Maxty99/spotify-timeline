'use client'


import { SpotifyHistoryEntry, get_album_art_url } from "@/utils/spotify-history-file";
import { Badge, Card, CardBody, Image, Tooltip } from "@heroui/react";
import { useEffect, useState } from "react";

export default function TableSongCard(props: { spotify_entry: SpotifyHistoryEntry }) {
    const entry = props.spotify_entry;

    let [thumbnail, setThumbnail] = useState<string | undefined>(undefined);
    let [loading, setLoading] = useState(true)

    useEffect(() => {
        get_album_art_url(entry)
            .then((url) => { setThumbnail(url) })
            .catch(console.log)
            .finally(() => setLoading(false))
    })

    return (
        <Card
            isFooterBlurred
            radius="lg"
            className="border-none max-h-[200px] w-full"
        >
            <div className="flex felx-row">
                <Image
                    alt="Album Art"
                    className="object-cover"
                    isLoading={loading}
                    loading="lazy"
                    src={thumbnail ?? "fallback_album_art.svg"}
                    width={200}
                    height={200}
                />
                <CardBody>
                    <div className="grid grid-cols-2 min-w-0">
                        <Tooltip delay={2000} content={entry.master_metadata_track_name}>
                            <p className="truncate max-w-full justify-self-start font-bold sm:md:text-sm md:text-base lg:text-lg">{entry.master_metadata_track_name ?? "Not Found"}</p>
                        </Tooltip>
                        <p className="truncate max-w-full justify-self-end sm:md:text-xs md:text-xs lg:text-sm">{entry.master_metadata_album_artist_name ?? "Not Found"} </p>
                        <Tooltip delay={2000} content={entry.master_metadata_album_album_name} placement="bottom">
                            <p className="truncate max-w-full justify-self-start sm:md:text-xs md:text-xs lg:text-sm">{entry.master_metadata_album_album_name ?? "Not Found"} </p>
                        </Tooltip>
                    </div>
                </CardBody>
            </div >
        </Card >
    )
}