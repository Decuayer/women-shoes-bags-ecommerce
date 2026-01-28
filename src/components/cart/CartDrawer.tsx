'use client'

import Link from 'next/link'
import { useCart } from './CartContext'
import { ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react'

interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
    locale: string
}

export default function CartDrawer({ isOpen, onClose, locale }: CartDrawerProps) {
    const { items, removeItem, updateQuantity, subtotal, itemCount, isLoading } = useCart()
    const isTr = locale === 'tr'

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-surface border-l border-border animate-slideIn flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <ShoppingBag size={20} />
                        {isTr ? 'Sepetim' : 'My Cart'}
                        {itemCount > 0 && (
                            <span className="text-sm text-text-muted">({itemCount})</span>
                        )}
                    </h2>
                    <button onClick={onClose} className="btn-ghost p-2">
                        <X size={24} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="skeleton h-24 rounded-lg" />
                            ))}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingBag size={64} className="text-text-dark mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                                {isTr ? 'Sepetiniz boş' : 'Your cart is empty'}
                            </h3>
                            <p className="text-text-muted text-sm mb-6">
                                {isTr
                                    ? 'Beğendiğiniz ürünleri sepete ekleyin'
                                    : 'Add products you like to your cart'
                                }
                            </p>
                            <button onClick={onClose} className="btn btn-primary">
                                {isTr ? 'Alışverişe Başla' : 'Start Shopping'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.variantId}
                                    className="flex gap-4 p-3 bg-surface-light rounded-xl"
                                >
                                    {/* Image */}
                                    <Link
                                        href={`/${locale}/products/${item.slug}`}
                                        onClick={onClose}
                                        className="w-20 h-24 rounded-lg overflow-hidden bg-surface shrink-0"
                                    >
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag size={24} className="text-text-dark" />
                                            </div>
                                        )}
                                    </Link>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/${locale}/products/${item.slug}`}
                                            onClick={onClose}
                                            className="font-medium text-sm hover:text-secondary line-clamp-1"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="text-xs text-text-muted mt-1">
                                            {item.size} / {item.color}
                                        </p>
                                        <p className="text-secondary font-semibold mt-1">
                                            {item.price.toLocaleString('tr-TR')} TL
                                        </p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                                className="w-7 h-7 rounded-md bg-surface flex items-center justify-center hover:bg-surface-light"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                                disabled={item.quantity >= item.stock}
                                                className="w-7 h-7 rounded-md bg-surface flex items-center justify-center hover:bg-surface-light disabled:opacity-50"
                                            >
                                                <Plus size={14} />
                                            </button>
                                            <button
                                                onClick={() => removeItem(item.variantId)}
                                                className="ml-auto w-7 h-7 rounded-md flex items-center justify-center text-text-dark hover:text-error hover:bg-error/10"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-4 border-t border-border space-y-4">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between text-lg">
                            <span className="text-text-muted">{isTr ? 'Ara Toplam' : 'Subtotal'}</span>
                            <span className="font-bold text-secondary">
                                {subtotal.toLocaleString('tr-TR')} TL
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                            <Link
                                href={`/${locale}/checkout`}
                                onClick={onClose}
                                className="btn btn-primary w-full"
                            >
                                {isTr ? 'Ödemeye Geç' : 'Proceed to Checkout'}
                            </Link>
                            <Link
                                href={`/${locale}/cart`}
                                onClick={onClose}
                                className="btn btn-secondary w-full"
                            >
                                {isTr ? 'Sepeti Görüntüle' : 'View Cart'}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
