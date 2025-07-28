
import { useContext } from "react";
import { FilterStateContext } from "@/components/filter-state-provider";

export default function useFilters() {
    return useContext(FilterStateContext);
}

