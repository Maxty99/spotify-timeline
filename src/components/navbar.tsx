"use client"

import { Navbar, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Link } from "@heroui/link";

import { usePathname } from "next/navigation";

import ThemeSwitcher from "./theme-switcher";
import FilePicker from "./file-picker";
import NextLink from "next/link";

export default function AppNavbar() {
    const pathname = usePathname();

    return (
        <Navbar isBordered maxWidth="full" className="flex-none" position="static">
            <NavbarContent justify="start">
                <FilePicker />
            </NavbarContent>
            <NavbarContent justify="center">

                <NavbarItem isActive={pathname == "/"} >
                    <Link href="/" as={NextLink} isBlock>
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={pathname == "/advanced"}>
                    <Link href="/advanced" as={NextLink} isBlock>
                        Advanced View
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={pathname == "/random"} >
                    <Link href="/random" as={NextLink} isBlock>
                        Random
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <ThemeSwitcher />
                </NavbarItem>
            </NavbarContent>
        </Navbar >
    )
}