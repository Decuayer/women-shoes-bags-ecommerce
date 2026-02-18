'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface Image {
    id: string
    url: string
    alt: string
    colorKey?: string | null
}

interface ProductGalleryProps {
    images: Image[]
    productName: string
    selectedColor?: string
}

export default function ProductGallery({ images, productName, selectedColor }: ProductGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isZoomed, setIsZoomed] = useState(false)

    // Filter images based on selected color:
    // - images with no colorKey (null/undefined) always show
    // - images with a colorKey only show when that color is selected
    const filteredImages = selectedColor
        ? images.filter(img => !img.colorKey || img.colorKey === selectedColor)
        : images

    // If filtering yields nothing, fall back to all unkeyed images
    const displayImages = filteredImages.length > 0
        ? filteredImages
        : images.filter(img => !img.colorKey)

    // Reset to first image when color changes
    useEffect(() => {
        setCurrentIndex(0)
        setIsZoomed(false)
    }, [selectedColor])

    if (displayImages.length === 0) {
        return (
            <div className="aspect-[3/4] bg-surface rounded-2xl flex items-center justify-center">
                <span className="text-text-dark text-lg">{productName}</span>
            </div>
        )
    }

    const currentImage = displayImages[currentIndex] || displayImages[0]

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % displayImages.length)
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-surface rounded-2xl overflow-hidden group max-w-md mx-auto md:max-w-none">
                <img
                    src={currentImage.url}
                    alt={currentImage.alt}
                    className={`w-full h-full object-cover transition-transform duration-500 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                        }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.parentElement!.innerHTML = `
              <div class="w-full h-full flex items-center justify-center bg-surface-light">
                <span class="text-text-dark">${productName}</span>
              </div>
            `
                    }}
                />

                {/* Zoom Icon */}
                <button
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsZoomed(!isZoomed)}
                >
                    <ZoomIn size={20} className="text-text" />
                </button>

                {/* Navigation Arrows */}
                {displayImages.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary hover:text-primary"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary hover:text-primary"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 max-w-[calc(100vw-2rem)] md:max-w-none mx-auto no-scrollbar scroll-smooth snap-x">
                    {displayImages.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setCurrentIndex(index)}
                            className={`shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors snap-start ${index === currentIndex ? 'border-secondary' : 'border-transparent hover:border-border'
                                }`}
                        >
                            <img
                                src={image.url}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
