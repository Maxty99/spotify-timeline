import Link from "next/link";

export default function NotFound() {
    return (
        <main className="">
            <p>How did this happen (Error not found)</p>
            <Link href={"/"}>
                <p> Back home</p>
            </Link>
        </main>
    )
}