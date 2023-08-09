'use client'

import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'

export default function Greet() {
    let [getStr, setStr] = useState("")
    useEffect(() => {
        invoke<string>('greet', { name: 'Next.js' })
            .then(setStr)
            .catch(console.error)
    }, [])

    return <>{getStr}</>
}