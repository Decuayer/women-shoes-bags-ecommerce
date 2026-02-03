'use client'

import { createContext, useContext, useCallback, useState, ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
    id: string
    title?: string
    message: string
    type: ToastType
    duration?: number
}

interface ToastContextType {
    toasts: Toast[]
    addToast: (message: string, type: ToastType, options?: { title?: string; duration?: number }) => void
    removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((
        message: string,
        type: ToastType,
        options?: { title?: string; duration?: number }
    ) => {
        const id = Math.random().toString(36).substring(2, 9)

        // Default durations based on type
        const defaultDuration = type === 'error' ? 6000 : type === 'success' ? 4000 : 5000
        const duration = options?.duration ?? defaultDuration

        const toast: Toast = {
            id,
            message,
            type,
            title: options?.title,
            duration
        }

        setToasts((prev) => [...prev, toast])

        // Auto remove after specified duration
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, duration)
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
