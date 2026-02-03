'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLoading } from '@/context/LoadingContext'

export default function LoadingSpinner() {
    const { isLoading } = useLoading()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!mounted || !isLoading) {
        return null
    }

    return createPortal(
        <div className="loading-overlay">
            <div className="loading-spinner-container">
                <div className="loading-spinner" />
            </div>
        </div>,
        document.body
    )
}
