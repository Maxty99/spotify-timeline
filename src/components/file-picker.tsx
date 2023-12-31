'use client'

import { Button, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip } from "@nextui-org/react";
import Folder from "@/components/icons/folder";
import useSpotifyFile from "@/hooks/spotify-file-hook";
import { useEffect, useState } from "react";
import { BaseDirectory, FileEntry, readDir } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import ChevronDown from "@/components/icons/chevron-down";


export default function FilePicker() {
    let spotify = useSpotifyFile();

    let [files, setFiles] = useState<FileEntry[]>([]);
    useEffect(() => {
        readDir('', { dir: BaseDirectory.AppData, recursive: false })
            .then((read_files) => {
                setFiles(read_files);
            }).catch(console.log);
    }, [])

    const promptForFile = () => {
        open({
            directory: false,
            multiple: true,
            filters: [{
                name: "JSON File",
                extensions: ["json"]
            }]
        }).then((file_paths) => {
            if (file_paths) {
                // Ensuring filepaths is a flat array
                // in case user selects one it can be safely passed to rust
                // since rust needs it to be a Vec
                let file_paths_flat_arr = [file_paths].flat()
                invoke('move_files_to_data_folder', { paths: file_paths_flat_arr })
                    // Really odd chaining but kind of forced to do this to update the dropdown 
                    // with the newly added file(s)
                    .then(() => readDir('', { dir: BaseDirectory.AppData, recursive: false })
                        .then((read_files) => {
                            setFiles(read_files);
                        }).catch(console.log))
                    .catch(console.log)
            }
        })

    }

    return (
        <ButtonGroup>
            <Dropdown>
                <DropdownTrigger>
                    <Button
                        variant="bordered"
                        endContent={<ChevronDown />}
                    >
                        Choose a file
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    aria-label="History file selector"
                    disallowEmptySelection
                    // This fixes a random checkmark appearing if you select and close fast
                    selectionMode="none"
                    onAction={(key) => {
                        spotify.updateFileName(key.toString());
                    }}
                >
                    {files.filter((file_entry) => {
                        return file_entry.name != undefined
                    }).map((file_entry) => {
                        return <DropdownItem
                            endContent={file_entry.name == spotify.state ? "✓" : undefined}
                            key={file_entry.name}
                        >
                            {file_entry.name}
                        </DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
            <Tooltip content="Add files">
                <Button onClick={promptForFile} isIconOnly startContent={<Folder />}></Button>
            </Tooltip>

        </ButtonGroup >
    )
}