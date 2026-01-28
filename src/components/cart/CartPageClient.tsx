'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/components/cart/CartContext'
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, Truck, Tag, Gift } from 'lucide-react'

interface CartPageClientProps {
    locale: string
}

export default function CartPageClient({ locale }: CartPageClientProps) {
    const { items, removeItem, updateQuantity, subtotal, itemCount, isLoading, clearCart } = useCart()
    const isTr = locale === 'tr'

    // Calculate shipping - free over 500 TL
    const shippingThreshold = 500
    const shippingCost = subtotal >= shippingThreshold ? 0 : 29.90
    const amountUntilFreeShipping = shippingThreshold - subtotal
    const total = subtotal + shippingCost

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header locale={locale} />
                <main className="flex-1 bg-background">
                    <div className="container py-8">
                        <div className="skeleton h-10 w-48 mb-8" />
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="skeleton h-32 rounded-xl" />
                                ))}
                            </div>
                            <div className="skeleton h-64 rounded-xl" />
                        </div>
                    </div>
                </main>
                <Footer locale={locale} />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header locale={locale} />

            <main className="flex-1 bg-background">
                <div className="container py-8">
                    <h1 className="text-3xl font-bold mb-8">
                        {isTr ? 'Alışveriş Sepetim' : 'Shopping Cart'}
                    </h1>

                    {items.length === 0 ? (
                        <div className="text-center py-16">
                            <ShoppingBag size={80} className="mx-auto text-text-dark mb-6" />
                            <h2 className="text-2xl font-medium mb-4">
                                {isTr ? 'Sepetiniz boş' : 'Your cart is empty'}
                            </h2>
                            <p className="text-text-muted mb-8 max-w-md mx-auto">
                                {isTr
                                    ? 'Henüz sepetinize ürün eklemediniz. Mağazamızdaki harika ürünleri keşfedin!'
                                    : 'You haven\'t added any products to your cart yet. Discover our amazing products!'
                                }
                            </p>
                            <Link href={`/${locale}/products`} className="btn btn-primary text-lg">
                                {isTr ? 'Alışverişe Başla' : 'Start Shopping'}
                            </Link>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {/* Free Shipping Progress */}
                                {amountUntilFreeShipping > 0 && (
                                    <div className="bg-surface p-4 rounded-xl border border-border">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Truck size={20} className="text-secondary" />
                                            <span className="text-sm">
                                                {isTr
                                                    ? `Ücretsiz kargoya ${amountUntilFreeShipping.toLocaleString('tr-TR')} TL kaldı!`
                                                    : `${amountUntilFreeShipping.toLocaleString('tr-TR')} TL away from free shipping!`
                                                }
                                            </span>
                                        </div>
                                        <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-secondary rounded-full transition-all"
                                                style={{ width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Items List */}
                                {items.map((item) => (
                                    <div
                                        key={item.variantId}
                                        className="flex gap-4 md:gap-6 p-4 bg-surface rounded-xl border border-border"
                                    >
                                        {/* Image */}
                                        <Link
                                            href={`/${locale}/products/${item.slug}`}
                                            className="w-24 h-32 md:w-32 md:h-40 rounded-lg overflow-hidden bg-surface-light shrink-0"
                                        >
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag size={32} className="text-text-dark" />
                                                </div>
                                            )}
                                        </Link>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0 flex flex-col">
                                            <div className="flex-1">
                                                <Link
                                                    href={`/${locale}/products/${item.slug}`}
                                                    className="font-medium hover:text-secondary transition-colors line-clamp-2"
                                                >
                                                    {item.name}
                                                </Link>
                                                <p className="text-sm text-text-muted mt-1">
                                                    {isTr ? 'Numara' : 'Size'}: {item.size} / {isTr ? 'Renk' : 'Color'}: {item.color}
                                                </p>

                                                {/* Price */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-lg font-bold text-secondary">
                                                        {item.price.toLocaleString('tr-TR')} TL
                                                    </span>
                                                    {item.compareAtPrice && (
                                                        <span className="text-sm text-text-dark line-through">
                                                            {item.compareAtPrice.toLocaleString('tr-TR')} TL
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center justify-between mt-4">
                                                {/* Quantity */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                                        className="w-9 h-9 rounded-lg bg-surface-light flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                                        disabled={item.quantity >= item.stock}
                                                        className="w-9 h-9 rounded-lg bg-surface-light flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>

                                                {/* Line Total & Remove */}
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold hidden md:block">
                                                        {(item.price * item.quantity).toLocaleString('tr-TR')} TL
                                                    </span>
                                                    <button
                                                        onClick={() => removeItem(item.variantId)}
                                                        className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Clear Cart */}
                                <button
                                    onClick={clearCart}
                                    className="text-sm text-text-muted hover:text-error transition-colors"
                                >
                                    {isTr ? 'Sepeti Temizle' : 'Clear Cart'}
                                </button>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-surface rounded-xl border border-border p-6 sticky top-28">
                                    <h2 className="text-lg font-semibold mb-6">
                                        {isTr ? 'Sipariş Özeti' : 'Order Summary'}
                                    </h2>

                                    {/* Promo Code */}
                                    <div className="flex gap-2 mb-6">
                                        <input
                                            type="text"
                                            placeholder={isTr ? 'Kupon kodu' : 'Promo code'}
                                            className="input flex-1 text-sm"
                                        />
                                        <button className="btn btn-secondary px-4">
                                            <Tag size={16} />
                                        </button>
                                    </div>

                                    {/* Summary Lines */}
                                    <div className="space-y-3 pb-4 border-b border-border">
                                        <div className="flex justify-between text-text-muted">
                                            <span>{isTr ? 'Ara Toplam' : 'Subtotal'}</span>
                                            <span>{subtotal.toLocaleString('tr-TR')} TL</span>
                                        </div>
                                        <div className="flex justify-between text-text-muted">
                                            <span>{isTr ? 'Kargo' : 'Shipping'}</span>
                                            <span className={shippingCost === 0 ? 'text-success' : ''}>
                                                {shippingCost === 0
                                                    ? (isTr ? 'Ücretsiz' : 'Free')
                                                    : `${shippingCost.toLocaleString('tr-TR')} TL`
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-between text-xl font-bold py-4">
                                        <span>{isTr ? 'Toplam' : 'Total'}</span>
                                        <span className="text-secondary">{total.toLocaleString('tr-TR')} TL</span>
                                    </div>

                                    {/* Checkout Button */}
                                    <Link
                                        href={`/${locale}/checkout`}
                                        className="btn btn-primary w-full text-lg"
                                    >
                                        {isTr ? 'Ödemeye Geç' : 'Proceed to Checkout'}
                                        <ArrowRight size={20} />
                                    </Link>

                                    {/* Trust Badges */}
                                    <div className="mt-6 pt-6 border-t border-border">
                                        <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
                                            <Gift size={16} className="text-secondary" />
                                            {isTr ? 'Hediye paketleme seçeneği mevcut' : 'Gift wrapping available'}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-text-muted">
                                            <Truck size={16} className="text-secondary" />
                                            {isTr ? '2-4 iş günü içinde teslimat' : 'Delivery in 2-4 business days'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer locale={locale} />
        </div>
    )
}
