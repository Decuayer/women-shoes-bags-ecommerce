'use client'

import { useEffect } from 'react'
import { AlertTriangle, Info, Trash2, X } from 'lucide-react'

export type DialogVariant = 'danger' | 'warning' | 'info'

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: DialogVariant
    loading?: boolean
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Onayla',
    cancelText = 'İptal',
    variant = 'info',
    loading = false
}: ConfirmDialogProps) {
    // Handle ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !loading) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, loading, onClose])

    if (!isOpen) return null

    const getIcon = () => {
        switch (variant) {
            case 'danger':
                return <Trash2 className="text-error" size={48} />
            case 'warning':
                return <AlertTriangle className="text-warning" size={48} />
            case 'info':
                return <Info className="text-info" size={48} />
        }
    }

    const getButtonStyle = () => {
        switch (variant) {
            case 'danger':
                return 'bg-error hover:bg-error/90 text-white'
            case 'warning':
                return 'bg-warning hover:bg-warning/90 text-white'
            case 'info':
                return 'bg-info hover:bg-info/90 text-white'
        }
    }

    return (
        <div className="dialog-overlay" onClick={loading ? undefined : onClose}>
            <div
                className="dialog-content"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-light transition-colors disabled:opacity-50"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    {getIcon()}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center mb-3">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-text-muted text-center mb-8 leading-relaxed">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 btn btn-secondary disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 btn ${getButtonStyle()} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>İşleniyor...</span>
                            </div>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
