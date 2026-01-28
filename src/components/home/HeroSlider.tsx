'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
    id: number
    image: string
    title: string
    subtitle: string
    buttonText: string
    buttonLink: string
}

interface HeroSliderProps {
    locale: string
}

export default function HeroSlider({ locale }: HeroSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const isTr = locale === 'tr'

    const slides: Slide[] = [
        {
            id: 1,
            image: '/images/hero/hero-1.jpg',
            title: isTr ? 'Yeni Sezon Koleksiyonu' : 'New Season Collection',
            subtitle: isTr
                ? 'En yeni ayakkabı ve çanta modellerini keşfedin'
                : 'Discover the latest shoes and bags',
            buttonText: isTr ? 'Alışverişe Başla' : 'Shop Now',
            buttonLink: `/${locale}/products`
        },
        {
            id: 2,
            image: '/images/hero/hero-2.jpg',
            title: isTr ? 'Premium Deri Çantalar' : 'Premium Leather Bags',
            subtitle: isTr
                ? 'El yapımı, lüks deri çanta koleksiyonu'
                : 'Handcrafted luxury leather bag collection',
            buttonText: isTr ? 'Koleksiyonu Gör' : 'View Collection',
            buttonLink: `/${locale}/products?category=bags`
        },
        {
            id: 3,
            image: '/images/hero/hero-3.jpg',
            title: isTr ? 'Kış Sezonu Botları' : 'Winter Season Boots',
            subtitle: isTr
                ? 'Şık ve konforlu bot modelleri'
                : 'Stylish and comfortable boot models',
            buttonText: isTr ? 'Botları Keşfet' : 'Explore Boots',
            buttonLink: `/${locale}/products?category=shoes`
        }
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [slides.length])

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }

    return (
        <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {/* Background Image Placeholder */}
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-surface"
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="container relative h-full flex items-center">
                        <div className="max-w-xl">
                            <h1
                                className={`text-4xl md:text-6xl font-bold mb-4 transition-all duration-700 ${index === currentSlide
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: '200ms' }}
                            >
                                {slide.title}
                            </h1>
                            <p
                                className={`text-lg md:text-xl text-text-muted mb-8 transition-all duration-700 ${index === currentSlide
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: '400ms' }}
                            >
                                {slide.subtitle}
                            </p>
                            <Link
                                href={slide.buttonLink}
                                className={`btn btn-primary text-lg transition-all duration-700 ${index === currentSlide
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: '600ms' }}
                            >
                                {slide.buttonText}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center text-text hover:bg-secondary hover:text-primary transition-colors"
                aria-label="Previous slide"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center text-text hover:bg-secondary hover:text-primary transition-colors"
                aria-label="Next slide"
            >
                <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                                ? 'bg-secondary w-8'
                                : 'bg-text-dark hover:bg-text-muted'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    )
}
