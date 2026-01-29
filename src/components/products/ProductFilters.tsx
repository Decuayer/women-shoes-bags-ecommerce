'use client'

import { useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react'

interface Category {
    id: string
    slug: string
    name: string
}

interface ProductFiltersProps {
    locale: string
    categories: Category[]
    colors: string[]
    sizes: string[]
}

export default function ProductFilters({ locale, categories, colors, sizes }: ProductFiltersProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const isTr = locale === 'tr'

    const currentCategory = searchParams.get('category') || ''
    const currentColor = searchParams.get('color') || ''
    const currentSize = searchParams.get('size') || ''
    const currentMinPrice = searchParams.get('minPrice') || ''
    const currentMaxPrice = searchParams.get('maxPrice') || ''

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        params.delete('page') // Reset to page 1 when filtering
        router.push(`${pathname}?${params.toString()}`)
    }

    const clearAllFilters = () => {
        router.push(pathname)
    }

    const hasFilters = currentCategory || currentColor || currentSize || currentMinPrice || currentMaxPrice

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Categories */}
            <div>
                <h3 className="font-medium mb-3 flex items-center justify-between">
                    {isTr ? 'Kategoriler' : 'Categories'}
                    <ChevronDown size={16} className="text-text-muted" />
                </h3>
                <div className="space-y-2">
                    <button
                        onClick={() => updateFilter('category', '')}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!currentCategory ? 'bg-secondary text-primary' : 'text-text-muted hover:bg-surface-light'
                            }`}
                    >
                        {isTr ? 'Tüm Kategoriler' : 'All Categories'}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => updateFilter('category', cat.slug)}
                            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${currentCategory === cat.slug ? 'bg-secondary text-primary' : 'text-text-muted hover:bg-surface-light'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Colors */}
            <div>
                <h3 className="font-medium mb-3">{isTr ? 'Renk' : 'Color'}</h3>
                <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                        <button
                            key={color}
                            onClick={() => updateFilter('color', currentColor === color ? '' : color)}
                            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${currentColor === color
                                    ? 'border-secondary bg-secondary text-primary'
                                    : 'border-border text-text-muted hover:border-secondary'
                                }`}
                        >
                            {color}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sizes */}
            <div>
                <h3 className="font-medium mb-3">{isTr ? 'Numara' : 'Size'}</h3>
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => updateFilter('size', currentSize === size ? '' : size)}
                            className={`w-12 h-10 rounded-lg text-sm border transition-colors ${currentSize === size
                                    ? 'border-secondary bg-secondary text-primary'
                                    : 'border-border text-text-muted hover:border-secondary'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-medium mb-3">{isTr ? 'Fiyat Aralığı' : 'Price Range'}</h3>
                <div className="flex gap-3">
                    <input
                        type="number"
                        placeholder={isTr ? 'Min' : 'Min'}
                        value={currentMinPrice}
                        onChange={(e) => updateFilter('minPrice', e.target.value)}
                        className="input w-1/2 text-sm"
                    />
                    <input
                        type="number"
                        placeholder={isTr ? 'Max' : 'Max'}
                        value={currentMaxPrice}
                        onChange={(e) => updateFilter('maxPrice', e.target.value)}
                        className="input w-1/2 text-sm"
                    />
                </div>
                <p className="text-xs text-text-dark mt-2">TL</p>
            </div>

            {/* Clear Filters */}
            {hasFilters && (
                <button
                    onClick={clearAllFilters}
                    className="btn btn-secondary w-full"
                >
                    <X size={16} />
                    {isTr ? 'Filtreleri Temizle' : 'Clear Filters'}
                </button>
            )}
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-28 bg-surface rounded-xl p-6 border border-border mb-6">
                    <h2 className="font-semibold mb-6 flex items-center gap-2">
                        <SlidersHorizontal size={18} />
                        {isTr ? 'Filtrele' : 'Filter'}
                    </h2>
                    <FilterContent />
                </div>
            </aside>

            {/* Mobile Filter Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-40 btn btn-primary shadow-lg"
            >
                <Filter size={20} />
                {isTr ? 'Filtrele' : 'Filter'}
                {hasFilters && (
                    <span className="w-2 h-2 rounded-full bg-error absolute -top-1 -right-1" />
                )}
            </button>

            {/* Mobile Filter Sheet */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setIsMobileOpen(false)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto animate-slideIn">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-semibold flex items-center gap-2">
                                <SlidersHorizontal size={18} />
                                {isTr ? 'Filtrele' : 'Filter'}
                            </h2>
                            <button onClick={() => setIsMobileOpen(false)} className="btn-ghost p-2">
                                <X size={24} />
                            </button>
                        </div>
                        <FilterContent />
                    </div>
                </div>
            )}
        </>
    )
}
