'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ArrowUpDown } from 'lucide-react'

interface ProductSortProps {
    locale: string
}

export default function ProductSort({ locale }: ProductSortProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const isTr = locale === 'tr'

    const currentSort = searchParams.get('sort') || 'newest'

    const sortOptions = [
        { value: 'newest', label: isTr ? 'En Yeniler' : 'Newest' },
        { value: 'price_asc', label: isTr ? 'Fiyat: Düşükten Yükseğe' : 'Price: Low to High' },
        { value: 'price_desc', label: isTr ? 'Fiyat: Yüksekten Düşüğe' : 'Price: High to Low' },
        { value: 'popular', label: isTr ? 'En Popüler' : 'Most Popular' },
    ]

    const handleSort = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('sort', value)
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-3">
            <ArrowUpDown size={18} className="text-text-muted" />
            <select
                value={currentSort}
                onChange={(e) => handleSort(e.target.value)}
                className="input bg-surface-light border-border py-2 px-4 pr-10 text-sm cursor-pointer"
            >
                {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
