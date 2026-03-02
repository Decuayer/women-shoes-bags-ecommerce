'use client'

import Link from 'next/link'
import { useCart } from '@/components/cart/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useTranslations } from 'next-intl'
import { useEffect, useState, useCallback } from 'react'
import {
    ShoppingBag, Minus, Plus, Trash2, ArrowRight,
    Truck, Tag, Gift, LogIn, CheckCircle2, X, Loader2
} from 'lucide-react'

interface CartPageClientProps {
    locale: string
}

interface CouponResult {
    code: string
    type: 'PERCENTAGE' | 'FIXED'
    value: number
    discountAmount: number
}

export default function CartPageClient({ locale }: CartPageClientProps) {
    const { items, removeItem, updateQuantity, subtotal, itemCount, isLoading, clearCart } = useCart()
    const { user, loading: authLoading } = useAuth()
    const t = useTranslations('cart')
    const isTr = locale === 'tr'

    // Admin-configured shipping settings (dynamic from API)
    const [shippingThreshold, setShippingThreshold] = useState(1500)
    const [baseShippingCost, setBaseShippingCost] = useState(50)
    const [settingsLoaded, setSettingsLoaded] = useState(false)

    // Coupon state
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null)
    const [couponError, setCouponError] = useState('')
    const [couponLoading, setCouponLoading] = useState(false)

    // Load shipping settings on mount
    useEffect(() => {
        fetch('/api/cart/shipping-info')
            .then(r => r.json())
            .then(data => {
                setShippingThreshold(data.freeShippingThreshold || 1500)
                setBaseShippingCost(data.shippingCost || 50)
                setSettingsLoaded(true)
            })
            .catch(() => setSettingsLoaded(true)) // use defaults on error
    }, [])

    // Derived values
    const shippingCost = subtotal >= shippingThreshold ? 0 : baseShippingCost
    const amountUntilFreeShipping = Math.max(0, shippingThreshold - subtotal)
    const discountAmount = appliedCoupon?.discountAmount || 0
    const total = Math.max(0, subtotal + shippingCost - discountAmount)

    const handleApplyCoupon = useCallback(async () => {
        if (!couponCode.trim()) return

        setCouponError('')
        setCouponLoading(true)

        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode.trim(), subtotal }),
            })
            const data = await res.json()

            if (!res.ok) {
                setCouponError(data.error || (isTr ? 'Geçersiz kupon kodu' : 'Invalid coupon code'))
                setAppliedCoupon(null)
            } else {
                setAppliedCoupon({
                    code: data.coupon.code,
                    type: data.coupon.type,
                    value: data.coupon.value,
                    discountAmount: data.discountAmount,
                })
                setCouponCode('')
                setCouponError('')
            }
        } catch {
            setCouponError(isTr ? 'Bağlantı hatası' : 'Connection error')
        } finally {
            setCouponLoading(false)
        }
    }, [couponCode, subtotal, isTr])

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null)
        setCouponError('')
    }

    // Re-validate coupon when cart changes
    useEffect(() => {
        if (appliedCoupon && items.length > 0) {
            // Re-validate silently — if it fails just remove it
            fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: appliedCoupon.code, subtotal }),
            })
                .then(r => r.json())
                .then(data => {
                    if (data.valid) {
                        setAppliedCoupon(prev => prev ? { ...prev, discountAmount: data.discountAmount } : null)
                    } else {
                        setAppliedCoupon(null)
                    }
                })
                .catch(() => {/* keep existing coupon on network errors */ })
        }
    }, [subtotal]) // eslint-disable-line react-hooks/exhaustive-deps

    if (isLoading || authLoading) {
        return (
            <div className="container">
                <div className="py-8">
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
            </div>
        )
    }

    if (!user) {
        return (
            <div className='container'>
                <div className="py-8">
                    <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
                    <div className="text-center py-16">
                        <LogIn size={80} className="mx-auto text-text-dark mb-6" />
                        <h2 className="text-2xl font-medium mb-4">{t('login_prompt_title')}</h2>
                        <Link href={`/${locale}/auth/login`} className="btn btn-primary text-lg">
                            {t('login_button')}
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <div className="py-8">
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
                            {isTr ? 'Henüz sepetinize ürün eklemediniz.' : "You haven't added any products yet."}
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
                            {settingsLoaded && amountUntilFreeShipping > 0 && (
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
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
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

                                        <div className="flex items-center justify-between mt-4">
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

                                {/* Coupon Input / Applied Coupon */}
                                <div className="mb-6">
                                    {appliedCoupon ? (
                                        /* Applied coupon badge */
                                        <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/30 rounded-xl">
                                            <CheckCircle2 size={16} className="text-success shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-success font-mono">{appliedCoupon.code}</p>
                                                <p className="text-xs text-text-muted">
                                                    {appliedCoupon.type === 'PERCENTAGE'
                                                        ? `%${appliedCoupon.value} indirim uygulandı`
                                                        : `${appliedCoupon.value} TL indirim uygulandı`
                                                    }
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-error/10 hover:text-error transition-colors text-text-muted"
                                                title={isTr ? 'Kuponu kaldır' : 'Remove coupon'}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        /* Coupon input */
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={e => {
                                                        setCouponCode(e.target.value.toUpperCase())
                                                        setCouponError('')
                                                    }}
                                                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                                                    placeholder={isTr ? 'Kupon kodu' : 'Promo code'}
                                                    className="input flex-1 text-sm uppercase"
                                                    maxLength={30}
                                                />
                                                <button
                                                    onClick={handleApplyCoupon}
                                                    disabled={couponLoading || !couponCode.trim()}
                                                    className="btn btn-secondary px-4 shrink-0"
                                                    title={isTr ? 'Uygula' : 'Apply'}
                                                >
                                                    {couponLoading
                                                        ? <Loader2 size={16} className="animate-spin" />
                                                        : <Tag size={16} />
                                                    }
                                                </button>
                                            </div>
                                            {couponError && (
                                                <p className="text-xs text-error flex items-center gap-1">
                                                    <X size={12} /> {couponError}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Summary Lines */}
                                <div className="space-y-3 pb-4 border-b border-border">
                                    <div className="flex justify-between text-text-muted">
                                        <span>{isTr ? 'Ara Toplam' : 'Subtotal'}</span>
                                        <span>{subtotal.toLocaleString('tr-TR')} TL</span>
                                    </div>
                                    <div className="flex justify-between text-text-muted">
                                        <span>{isTr ? 'Kargo' : 'Shipping'}</span>
                                        <span className={shippingCost === 0 ? 'text-success font-medium' : ''}>
                                            {!settingsLoaded
                                                ? <span className="inline-block w-12 h-4 bg-surface-light animate-pulse rounded" />
                                                : shippingCost === 0
                                                    ? (isTr ? 'Ücretsiz' : 'Free')
                                                    : `${shippingCost.toLocaleString('tr-TR')} TL`
                                            }
                                        </span>
                                    </div>
                                    {appliedCoupon && discountAmount > 0 && (
                                        <div className="flex justify-between text-success">
                                            <span className="flex items-center gap-1">
                                                <Tag size={13} />
                                                {isTr ? 'Kupon İndirimi' : 'Coupon Discount'}
                                            </span>
                                            <span>−{discountAmount.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} TL</span>
                                        </div>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="flex justify-between text-xl font-bold py-4">
                                    <span>{isTr ? 'Toplam' : 'Total'}</span>
                                    <span className="text-secondary">{total.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} TL</span>
                                </div>

                                {/* Checkout Button — passes coupon to checkout via query param */}
                                <Link
                                    href={`/${locale}/checkout${appliedCoupon
                                        ? `?coupon=${appliedCoupon.code}&discount=${appliedCoupon.discountAmount}`
                                        : ''
                                        }`}
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
        </div>
    )
}
