'use client'

import { Bell, Search } from 'lucide-react'

interface AdminHeaderProps {
    locale: string
}

export default function AdminHeader({ locale }: AdminHeaderProps) {
    return (
        <header className="h-16 bg-surface border-b border-border sticky top-0 z-10 px-6 flex items-center justify-between">
            {/* Search */}
            <div className="relative w-96">

            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-text-muted hover:text-text hover:bg-surface-light rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-xs text-text-muted">admin@example.com</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                        A
                    </div>
                </div>
            </div>
        </header>
    )
}
