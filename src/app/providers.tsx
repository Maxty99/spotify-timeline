'use client'

import SpotifyFileProvider from '@/components/spotify-file-provider';
import FilterStateProvider from '@/components/filter-state-provider';
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from "next-themes";


export function Providers({ children }: { children: React.ReactNode }) {


    return (
        <FilterStateProvider>
            <SpotifyFileProvider>
                <NextUIProvider>
                    <NextThemesProvider attribute="class" themes={["light", "dark"]}>
                        {children}
                    </NextThemesProvider>
                </NextUIProvider>
            </SpotifyFileProvider>
        </FilterStateProvider>
    )
}