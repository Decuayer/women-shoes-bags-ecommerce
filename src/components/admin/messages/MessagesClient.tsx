'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FormatDate } from '@/utils/format'
import { Loader2, CheckCircle, Mail, Clock, Search, Trash2 } from 'lucide-react'
import { useToast } from '@/context/ToastContext'

interface Message {
    id: string
    name: string
    email: string
    subject: string
    message: string
    isRead: boolean
    createdAt: string
}

interface MessagesClientProps {
    locale: string
}

export default function MessagesClient({ locale }: MessagesClientProps) {
    const isTr = locale === 'tr'
    const router = useRouter()
    const { addToast } = useToast()
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState('')
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/admin/messages')
            if (res.ok) {
                const data = await res.json()
                setMessages(data)
            }
        } catch (error) {
            console.error('Failed to fetch messages', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setMessages(msgs => msgs.map(m => m.id === id ? { ...m, isRead: !currentStatus } : m))
        if (selectedMessage && selectedMessage.id === id) {
            setSelectedMessage({ ...selectedMessage, isRead: !currentStatus })
        }

        try {
            const res = await fetch('/api/admin/messages', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isRead: !currentStatus })
            })

            if (!res.ok) throw new Error('Failed to update')

            addToast(
                isTr ? 'Mesaj durumu güncellendi' : 'Message status updated',
                'success'
            )
        } catch (error) {
            // Revert
            setMessages(msgs => msgs.map(m => m.id === id ? { ...m, isRead: currentStatus } : m))
            if (selectedMessage && selectedMessage.id === id) {
                setSelectedMessage({ ...selectedMessage, isRead: currentStatus })
            }
            addToast(
                isTr ? 'Güncelleme başarısız' : 'Update failed',
                'error'
            )
        }
    }

    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(filter.toLowerCase()) ||
        m.email.toLowerCase().includes(filter.toLowerCase()) ||
        m.subject.toLowerCase().includes(filter.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="animate-spin text-secondary" size={40} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">{isTr ? 'Gelen Mesajlar' : 'Inbox Messages'}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* List */}
                <div className="lg:col-span-1 bg-surface border border-border rounded-xl flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-border">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                className="input w-full !pl-10"
                                placeholder={isTr ? 'Ara...' : 'Search...'}
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {filteredMessages.length === 0 ? (
                            <div className="p-8 text-center text-text-muted">
                                {isTr ? 'Mesaj bulunamadı' : 'No messages found'}
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {filteredMessages.map(msg => (
                                    <button
                                        key={msg.id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className={`w-full text-left p-4 hover:bg-surface-light transition-colors ${selectedMessage?.id === msg.id ? 'bg-secondary/5 border-l-4 border-secondary' : 'border-l-4 border-transparent'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-sm font-medium ${msg.isRead ? 'text-text-muted' : 'text-text-dark'}`}>
                                                {msg.name}
                                            </span>
                                            <span className="text-xs text-text-muted">
                                                {new Date(msg.createdAt).toLocaleDateString(isTr ? 'tr-TR' : 'en-US')}
                                            </span>
                                        </div>
                                        <p className={`text-sm truncate ${msg.isRead ? 'text-text-muted font-normal' : 'text-text font-semibold'}`}>
                                            {msg.subject}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-2 bg-surface border border-border rounded-xl h-full flex flex-col">
                    {selectedMessage ? (
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-border flex justify-between items-start bg-secondary/5">
                                <div>
                                    <h2 className="text-xl font-bold mb-2">{selectedMessage.subject}</h2>
                                    <div className="flex items-center gap-4 text-sm text-text-muted">
                                        <div className="flex items-center gap-1">
                                            <Mail size={16} />
                                            {selectedMessage.email}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock size={16} />
                                            {new Date(selectedMessage.createdAt).toLocaleString(isTr ? 'tr-TR' : 'en-US')}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleMarkAsRead(selectedMessage.id, selectedMessage.isRead)}
                                    className={`btn btn-sm gap-2 ${selectedMessage.isRead ? 'btn-outline' : 'btn-primary'}`}
                                >
                                    <CheckCircle size={16} />
                                    {selectedMessage.isRead ? (isTr ? 'Okunmadı İşaretle' : 'Mark Unread') : (isTr ? 'Okundu İşaretle' : 'Mark Read')}
                                </button>
                            </div>
                            <div className="p-8 overflow-y-auto flex-1 whitespace-pre-wrap leading-relaxed text-text">
                                {selectedMessage.message}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-text-muted p-8 text-center">
                            <Mail size={64} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium">{isTr ? 'Görüntülemek için bir mesaj seçin' : 'Select a message to view details'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
