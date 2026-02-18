'use client'

import { Bell } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

interface AdminHeaderProps {
    locale: string
}

export default function AdminHeader({ locale }: AdminHeaderProps) {
    const { user, loading } = useAuth()
    const pathname = usePathname()



    // Get user initials
    const getInitials = () => {
        if (!user) return 'U'
        const firstInitial = user.firstName?.charAt(0).toUpperCase() || ''
        const lastInitial = user.lastName?.charAt(0).toUpperCase() || ''
        return firstInitial + lastInitial || 'U'
    }

    // Get user display name
    const getDisplayName = () => {
        if (!user) return 'User'
        return `${user.firstName} ${user.lastName}`.trim() || 'User'
    }

    return (
        <header className="h-16 bg-surface border-b border-border sticky top-0 z-10 px-6 flex items-center justify-between">
            {/* Search */}
            <div className="relative w-96">

            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button
                    className="relative p-2 text-text-muted hover:text-text hover:bg-surface-light rounded-full transition-colors"
                    title={locale === 'tr' ? 'Bildirimler' : 'Notifications'}
                >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
                </button>



                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                    {loading ? (
                        <div className="text-right hidden md:block">
                            <div className="h-4 w-24 bg-surface-light rounded animate-pulse mb-1" />
                            <div className="h-3 w-32 bg-surface-light rounded animate-pulse" />
                        </div>
                    ) : (
                        <div className="text-right hidden md:block">
                            <div className="flex items-center gap-2 justify-end">
                                <p className="text-sm font-medium">{getDisplayName()}</p>
                                {user?.role && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${user.role === 'ADMIN'
                                        ? 'bg-secondary/20 text-secondary'
                                        : 'bg-surface-light text-text-muted'
                                        }`}>
                                        {user.role}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-text-muted">{user?.email || 'No email'}</p>
                        </div>
                    )}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user?.role === 'ADMIN' ? 'bg-gradient-to-br from-secondary to-secondary/70' : 'bg-gradient-to-br from-primary to-primary/70'
                        }`}>
                        {loading ? '...' : getInitials()}
                    </div>
                </div>
            </div>
        </header>
    )
}
