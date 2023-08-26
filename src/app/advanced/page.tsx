'use client'

import useSpotifyFile from "@/hooks/spotify-file-hook"
import { SpotifyHistoryEntry, renderTableCell } from "@/utils/spotify-history-file";
import { Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";
import { invoke } from "@tauri-apps/api/tauri";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Timeline() {
    let spotify = useSpotifyFile();

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [list, setlist] = useState<SpotifyHistoryEntry[]>([]);

    useEffect(() => {
        invoke<number>('get_number_of_spotify_file_pages')
            .then((number_of_pages) => {
                setTotalPages(number_of_pages);
                setPage(1);
            })
            .catch(console.log);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spotify])

    useEffect(() => {
        invoke<SpotifyHistoryEntry[]>('read_spotify_file_page', { page })
            .then((page_of_entries) => {
                setlist(page_of_entries);
                setIsLoading(false);
            })
            .catch(console.log);
    }, [page])

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