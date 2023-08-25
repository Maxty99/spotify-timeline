'use client'

import useSpotifyFile from "@/hooks/spotify-file-hook"
import { SpotifyHistoryEntry } from "@/utils/spotify-history-file";
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

export default function Timeline() {
    let spotify = useSpotifyFile();
    let [hasMore, setHasMore] = useState(true);

    let list = useAsyncList<SpotifyHistoryEntry, number>({
        async load({ signal, cursor }) {
            if (cursor) {
                try {
                    let read_entries = await invoke<SpotifyHistoryEntry[]>('read_spotify_file_page', { page: cursor, filename: spotify.context_storage });
                    setHasMore(read_entries.length != 0);
                    return { items: read_entries, cursor: cursor + 1 };
                } catch (error) {
                    console.error(error);
                    setHasMore(false)
                    return { items: [], error: error }; // TODO: handle error
                }
            } else {
                try {
                    let read_entries = await invoke<SpotifyHistoryEntry[]>('read_spotify_file_page', { page: 1, filename: spotify.context_storage });
                    setHasMore(read_entries.length != 0);
                    return { items: read_entries, cursor: 2 };
                } catch (error) {
                    console.error(error);
                    setHasMore(false)
                    return { items: [], error: error }; // TODO: handle error
                }
            }
        }
    });

    // I want to reload the list when I change the file
    useEffect(() => {
        list.reload()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spotify.context_storage])


    const [loaderRef, scrollerRef] = useInfiniteScroll({ hasMore, onLoadMore: list.loadMore });

    console.log(list, hasMore)
    // return (
    //     <main className="flex flex-1 items-center">
    //         <div className="flex flex-row">
    //             {list.items.map((entry, idx) => {
    //                 return <TimelineBlock key={idx} spotify_entry={entry} />
    //             })}
    //         </div>
    //     </main>
    // )
    return (
        <Table
            isHeaderSticky
            aria-label="Example table with infinite pagination"
            baseRef={scrollerRef}
            bottomContent={
                hasMore ? (
                    <div className="flex w-full justify-center">
                        <Spinner ref={loaderRef} color="white" />
                    </div>
                ) : null
            }
            classNames={{
                base: "overflow-auto",
                table: "min-h-[400px]",
            }}
        >
            <TableHeader>
                <TableColumn key="timestamp">Date</TableColumn>
                <TableColumn key="username">Username</TableColumn>
                <TableColumn key="spotify_track_uri">Spotify URL</TableColumn>
            </TableHeader>
            <TableBody
                isLoading={list.isLoading}
                items={list.items}
                loadingContent={<Spinner color="white" />}
            >
                {(item) => (
                    <TableRow key={item.timestamp + item.spotify_track_uri}>
                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}