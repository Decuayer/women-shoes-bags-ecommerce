'use client'

import { useState } from 'react'
import {
    Truck,
    RefreshCw,
    Shield,
    CreditCard,
    Heart,
    Star,
    Award,
    Gift,
    Package,
    Clock,
    MapPin,
    Phone,
    Mail,
    Globe,
    CheckCircle,
    Info,
    AlertCircle,
    Zap,
    ThumbsUp,
    Umbrella,
    Search,
    X,
} from 'lucide-react'

// Map of icon names to components
export const iconMap: Record<string, any> = {
    Truck,
    RefreshCw,
    Shield,
    CreditCard,
    Heart,
    Star,
    Award,
    Gift,
    Package,
    Clock,
    MapPin,
    Phone,
    Mail,
    Globe,
    CheckCircle,
    Info,
    AlertCircle,
    Zap,
    ThumbsUp,
    Umbrella,
}

interface IconPickerProps {
    value: string
    onChange: (iconName: string) => void
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    // Filter icons based on search
    const filteredIcons = Object.keys(iconMap).filter((iconName) =>
        iconName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const SelectedIcon = iconMap[value] || iconMap['Truck']

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-surface hover:bg-surface-light transition-colors w-full"
            >
                <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
                    <SelectedIcon size={20} />
                </div>
                <span className="flex-1 text-left text-sm font-medium">{value}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-surface border border-border rounded-lg shadow-xl p-3 animate-fadeIn">
                    {/* Search */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                        <input
                            type="text"
                            placeholder="Search icons..."
                            className="w-full bg-surface-light border border-border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-secondary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                        {filteredIcons.map((iconName) => {
                            const IconComponent = iconMap[iconName]
                            const isSelected = value === iconName
                            return (
                                <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => {
                                        onChange(iconName)
                                        setIsOpen(false)
                                    }}
                                    className={`aspect-square flex items-center justify-center rounded-md transition-all ${isSelected
                                        ? 'bg-secondary text-primary'
                                        : 'hover:bg-surface-light text-text-muted hover:text-text'
                                        }`}
                                    title={iconName}
                                >
                                    <IconComponent size={20} />
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Backdrop to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}
