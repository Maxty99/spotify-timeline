'use client'

import { invoke } from "@tauri-apps/api/tauri";
import { Dispatch, SetStateAction, createContext, useMemo, useState } from "react";

export type ContextStorage = string;

type Context = {
    context_storage: ContextStorage,
    callback: (new_filename: string) => Promise<void>
};

export const SpotifyFileContext = createContext<Context>({
    context_storage: "",
    callback: async () => { } // Empty default
});

export default function SpotifyFileProvider({ children }: { children: React.ReactNode }) {
    let [context_storage, set_context_storage] = useState<ContextStorage>("")

    let provided_value: Context = {
        context_storage,
        callback: async (new_filename: string) => {
            invoke('update_selected_file', { filename: new_filename })
                .then(() => set_context_storage(new_filename))
                .catch(console.log)
        }
    }


    return (
        <SpotifyFileContext.Provider value={provided_value} >
            {children}
        </ SpotifyFileContext.Provider >
    )
}