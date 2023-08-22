'use client'

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AppNavbar from "@/components/navbar";
import { Providers } from "./providers";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spotify Timeline',
  description: 'Tool to visiually explore Spotify\'s extended listening history files',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AppNavbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
