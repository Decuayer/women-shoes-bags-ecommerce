import Link from 'next/link'
import { Heart, ShoppingBag, Star } from 'lucide-react'

interface Product {
    id: string
    slug: string
    name: string
    price: number
    compareAtPrice?: number | null
    category: {
        name: string
        slug: string
    }
    images: {
        url: string
        alt: string
    }[]
    rating?: number
}

interface ProductCardProps {
    product: Product
    locale: string
}

export function ProductCard({ product, locale }: ProductCardProps) {
    const discount = product.compareAtPrice
        ? Math.round((1 - product.price / product.compareAtPrice) * 100)
        : null

    return (
        <div className="card group">
            {/* Image */}
            <Link href={`/${locale}/products/${product.slug}`} className="block product-image">
                {product.images[0] ? (
                    <img
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-surface-light flex items-center justify-center">
                        <ShoppingBag size={48} className="text-text-dark" />
                    </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                        className="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center hover:scale-110 transition-transform"
                        aria-label="Add to cart"
                    >
                        <ShoppingBag size={20} />
                    </button>
                    <button
                        className="w-12 h-12 rounded-full bg-surface text-text flex items-center justify-center hover:bg-error hover:text-white transition-colors"
                        aria-label="Add to wishlist"
                    >
                        <Heart size={20} />
                    </button>
                </div>

                {/* Discount Badge */}
                {discount && (
                    <span className="absolute top-3 left-3 bg-error text-white text-xs font-bold px-2 py-1 rounded">
                        -{discount}%
                    </span>
                )}
            </Link>

            {/* Info */}
            <div className="p-4">
                {/* Category */}
                <Link
                    href={`/${locale}/products?category=${product.category.slug}`}
                    className="text-xs text-text-dark hover:text-secondary transition-colors"
                >
                    {product.category.name}
                </Link>

                {/* Name */}
                <Link href={`/${locale}/products/${product.slug}`}>
                    <h3 className="font-medium mt-1 text-text hover:text-secondary transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                {product.rating !== undefined && (
                    <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className={i < Math.round(product.rating!) ? 'text-secondary fill-secondary' : 'text-text-dark'}
                            />
                        ))}
                        <span className="text-xs text-text-muted ml-1">
                            ({product.rating.toFixed(1)})
                        </span>
                    </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2 mt-3">
                    <span className="price text-lg">{product.price.toLocaleString('tr-TR')} TL</span>
                    {product.compareAtPrice && (
                        <span className="price-old text-sm">
                            {product.compareAtPrice.toLocaleString('tr-TR')} TL
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

interface FeaturedProductsProps {
    locale: string
    products: Product[]
}

export default function FeaturedProducts({ locale, products }: FeaturedProductsProps) {
    const isTr = locale === 'tr'

    return (
        <section className="section">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {isTr ? 'Öne Çıkan Ürünler' : 'Featured Products'}
                    </h2>
                    <p className="text-text-muted max-w-2xl mx-auto">
                        {isTr
                            ? 'En beğenilen ve en çok satan ürünlerimizi keşfedin'
                            : 'Discover our most loved and best-selling products'
                        }
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} locale={locale} />
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link href={`/${locale}/products`} className="btn btn-secondary">
                        {isTr ? 'Tüm Ürünleri Gör' : 'View All Products'}
                    </Link>
                </div>
            </div>
        </section>
    )
}
