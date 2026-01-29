'use client'

import { useToast, ToastType } from '@/context/ToastContext'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ToastContainer() {
    const { toasts, removeToast } = useToast()

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out
                        ${toast.type === 'success' ? 'bg-green-600 text-white' : ''}
                        ${toast.type === 'error' ? 'bg-red-600 text-white' : ''}
                        ${toast.type === 'info' ? 'bg-blue-600 text-white' : ''}
                    `}
                    role="alert"
                >
                    {toast.type === 'success' && <CheckCircle size={20} />}
                    {toast.type === 'error' && <AlertCircle size={20} />}
                    {toast.type === 'info' && <Info size={20} />}

                    <span className="font-medium text-sm">{toast.message}</span>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    )
}
