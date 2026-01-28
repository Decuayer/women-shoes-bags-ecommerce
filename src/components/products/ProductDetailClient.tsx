'use client'

import { useState } from 'react'
import { ShoppingBag, Heart, Share2, Minus, Plus, Check, Truck, RefreshCw, Shield } from 'lucide-react'
import ProductGallery from './ProductGallery'
import VariantSelector from './VariantSelector'
import { useCart } from '@/components/cart/CartContext'

interface Variant {
    id: string
    size: string
    color: string
    colorHex: string | null
    stock: number
    sku: string
}

interface ProductDetailClientProps {
    product: {
        id: string
        slug: string
        name: string
        description: string
        price: number
        compareAtPrice: number | null
        brand: string | null
        material: string | null
        category: {
            name: string
            slug: string
        }
        images: {
            id: string
            url: string
            alt: string
        }[]
        variants: Variant[]
    }
    locale: string
}

export default function ProductDetailClient({ product, locale }: ProductDetailClientProps) {
    const isTr = locale === 'tr'
    const { addItem } = useCart()
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [isAdded, setIsAdded] = useState(false)

    const discount = product.compareAtPrice
        ? Math.round((1 - product.price / product.compareAtPrice) * 100)
        : null

    const canAddToCart = selectedVariant && selectedVariant.stock >= quantity

    const handleAddToCart = () => {
        if (!canAddToCart || !selectedVariant) return

        addItem({
            productId: product.id,
            variantId: selectedVariant.id,
            name: product.name,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            image: product.images[0]?.url || '',
            size: selectedVariant.size,
            color: selectedVariant.color,
            stock: selectedVariant.stock,
            slug: product.slug,
        })

        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    const features = [
        {
            icon: Truck,
            title: isTr ? 'Ücretsiz Kargo' : 'Free Shipping',
            desc: isTr ? '500 TL üzeri siparişlerde' : 'On orders over 500 TL'
        },
        {
            icon: RefreshCw,
            title: isTr ? '14 Gün İade' : '14-Day Returns',
            desc: isTr ? 'Kolay iade hakkı' : 'Easy return policy'
        },
        {
            icon: Shield,
            title: isTr ? 'Güvenli Ödeme' : 'Secure Payment',
            desc: isTr ? 'SSL korumalı' : 'SSL protected'
        }
    ]

    return (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Gallery */}
            <ProductGallery images={product.images} productName={product.name} />

            {/* Product Info */}
            <div className="space-y-6">
                {/* Category & Brand */}
                <div className="flex items-center gap-3 text-sm">
                    <span className="text-text-muted">{product.category.name}</span>
                    {product.brand && (
                        <>
                            <span className="text-text-dark">•</span>
                            <span className="text-secondary">{product.brand}</span>
                        </>
                    )}
                </div>

                {/* Name */}
                <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>

                {/* Price */}
                <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-secondary">
                        {product.price.toLocaleString('tr-TR')} TL
                    </span>
                    {product.compareAtPrice && (
                        <>
                            <span className="text-xl text-text-dark line-through">
                                {product.compareAtPrice.toLocaleString('tr-TR')} TL
                            </span>
                            <span className="badge badge-error">-{discount}%</span>
                        </>
                    )}
                </div>

                {/* Variant Selector */}
                <div className="py-4 border-y border-border">
                    <VariantSelector
                        variants={product.variants.map(v => ({
                            ...v,
                            color: locale === 'tr' ? v.color : v.color // Will be localized from API
                        }))}
                        locale={locale}
                        selectedVariant={selectedVariant}
                        onVariantChange={setSelectedVariant}
                    />
                </div>

                {/* Quantity */}
                <div>
                    <span className="font-medium mb-3 block">{isTr ? 'Adet' : 'Quantity'}</span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center hover:border-secondary transition-colors"
                        >
                            <Minus size={18} />
                        </button>
                        <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                        <button
                            onClick={() => setQuantity(Math.min(selectedVariant?.stock || 10, quantity + 1))}
                            className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center hover:border-secondary transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={handleAddToCart}
                        disabled={!canAddToCart}
                        className={`btn flex-1 ${canAddToCart
                            ? 'btn-primary'
                            : 'bg-surface-light text-text-dark cursor-not-allowed'
                            }`}
                    >
                        <ShoppingBag size={20} />
                        {isTr ? 'Sepete Ekle' : 'Add to Cart'}
                    </button>
                    <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className={`btn btn-secondary w-12 ${isWishlisted ? 'text-error border-error' : ''}`}
                    >
                        <Heart size={20} className={isWishlisted ? 'fill-error' : ''} />
                    </button>
                    <button className="btn btn-secondary w-12">
                        <Share2 size={20} />
                    </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 py-6 border-t border-border">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center">
                            <feature.icon size={24} className="mx-auto text-secondary mb-2" />
                            <p className="text-sm font-medium">{feature.title}</p>
                            <p className="text-xs text-text-dark">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Description */}
                <div>
                    <h3 className="font-semibold mb-3">{isTr ? 'Açıklama' : 'Description'}</h3>
                    <p className="text-text-muted leading-relaxed">{product.description}</p>
                </div>

                {/* Material */}
                {product.material && (
                    <div>
                        <h3 className="font-semibold mb-2">{isTr ? 'Malzeme' : 'Material'}</h3>
                        <p className="text-text-muted">{product.material}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
