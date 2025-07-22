'use client'

import { invoke } from "@tauri-apps/api/core"
import { createContext, useState } from "react";

type SpotifyFileContextProvidedValue = {
    readonly state: string,
    updateFileName: (new_filename: string) => Promise<void>
};

export const SpotifyFileContext = createContext<SpotifyFileContextProvidedValue>({
    state: "",
    updateFileName: async () => { } // Empty default
});

export default function SpotifyFileProvider({ children }: { children: React.ReactNode }) {
    let [fileName, setFileName] = useState("")

    let passedValue: SpotifyFileContextProvidedValue = {
        state: fileName,
        updateFileName: async (newFileName: string) => {
            invoke('update_selected_file', { filename: newFileName })
                .then(() => setFileName(newFileName))
                .catch(console.log)
        }
    }


    return (
        <SpotifyFileContext.Provider value={passedValue} >
            {children}
        </ SpotifyFileContext.Provider >
    )
}