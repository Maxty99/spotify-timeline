import Link from "next/link";
import { readDir, BaseDirectory } from '@tauri-apps/api/fs';

export default async function Navbar() {
    let environment = process.env.RUNNING_IN ?? 'web';


    return (
        <nav className="w-full h-16 bg-transparent">
            <div className="flex justify-between items-center h-full w-full px-5 2xl:px-16">
                <ul className="hidden md:flex pr-8">

                    <Link href="/" className="p-5">
                        <li>Home</li>
                    </Link>
                    <Link href="/timeline" className="p-5">
                        <li>Timeline</li>
                    </Link>
                    <Link href="/calendar" className="p-5">
                        <li>Calendar</li>
                    </Link>
                    <Link href="/advanced" className="p-5">
                        <li>Advanced View</li>
                    </Link>
                </ul>

            </div>
        </nav>
    )
}