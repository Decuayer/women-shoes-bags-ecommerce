'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLoading } from '@/context/LoadingContext'

export function useNavigationLoading() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { showLoading, hideLoading } = useLoading()
    const isFirstRender = useRef(true)

    useEffect(() => {
        // Skip showing loading on first render
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        // Show loading when navigation starts
        showLoading()

        // Hide loading after a short delay to ensure smooth transition
        const timer = setTimeout(() => {
            hideLoading()
        }, 100)

        return () => clearTimeout(timer)
    }, [pathname, searchParams, showLoading, hideLoading])

    // Hide loading when route changes complete
    useEffect(() => {
        hideLoading()
    }, [pathname, searchParams, hideLoading])

    return { showLoading, hideLoading }
}
