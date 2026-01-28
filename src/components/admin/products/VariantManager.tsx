'use client'

import { Plus, Trash2 } from 'lucide-react'

interface Variant {
    id?: string
    size: string
    color: string // English name basically or code
    color_tr: string
    color_en: string
    colorHex: string
    stock: number
    sku: string
}

interface VariantManagerProps {
    variants: Variant[]
    onChange: (variants: Variant[]) => void
    locale: string
}

export default function VariantManager({ variants, onChange, locale }: VariantManagerProps) {
    const isTr = locale === 'tr'

    const addVariant = () => {
        onChange([
            ...variants,
            {
                size: 'Standart',
                color: 'Black',
                color_tr: 'Siyah',
                color_en: 'Black',
                colorHex: '#000000',
                stock: 10,
                sku: ''
            }
        ])
    }

    const removeVariant = (index: number) => {
        const newVariants = [...variants]
        newVariants.splice(index, 1)
        onChange(newVariants)
    }

    const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
        const newVariants = [...variants]
        newVariants[index] = { ...newVariants[index], [field]: value }
        onChange(newVariants)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-medium">{isTr ? 'Ürün Varyantları' : 'Product Variants'}</h3>
                <button
                    type="button"
                    onClick={addVariant}
                    className="btn btn-secondary btn-sm flex items-center gap-2"
                >
                    <Plus size={16} /> {isTr ? 'Varyant Ekle' : 'Add Variant'}
                </button>
            </div>

            <div className="space-y-3">
                {variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 bg-surface-light border border-border rounded-lg items-end">
                        <div>
                            <label className="text-xs text-text-muted block mb-1">Color (TR)</label>
                            <input
                                type="text"
                                value={variant.color_tr}
                                onChange={(e) => updateVariant(index, 'color_tr', e.target.value)}
                                className="input w-full text-sm"
                                placeholder="Siyah"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-text-muted block mb-1">Color (EN)</label>
                            <input
                                type="text"
                                value={variant.color_en}
                                onChange={(e) => {
                                    updateVariant(index, 'color_en', e.target.value)
                                    updateVariant(index, 'color', e.target.value) // Sync legacy
                                }}
                                className="input w-full text-sm"
                                placeholder="Black"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-text-muted block mb-1">Hex Code</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={variant.colorHex}
                                    onChange={(e) => updateVariant(index, 'colorHex', e.target.value)}
                                    className="h-9 w-9 p-0 border border-border rounded bg-transparent"
                                />
                                <input
                                    type="text"
                                    value={variant.colorHex}
                                    onChange={(e) => updateVariant(index, 'colorHex', e.target.value)}
                                    className="input w-full text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-text-muted block mb-1">Size</label>
                            <input
                                type="text"
                                value={variant.size}
                                onChange={(e) => updateVariant(index, 'size', e.target.value)}
                                className="input w-full text-sm"
                                placeholder="36"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-text-muted block mb-1">Stock</label>
                            <input
                                type="number"
                                value={variant.stock}
                                onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                                className="input w-full text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={variant.sku}
                                onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                className="input w-full text-sm"
                                placeholder="SKU"
                            />
                            <button
                                type="button"
                                onClick={() => removeVariant(index)}
                                className="h-10 w-10 flex items-center justify-center text-error hover:bg-error/10 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                {variants.length === 0 && (
                    <div className="text-center py-6 text-text-muted bg-surface-light/30 border border-dashed border-border rounded-lg">
                        No variants added. Click "Add Variant" to start.
                    </div>
                )}
            </div>
        </div>
    )
}
