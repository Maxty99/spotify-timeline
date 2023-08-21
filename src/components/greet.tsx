'use client'

import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'

export default function Greet(props: { name: String }) {
    let [getStr, setStr] = useState("")
    useEffect(() => {
        invoke<string>('greet', { name: props.name })
            .then(setStr)
            .catch(console.error)
    }, [props.name])

    return <>{getStr}</>
}