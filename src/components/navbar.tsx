'use client'

import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";

import { usePathname } from 'next/navigation';

import ThemeSwitcher from './theme-switcher';
import FilePicker from './file-picker';
import NextLink from "next/link";

export default function AppNavbar() {
    const pathname = usePathname();

    return (
        <Navbar isBordered maxWidth="full" className="flex-none">
            <NavbarContent justify="start">
                <FilePicker />
            </NavbarContent>
            <NavbarContent justify="center">

                <NavbarItem isActive={pathname == '/'} >
                    <Link href="/" as={NextLink} isBlock>
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={pathname == '/timeline'}>
                    <Link href="/timeline" as={NextLink} isBlock>
                        Timeline
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={pathname == '/calendar'}>
                    <Link href="/calendar" as={NextLink} isBlock>
                        Calendar
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={pathname == '/advanced'}>
                    <Link href="/advanced" as={NextLink} isBlock>
                        Advanced View
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