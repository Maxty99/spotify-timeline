"use client"

import useFilters from "@/hooks/filters-hook"
import { Button, Checkbox, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@heroui/react";
import ChevronDown from "@/components/icons/chevron-down";
import Search from "@/components/icons/search";
import { useCallback } from "react";

export default function Filters() {
    const filters = useFilters();

    // Gotta use these callbacks to format the date the way the input value wants 
    // while making sure inputs remain controlled
    const get_date_range_start_string = useCallback(() => filters.state.date_range.start.toISOString().replace("Z", ""), [filters.state.date_range.start]);
    const get_date_range_end_string = useCallback(() => filters.state.date_range.end.toISOString().replace("Z", ""), [filters.state.date_range.end]);

    return (<div className="flex flex-row gap-4 w-full justify-start items-center pt-1">

        <Checkbox isSelected={filters.state.filter_nulls} onValueChange={filters.updateFilterNulls}>
            Filter Nulled Entries
        </Checkbox>

        <Dropdown>
            <DropdownTrigger>
                <Button

                    variant="bordered"
                    endContent={<ChevronDown />}
                >
                    Sort Data
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Sorting Options"
                onAction={(key) => {
                    switch (key) {
                        case "name-ascending":
                            filters.updateSorting("NameAscending");
                            break;
                        case "name-descending":
                            filters.updateSorting("NameDescending");
                            break;
                        case "date-ascending":
                            filters.updateSorting("DateAscending");
                            break;
                        case "date-descending":
                            filters.updateSorting("DateDescending");
                            break;
                        default:
                            filters.updateSorting("NoSorting");
                    }
                }}
            >
                <DropdownItem
                    key="name-ascending"
                    endContent={filters.state.sorting == "NameAscending" ? "✓" : undefined}
                >
                    Name: Ascending
                </DropdownItem>
                <DropdownItem
                    key="name-descending"
                    endContent={filters.state.sorting == "NameDescending" ? "✓" : undefined}
                >
                    Name: Descending
                </DropdownItem>
                <DropdownItem
                    key="date-ascending"
                    endContent={filters.state.sorting == "DateAscending" ? "✓" : undefined}
                >
                    Date: Ascending
                </DropdownItem>
                <DropdownItem
                    key="date-descending"
                    endContent={filters.state.sorting == "DateDescending" ? "✓" : undefined}
                >
                    Date: Descending
                </DropdownItem>
                <DropdownItem
                    key="no-sort"
                    endContent={filters.state.sorting == "NoSorting" ? "✓" : undefined}
                >
                    No Sorting
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>

        <Input
            className="max-w-[300px]"
            label="Search by Name"
            labelPlacement="inside"
            startContent={<Search />}
            value={filters.state.name_query}
            onValueChange={filters.updateNameQuery}
            onClear={() => { filters.updateNameQuery("") }}
        />

        <div className="flex flex-row gap-4">
            <Checkbox
                isSelected={filters.state.date_range_enabled}
                onValueChange={filters.updateDateRangeEnabled}>
                Enable Date Filter
            </Checkbox>
            <input
                className="rounded"
                disabled={!filters.state.date_range_enabled}
                type="datetime-local"
                value={get_date_range_start_string()}
                onChange={(evt) => { filters.updateDateRangeStart(new Date(evt.target.value)) }}
                // This is because if you press delete it makes an invalid date and crashes in runtime 
                onKeyDown={(evt) => evt.preventDefault()}
            />
            <input
                className="rounded"
                disabled={!filters.state.date_range_enabled}
                type="datetime-local"
                value={get_date_range_end_string()}
                onChange={(evt) => { filters.updateDateRangeEnd(new Date(evt.target.value)) }}
                // This is because if you press delete it makes an invalid date and crashes in runtime 
                onKeyDown={(evt) => evt.preventDefault()}
            />
        </div>

        <Button
            onPress={() => filters.apply()}
        >
            Apply Filters
        </Button>

    </div >)
} 