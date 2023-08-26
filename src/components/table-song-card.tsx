'use client'


import { SpotifyHistoryEntry, get_album_art_url } from "@/utils/spotify-history-file";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useEffect, useState } from "react";

//TODO: Redisign more like: https://nextui.org/docs/components/card#blurred-card
export default function TableSongCard(props: { spotify_entry: SpotifyHistoryEntry }) {
    let [thumbnail, setThumbnail] = useState<string | undefined>(undefined);
    let [loading, setLoading] = useState(true)

    useEffect(() => {
        get_album_art_url(props.spotify_entry)
            .then((url) => { setThumbnail(url) })
            .catch(console.log)
            .finally(() => setLoading(false))
    })


    return (<Card
        isFooterBlurred
        radius="lg"
        className="border-none"
    >
        <Image
            alt="Album Art"
            className="object-cover"
            isLoading={loading}
            height={200}
            src={thumbnail}
            width={200}
        />
        <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">Available soon.</p>
            <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                Notify me
            </Button>
        </CardFooter>
    </Card>)
}