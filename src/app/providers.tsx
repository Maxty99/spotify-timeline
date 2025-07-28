"use client"

import SpotifyFileProvider from "@/components/spotify-file-provider";
import FilterStateProvider from "@/components/filter-state-provider";
import { HeroUIProvider } from "@heroui/react"
import { ThemeProvider as NextThemesProvider } from "next-themes";


export function Providers({ children }: { children: React.ReactNode }) {


    return (
        <FilterStateProvider>
            <SpotifyFileProvider>
                <HeroUIProvider>
                    <NextThemesProvider attribute="class" themes={["light", "dark"]} >
                        {children}
                    </NextThemesProvider>
                </HeroUIProvider>
            </SpotifyFileProvider>
        </FilterStateProvider>
    )
}