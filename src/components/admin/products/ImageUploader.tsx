'use client'

import { Upload, X, Tag } from 'lucide-react'
import { useState } from 'react'

export interface ImageItem {
    file?: File
    url: string
    colorKey?: string | null
}

interface ColorOption {
    color_tr: string
    colorHex: string
}

interface ImageUploaderProps {
    images: ImageItem[]
    onChange: (images: ImageItem[]) => void
    availableColors?: ColorOption[]
    maxFiles?: number
    aspectRatio?: string
}

export default function ImageUploader({
    images,
    onChange,
    availableColors = [],
    maxFiles,
    aspectRatio = 'aspect-square'
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newfiles = Array.from(e.target.files).map(file => ({
                file,
                url: URL.createObjectURL(file),
                colorKey: null
            }))

            if (maxFiles === 1) {
                onChange(newfiles)
            } else {
                onChange([...images, ...newfiles])
            }
        }
    }

    const removeImage = (index: number) => {
        const newImages = [...images]
        newImages.splice(index, 1)
        onChange(newImages)
    }

    const updateColorKey = (index: number, colorKey: string | null) => {
        const newImages = [...images]
        newImages[index] = { ...newImages[index], colorKey }
        onChange(newImages)
    }

    const showUploadButton = !maxFiles || images.length < maxFiles

    return (
        <div className="space-y-4">
            {/* Color legend */}
            {availableColors.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-surface-light rounded-lg border border-border">
                    <span className="text-xs text-text-muted flex items-center gap-1 mr-1">
                        <Tag size={12} /> Her görseli bir renge atayabilirsiniz:
                    </span>
                    {availableColors.map(c => (
                        <span
                            key={c.color_tr}
                            className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-border bg-background"
                        >
                            <span
                                className="w-3 h-3 rounded-full inline-block border border-border/50"
                                style={{ backgroundColor: c.colorHex }}
                            />
                            {c.color_tr}
                        </span>
                    ))}
                    <span className="text-xs text-text-muted italic">· Atanmayan görseller tüm renklerde görünür</span>
                </div>
            )}

            <div className={`grid gap-4 ${maxFiles === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'}`}>
                {images.map((img, index) => (
                    <div key={index} className="space-y-1">
                        <div className={`relative ${aspectRatio} bg-surface-light rounded-lg overflow-hidden group border border-border`}>
                            <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                            {/* Color badge overlay */}
                            {img.colorKey && (
                                <div className="absolute bottom-2 left-2">
                                    <span
                                        className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-background/90 border border-border"
                                    >
                                        <span
                                            className="w-2.5 h-2.5 rounded-full inline-block"
                                            style={{
                                                backgroundColor: availableColors.find(c => c.color_tr === img.colorKey)?.colorHex || '#888'
                                            }}
                                        />
                                        {img.colorKey}
                                    </span>
                                </div>
                            )}
                        </div>
                        {/* Color selector */}
                        {availableColors.length > 0 && (
                            <select
                                value={img.colorKey || ''}
                                onChange={(e) => updateColorKey(index, e.target.value || null)}
                                className="input w-full py-1 text-xs"
                                style={{ color: '#ffffff', backgroundColor: '#2a2a3f' }}
                            >
                                <option value="" style={{ color: '#ffffff', backgroundColor: '#2a2a3f' }}>Tüm renkler</option>
                                {availableColors.map(c => (
                                    <option key={c.color_tr} value={c.color_tr} style={{ color: '#ffffff', backgroundColor: '#2a2a3f' }}>{c.color_tr}</option>
                                ))}
                            </select>
                        )}
                    </div>
                ))}

                {showUploadButton && (
                    <label
                        className={`${aspectRatio} border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                            }`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault()
                            setIsDragging(false)
                            if (e.dataTransfer.files) {
                                const newfiles = Array.from(e.dataTransfer.files).map(file => ({
                                    file,
                                    url: URL.createObjectURL(file),
                                    colorKey: null as string | null
                                }))

                                if (maxFiles === 1) {
                                    onChange(newfiles)
                                } else {
                                    onChange([...images, ...newfiles])
                                }
                            }
                        }}
                    >
                        <Upload className="text-text-muted mb-2" />
                        <span className="text-sm text-text-muted">Görsel Yükle</span>
                        <input
                            type="file"
                            multiple={maxFiles !== 1}
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                )}
            </div>
        </div>
    )
}
