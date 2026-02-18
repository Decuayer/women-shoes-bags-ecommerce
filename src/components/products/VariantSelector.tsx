'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

interface Variant {
    id: string
    size: string
    color: string
    colorHex: string | null
    stock: number
    sku: string
}

interface VariantSelectorProps {
    variants: Variant[]
    locale: string
    selectedVariant: Variant | null
    onVariantChange: (variant: Variant | null) => void
    onColorChange?: (color: string) => void
}

export default function VariantSelector({
    variants,
    locale,
    selectedVariant,
    onVariantChange,
    onColorChange
}: VariantSelectorProps) {
    const isTr = locale === 'tr'

    // Group variants by color and size
    const colors = [...new Set(variants.map(v => v.color))]
    const sizes = [...new Set(variants.map(v => v.size))].sort((a, b) => {
        const numA = parseInt(a)
        const numB = parseInt(b)
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB
        return a.localeCompare(b)
    })

    const [selectedColor, setSelectedColor] = useState<string>(colors[0] || '')
    const [selectedSize, setSelectedSize] = useState<string>('')

    // Find matching variant when color or size changes
    const findVariant = (color: string, size: string) => {
        return variants.find(v => v.color === color && v.size === size) || null
    }

    // Get available sizes for selected color
    const getAvailableSizes = (color: string) => {
        return variants.filter(v => v.color === color && v.stock > 0).map(v => v.size)
    }

    // Get color hex for display
    const getColorHex = (color: string) => {
        const variant = variants.find(v => v.color === color)
        return variant?.colorHex || '#888888'
    }

    const handleColorChange = (color: string) => {
        setSelectedColor(color)
        setSelectedSize('')
        onVariantChange(null)
        onColorChange?.(color)
    }

    const handleSizeChange = (size: string) => {
        setSelectedSize(size)
        const variant = findVariant(selectedColor, size)
        onVariantChange(variant)
    }

    const availableSizes = getAvailableSizes(selectedColor)

    return (
        <div className="space-y-6">
            {/* Color Selection */}
            {colors.length > 1 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">{isTr ? 'Renk' : 'Color'}</span>
                        <span className="text-text-muted text-sm">{selectedColor}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {colors.map((color) => {
                            const hex = getColorHex(color)
                            const isSelected = selectedColor === color

                            return (
                                <button
                                    key={color}
                                    onClick={() => handleColorChange(color)}
                                    className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${isSelected
                                        ? 'border-secondary scale-110'
                                        : 'border-transparent hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: hex }}
                                    title={color}
                                    aria-label={color}
                                >
                                    {isSelected && (
                                        <Check
                                            size={16}
                                            className={hex === '#ffffff' || hex === '#FFFFFF' ? 'text-black' : 'text-white'}
                                        />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Size Selection */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">{isTr ? 'Numara' : 'Size'}</span>
                    {selectedSize && (
                        <span className="text-text-muted text-sm">{selectedSize}</span>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                        const isAvailable = availableSizes.includes(size)
                        const isSelected = selectedSize === size

                        return (
                            <button
                                key={size}
                                onClick={() => isAvailable && handleSizeChange(size)}
                                disabled={!isAvailable}
                                className={`min-w-[48px] h-12 px-4 rounded-lg border text-sm font-medium transition-all ${isSelected
                                    ? 'border-secondary bg-secondary text-primary'
                                    : isAvailable
                                        ? 'border-border text-text hover:border-secondary'
                                        : 'border-border text-text-dark opacity-50 cursor-not-allowed line-through'
                                    }`}
                            >
                                {size}
                            </button>
                        )
                    })}
                </div>

                {/* Stock Info */}
                {selectedVariant && (
                    <div className="mt-3">
                        {selectedVariant.stock > 0 ? (
                            <span className="text-success text-sm flex items-center gap-1">
                                <Check size={14} />
                                {isTr ? `Stokta (${selectedVariant.stock} adet)` : `In Stock (${selectedVariant.stock} available)`}
                            </span>
                        ) : (
                            <span className="text-error text-sm">
                                {isTr ? 'Stokta yok' : 'Out of Stock'}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
