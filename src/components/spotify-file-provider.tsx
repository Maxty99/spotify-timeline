'use client'

import { Dispatch, SetStateAction, createContext, useMemo, useState } from "react";

type SpotifyHistoryEntry = {

    timestamp: string,
    username: string,
    platform: string,
    ms_played: number,
    conn_country: string,
    ip_addr_decrypted: string,
    user_agent_decrypted: string,
    master_metadata_track_name?: string,
    master_metadata_album_artist_name?: string,
    master_metadata_album_album_name?: string,
    spotify_track_uri?: string,
}

export type SpotifyHistoryFile = {
    path: string,
    data: SpotifyHistoryEntry[],
}


export type ContextStorage = string | undefined;

type Context = {
    context_storage: ContextStorage,
    callback: Dispatch<SetStateAction<ContextStorage>>
};

export const SpotifyFileContext = createContext<Context>({
    context_storage: undefined,
    callback: () => { } // Empty default
});

export default function SpotifyFileProvider({ children }: { children: React.ReactNode }) {
    let [context_storage, callback] = useState<ContextStorage>(undefined)

    let memo = useMemo(() => { return { context_storage, callback } }, [context_storage, callback])

    return (
        <SpotifyFileContext.Provider value={memo}>
            {children}
        </ SpotifyFileContext.Provider >
    )
}