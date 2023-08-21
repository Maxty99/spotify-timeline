'use client'

import { Dispatch, SetStateAction, createContext, useMemo, useState } from "react";

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