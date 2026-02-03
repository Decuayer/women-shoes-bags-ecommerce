'use client'

import { useEffect, useState } from 'react'
import { useLoading } from '@/context/LoadingContext'

export default function LoadingProgressBar() {
    const { isLoading } = useLoading()
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (isLoading) {
            setProgress(0)

            // Fast initial progress
            const timer1 = setTimeout(() => setProgress(30), 100)
            const timer2 = setTimeout(() => setProgress(60), 200)
            const timer3 = setTimeout(() => setProgress(80), 400)

            return () => {
                clearTimeout(timer1)
                clearTimeout(timer2)
                clearTimeout(timer3)
            }
        } else {
            // Complete the progress bar
            setProgress(100)

            // Reset after animation
            const resetTimer = setTimeout(() => setProgress(0), 400)
            return () => clearTimeout(resetTimer)
        }
    }, [isLoading])

    if (!isLoading && progress === 0) {
        return null
    }

    return (
        <div
            className="fixed top-0 left-0 right-0 h-1 bg-transparent z-[10000] pointer-events-none"
            style={{
                opacity: progress === 100 ? 0 : 1,
                transition: 'opacity 0.4s ease'
            }}
        >
            <div
                className="h-full bg-gradient-to-r from-secondary via-secondary-light to-secondary"
                style={{
                    width: `${progress}%`,
                    transition: progress === 100
                        ? 'width 0.3s ease, box-shadow 0.3s ease'
                        : 'width 0.3s ease, box-shadow 0.3s ease',
                    boxShadow: '0 0 10px rgba(201, 169, 89, 0.5)'
                }}
            />
        </div>
    )
}
