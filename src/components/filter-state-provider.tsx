/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: above is temp fix, feels like I implemented this really weirdly
//       should probably refactor this whole filter stuff
"use client"

import { invoke } from "@tauri-apps/api/core"
import { createContext, useMemo, useState } from "react";


type SortingCategory = "NameAscending" | "NameDescending" | "DateAscending" | "DateDescending" | "NoSorting"

type DateRange = {
    start: Date,
    end: Date,
}

type FilterSortOptions = {
    date_range: DateRange,
    date_range_enabled: boolean
    filter_nulls: boolean,
    name_query: string,
    sorting: SortingCategory,
}

type FilterStateContextProvidedValue = {
    readonly state: FilterSortOptions,
    // Only here to trigger re-renders on change when apply is called
    readonly phantomData: number;
    updateDateRangeEnabled: (isEnabled: boolean) => void
    updateDateRangeStart: (newStartingDate: Date) => void
    updateDateRangeEnd: (newEndingDate: Date) => void
    updateFilterNulls: (newFilterNulls: boolean) => void
    updateNameQuery: (newNameQuery: string) => void
    updateSorting: (newSorting: SortingCategory) => void
    apply: () => Promise<void>
}

export const FilterStateContext = createContext<FilterStateContextProvidedValue>({
    state: {
        date_range: { start: new Date(0), end: new Date(Date.now()) },
        date_range_enabled: false,
        filter_nulls: false,
        name_query: "",
        sorting: "NoSorting"
    },
    phantomData: 1,
    //Empty last resort defaults
    updateDateRangeEnabled: (_isEnabled) => { },
    updateDateRangeStart: (_newStartingDate) => { },
    updateDateRangeEnd: (_newEndingDate) => { },
    updateFilterNulls: (_newFilterNulls) => { },
    updateNameQuery: (_newNameQuery) => { },
    updateSorting: (_newSorting) => { },
    apply: async () => { },
});

export default function FilterStateProvider({ children }: { children: React.ReactNode }) {
    const [dateRangeEnabled, setDateRangeEnabled] = useState(false);
    const [dateStart, setDateStart] = useState<Date>(new Date(0));
    const [dateEnd, setDateEnd] = useState<Date>(new Date(Date.now()))
    const [filterNulls, setFilterNulls] = useState(false);
    const [nameQuery, setNameQuery] = useState("");
    const [sorting, setSorting] = useState<SortingCategory>("NoSorting")
    const [phantomData, setPhantomData] = useState(1);

    const passedValue = useMemo<FilterStateContextProvidedValue>(() => {


        return {
            state: {
                date_range: { start: dateStart, end: dateEnd },
                date_range_enabled: dateRangeEnabled,
                filter_nulls: filterNulls,
                name_query: nameQuery,
                sorting,
            },
            phantomData,
            updateDateRangeEnabled: (isEnabled) => {
                setDateRangeEnabled(isEnabled);
            },
            updateDateRangeStart: (newStartingDate) => {
                setDateStart(newStartingDate);
            },
            updateDateRangeEnd: (newEndingDate) => {
                setDateEnd(newEndingDate);
            },
            updateFilterNulls: (newFilterNulls) => {
                setFilterNulls(newFilterNulls);
            },
            updateNameQuery: (newNameQuery) => {
                setNameQuery(newNameQuery);
            },
            updateSorting: (newSorting) => {
                setSorting(newSorting);
            },
            apply: () => invoke<void>("update_filters", {
                filters: {
                    date_range: dateRangeEnabled ?
                        { start: dateStart, end: dateEnd } :
                        undefined,
                    filter_nulls: filterNulls,
                    name_query: nameQuery,
                    sorting,
                }
            })
                .then(() => setPhantomData(phantomData + 1))
                .catch(console.log)
        }
    }, [dateEnd, dateRangeEnabled, dateStart, filterNulls, nameQuery, phantomData, sorting])


    return (
        <FilterStateContext.Provider value={passedValue} >
            {children}
        </ FilterStateContext.Provider >
    )
}