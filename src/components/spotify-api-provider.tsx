'use client'

import { invoke } from '@tauri-apps/api/tauri';
import { createContext, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';


export const SpotifyApiContext = createContext<SpotifyWebApi>(new SpotifyWebApi());

export default function SpotifyApiProvider({ children }: { children: React.ReactNode }) {
    let api = new SpotifyWebApi();

    useEffect(() => {
        invoke<string>('get_spotify_secret')
            .then((secret) => {
                api.setClientSecret(secret);
            })
            .catch(console.log)
    })

    return (
        <SpotifyApiContext.Provider value={api}>
            {children}
        </ SpotifyApiContext.Provider >
    )
}