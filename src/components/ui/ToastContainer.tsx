'use client'

import { useToast } from '@/context/ToastContext'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'

function ToastItem({ toast, onRemove }: { toast: any; onRemove: () => void }) {
    const [progress, setProgress] = useState(100)
    const [isExiting, setIsExiting] = useState(false)

    useEffect(() => {
        const duration = toast.duration || 5000
        const interval = 50
        const decrement = (interval / duration) * 100

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev - decrement
                if (next <= 0) {
                    clearInterval(timer)
                    handleRemove()
                    return 0
                }
                return next
            })
        }, interval)

        return () => clearInterval(timer)
    }, [toast.duration])

    const handleRemove = () => {
        setIsExiting(true)
        setTimeout(onRemove, 300)
    }

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <CheckCircle size={22} className="flex-shrink-0" />
            case 'error':
                return <AlertCircle size={22} className="flex-shrink-0" />
            case 'warning':
                return <AlertTriangle size={22} className="flex-shrink-0" />
            case 'info':
                return <Info size={22} className="flex-shrink-0" />
        }
    }

    const getStyles = () => {
        switch (toast.type) {
            case 'success':
                return {
                    bg: 'bg-success/95 backdrop-blur-sm',
                    border: 'border-success',
                    text: 'text-white',
                    progress: 'bg-white/30'
                }
            case 'error':
                return {
                    bg: 'bg-error/95 backdrop-blur-sm',
                    border: 'border-error',
                    text: 'text-white',
                    progress: 'bg-white/30'
                }
            case 'warning':
                return {
                    bg: 'bg-warning/95 backdrop-blur-sm',
                    border: 'border-warning',
                    text: 'text-white',
                    progress: 'bg-white/30'
                }
            case 'info':
            default:
                return {
                    bg: 'bg-info/95 backdrop-blur-sm',
                    border: 'border-info',
                    text: 'text-white',
                    progress: 'bg-white/30'
                }
        }
    }

    const styles = getStyles()

    return (
        <div
            className={`
                toast-item relative overflow-hidden min-w-[320px] max-w-[420px]
                ${styles.bg} ${styles.text} 
                border ${styles.border}
                rounded-xl shadow-2xl
                transform transition-all duration-300 ease-out
                ${isExiting ? 'toast-exit' : 'toast-enter'}
            `}
            role="alert"
        >
            <div className="flex items-start gap-3 p-4">
                {/* Icon */}
                <div className="mt-0.5">
                    {getIcon()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {toast.title && (
                        <h4 className="font-bold text-sm mb-0.5">
                            {toast.title}
                        </h4>
                    )}
                    <p className="text-sm leading-relaxed opacity-95">
                        {toast.message}
                    </p>
                </div>

                {/* Close button */}
                <button
                    onClick={handleRemove}
                    className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                    aria-label="Close notification"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                <div
                    className={`h-full ${styles.progress} transition-all ease-linear`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    )
}

export default function ToastContainer() {
    const { toasts, removeToast } = useToast()

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastItem
                        toast={toast}
                        onRemove={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    )
}
