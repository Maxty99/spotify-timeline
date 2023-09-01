'use client'

import useSpotifyFile from "@/hooks/spotify-file-hook"
import { SpotifyHistoryEntry, renderTableCell } from "@/utils/spotify-history-file";
import { Input, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { invoke } from "@tauri-apps/api/tauri";
import { useCallback, useEffect, useMemo, useState } from "react";
import Filters from "@/components/filters";
import useFilters from "@/hooks/filters-hook";

export default function Advanced() {
    let spotify = useSpotifyFile();
    let filters = useFilters();


    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [list, setlist] = useState<SpotifyHistoryEntry[]>([]);
    const [validPageSelected, setValidPageSelected] = useState(true);

    useEffect(() => {
        invoke<number>('get_number_of_spotify_file_pages')
            .then((number_of_pages) => {
                setTotalPages(number_of_pages);
                setPage(1);
            })
            .catch(console.log);

    }, [spotify.state, filters.phantomData])

    useEffect(() => {
        if (page) {
            invoke<SpotifyHistoryEntry[]>('read_spotify_file_page', { page })
                .then((page_of_entries) => {
                    setlist(page_of_entries);
                    setIsLoading(false);
                })
                .catch(console.log);
        }
    }, [page, spotify.state, filters.phantomData])

    const onPaginationChange = useCallback(
        (page: number) => {
            setIsLoading(true);
            setPage(page);
        }, []
    );

    const onJumpToPageChange = useCallback(
        (page_string: string) => {
            let new_page = parseInt(page_string);
            if (new_page == page) return;
            if (new_page < totalPages && new_page > 0) {
                setIsLoading(true);
                setValidPageSelected(true);
                setPage(new_page);
            } else {
                setValidPageSelected(false)
            }
        }, [page, totalPages]
    );

    let bottomContent = useMemo(() => {
        return (<div className="flex items-center">
            <Pagination
                showControls
                showShadow
                siblings={3}
                color="primary"
                page={page}
                total={totalPages}
                onChange={onPaginationChange}
            />

            <Input
                className="max-w-[200px] px-5"
                type="number"
                label="Jump to page"
                placeholder={"0"}
                color={validPageSelected ? "default" : "danger"}
                onValueChange={onJumpToPageChange}
                labelPlacement="inside"
            />
        </div>)

    }, [page, totalPages, onPaginationChange, validPageSelected, onJumpToPageChange])

    return (
        <Table
            isHeaderSticky
            removeWrapper
            className="p-2"
            selectionMode="none"
            aria-label="Spotify history table"
            bottomContent={
                totalPages > 0 ? (
                    <div className="flex w-full justify-center">
                        {bottomContent}
                    </div>
                ) : null}
            bottomContentPlacement="inside"
            topContent={
                <Filters />
            }
            topContentPlacement="inside"
        >
            <TableHeader>
                <TableColumn width={"50%"} key="song">Song</TableColumn>
                <TableColumn width={"40%"} key="info">Info</TableColumn>
                <TableColumn width={"10%"} key="link">Spotify URL</TableColumn>
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