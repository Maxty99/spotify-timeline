'use client'

import useSpotifyFile from "@/hooks/spotify-file-hook"
import { SpotifyHistoryEntry, renderTableCell } from "@/utils/spotify-history-file";
import { Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";
import { invoke } from "@tauri-apps/api/tauri";
import { createRef, useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function Timeline() {
    let spotify = useSpotifyFile();

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [list, setlist] = useState<SpotifyHistoryEntry[]>([]);

    useEffect(() => {
        console.log("running get total pages...")
        invoke<number>('get_number_of_spotify_file_pages')
            .then((number_of_pages) => {
                console.log(`set total pages to ${number_of_pages}`)
                setTotalPages(number_of_pages);
                console.log("set page to 1")
                setPage(1);
            })
            .catch(console.log);

    }, [spotify.context_storage])

    useEffect(() => {
        if (page) {
            console.log(`getting page ${page}...`)
            invoke<SpotifyHistoryEntry[]>('read_spotify_file_page', { page })
                .then((page_of_entries) => {
                    console.log("set list")
                    setlist(page_of_entries);
                    console.log("set loading to false")
                    setIsLoading(false);
                })
                .catch(console.log);
        }
    }, [page, spotify.context_storage])

    const onPaginationChange = useCallback(
        (page: number) => {
            setIsLoading(true);
            setPage(page);
        }, []
    );

    return (
        <Table
            isHeaderSticky
            removeWrapper
            selectionMode="none"
            aria-label="Spotify history table"
            bottomContent={
                totalPages > 0 ? (
                    <div className="flex w-full justify-center">
                        <Pagination
                            showControls
                            showShadow
                            color="primary"
                            page={page}
                            total={totalPages}
                            onChange={onPaginationChange}
                        />
                    </div>
                ) : null}
            bottomContentPlacement="outside"
            classNames={{
                base: "overflow-auto",
                table: "min-h-[400px]",
            }}
        >
            <TableHeader>
                <TableColumn key="song">Song</TableColumn>
                <TableColumn key="info">Info</TableColumn>
                <TableColumn key="link">Spotify URL</TableColumn>
            </TableHeader>
            <TableBody
                isLoading={isLoading}
                items={list}
                loadingContent={<Spinner color="white" />}
            >
                {(item) => (
                    <TableRow key={item.timestamp + item.spotify_track_uri}>
                        {(columnKey) => <TableCell>{renderTableCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}