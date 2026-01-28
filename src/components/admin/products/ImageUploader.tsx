'use client'

import { Upload, X } from 'lucide-react'
import { useState } from 'react'

interface ImageUploaderProps {
    images: { file?: File; url: string }[]
    onChange: (images: { file?: File; url: string }[]) => void
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newfiles = Array.from(e.target.files).map(file => ({
                file,
                url: URL.createObjectURL(file)
            }))
            onChange([...images, ...newfiles])
        }
    }

    const removeImage = (index: number) => {
        const newImages = [...images]
        newImages.splice(index, 1)
        onChange(newImages)
    }

    return (
        <div className="space-y-4">
            <h3 className="font-medium">Product Images</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                    <div key={index} className="relative aspect-square bg-surface-light rounded-lg overflow-hidden group border border-border">
                        <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                <label
                    className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault()
                        setIsDragging(false)
                        if (e.dataTransfer.files) {
                            const newfiles = Array.from(e.dataTransfer.files).map(file => ({
                                file,
                                url: URL.createObjectURL(file)
                            }))
                            onChange([...images, ...newfiles])
                        }
                    }}
                >
                    <Upload className="text-text-muted mb-2" />
                    <span className="text-sm text-text-muted">Upload Image</span>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            </div>
        </div>
    )
}
