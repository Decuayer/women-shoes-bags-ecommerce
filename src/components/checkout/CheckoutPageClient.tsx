'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/components/cart/CartContext'
import {
    ShoppingBag,
    MapPin,
    Truck,
    CreditCard,
    Check,
    ChevronRight,
    ArrowLeft,
    Shield,
    Lock
} from 'lucide-react'

interface CheckoutPageClientProps {
    locale: string
}

type Step = 'address' | 'shipping' | 'payment'

export default function CheckoutPageClient({ locale }: CheckoutPageClientProps) {
    const router = useRouter()
    const { items, subtotal, clearCart, itemCount } = useCart()
    const isTr = locale === 'tr'

    const [currentStep, setCurrentStep] = useState<Step>('address')
    const [isProcessing, setIsProcessing] = useState(false)

    // Form states
    const [address, setAddress] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        district: '',
        postalCode: '',
    })

    const [shippingMethod, setShippingMethod] = useState('standard')

    // Calculate costs
    const shippingThreshold = 500
    const baseShipping = shippingMethod === 'express' ? 49.90 : 29.90
    const shippingCost = subtotal >= shippingThreshold ? 0 : baseShipping
    const total = subtotal + shippingCost

    const steps = [
        { id: 'address', label: isTr ? 'Adres' : 'Address', icon: MapPin },
        { id: 'shipping', label: isTr ? 'Kargo' : 'Shipping', icon: Truck },
        { id: 'payment', label: isTr ? 'Ödeme' : 'Payment', icon: CreditCard },
    ]

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentStep('shipping')
    }

    const handleShippingSubmit = () => {
        setCurrentStep('payment')
    }

    const [iyzicoContent, setIyzicoContent] = useState<string | null>(null)

    // Execute script from iyzico content
    useEffect(() => {
        if (iyzicoContent) {
            // Extract script content
            // Note: iyzico script usually creates a global IyzipayCheckoutForm variable and inits it
            // We need to parse and execute it.
            // Simple regex to extract content inside <script> tags
            const scripts = iyzicoContent.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
            if (scripts) {
                scripts.forEach(scriptTag => {
                    const content = scriptTag.replace(/<script[^>]*>|<\/script>/gi, '');
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.innerHTML = content;
                    document.body.appendChild(script);
                });
            }
        }
    }, [iyzicoContent])

    const handlePayment = async () => {
        setIsProcessing(true)

        try {
            // Get user info from context or use guest check (mock for now as we don't have user context fully bound here yet)
            // In real app, we should use session user. For now, using form data.
            const user = {
                id: "guest_" + Date.now(), // Temporary ID for guest
                email: address.email,
                firstName: address.fullName.split(' ')[0],
                lastName: address.fullName.split(' ').slice(1).join(' ') || 'User',
                phone: address.phone
            }

            const res = await fetch('/api/payment/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user,
                    address: {
                        fullName: address.fullName,
                        phone: address.phone,
                        email: address.email,
                        city: address.city,
                        country: 'Turkey', // Default
                        addressLine1: address.address,
                        postalCode: address.postalCode
                    },
                    cartItems: items,
                    locale: locale
                })
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error || 'Payment initialization failed')
                setIsProcessing(false)
                return
            }

            // Handle iyzico content
            if (data.checkoutContent) {
                setIyzicoContent(data.checkoutContent)
            } else if (data.paymentPageUrl) {
                // Redirect to payment page
                window.location.href = data.paymentPageUrl
            }

            // NOTE: If using checkoutContent, we need to inject script. 
            // Ideally we use a separate page for this to avoid script injection issues in Client Component.
            // But let's try rendering it or see if it works.
            // Better approach: Redirect to a standard 'payment' page that fetches this content server side?
            // Or simpler: Use document.write or a useEffect to inject the script from the html content.

        } catch (error) {
            console.error(error)
            alert('An error occurred')
            setIsProcessing(false)
        }
    }

    if (items.length === 0 && !isProcessing) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header locale={locale} />
                <main className="flex-1 bg-background flex items-center justify-center">
                    <div className="text-center px-4">
                        <ShoppingBag size={80} className="mx-auto text-text-dark mb-6" />
                        <h1 className="text-2xl font-bold mb-4">
                            {isTr ? 'Sepetiniz boş' : 'Your cart is empty'}
                        </h1>
                        <p className="text-text-muted mb-8">
                            {isTr
                                ? 'Ödeme yapmak için sepetinize ürün ekleyin.'
                                : 'Add products to your cart to checkout.'
                            }
                        </p>
                        <Link href={`/${locale}/products`} className="btn btn-primary">
                            {isTr ? 'Alışverişe Başla' : 'Start Shopping'}
                        </Link>
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
                    {/* Back to Cart */}
                    <Link
                        href={`/${locale}/cart`}
                        className="inline-flex items-center gap-2 text-text-muted hover:text-secondary mb-6"
                    >
                        <ArrowLeft size={18} />
                        {isTr ? 'Sepete Dön' : 'Back to Cart'}
                    </Link>

                    <h1 className="text-3xl font-bold mb-8">
                        {isTr ? 'Ödeme' : 'Checkout'}
                    </h1>

                    {/* Steps */}
                    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${step.id === currentStep
                                        ? 'bg-secondary text-primary'
                                        : steps.findIndex(s => s.id === currentStep) > index
                                            ? 'bg-success/20 text-success'
                                            : 'bg-surface text-text-muted'
                                        }`}
                                >
                                    {steps.findIndex(s => s.id === currentStep) > index ? (
                                        <Check size={16} />
                                    ) : (
                                        <step.icon size={16} />
                                    )}
                                    <span className="whitespace-nowrap">{step.label}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <ChevronRight size={20} className="text-text-dark mx-2" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            {/* Address Form */}
                            {currentStep === 'address' && (
                                <form onSubmit={handleAddressSubmit} className="bg-surface rounded-xl p-6 border border-border">
                                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                        <MapPin size={20} className="text-secondary" />
                                        {isTr ? 'Teslimat Adresi' : 'Shipping Address'}
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-text-muted mb-2">
                                                {isTr ? 'Ad Soyad' : 'Full Name'} *
                                            </label>
                                            <input
                                                type="text"
                                                value={address.fullName}
                                                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                                                className="input"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-text-muted mb-2">
                                                {isTr ? 'Telefon' : 'Phone'} *
                                            </label>
                                            <input
                                                type="tel"
                                                value={address.phone}
                                                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                                className="input"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm text-text-muted mb-2">
                                                {isTr ? 'E-posta' : 'Email'} *
                                            </label>
                                            <input
                                                type="email"
                                                value={address.email}
                                                onChange={(e) => setAddress({ ...address, email: e.target.value })}
                                                className="input"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm text-text-muted mb-2">
                                                {isTr ? 'Adres' : 'Address'} *
                                            </label>
                                            <textarea
                                                value={address.address}
                                                onChange={(e) => setAddress({ ...address, address: e.target.value })}
                                                className="input min-h-[80px]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-text-muted mb-2">
                                                {isTr ? 'Şehir' : 'City'} *
                                            </label>
                                            <input
                                                type="text"
                                                value={address.city}
                                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                className="input"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-text-muted mb-2">
                                                {isTr ? 'İlçe' : 'District'} *
                                            </label>
                                            <input
                                                type="text"
                                                value={address.district}
                                                onChange={(e) => setAddress({ ...address, district: e.target.value })}
                                                className="input"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-text-muted mb-2">
                                                {isTr ? 'Posta Kodu' : 'Postal Code'}
                                            </label>
                                            <input
                                                type="text"
                                                value={address.postalCode}
                                                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                                                className="input"
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary w-full mt-6">
                                        {isTr ? 'Devam Et' : 'Continue'}
                                        <ChevronRight size={18} />
                                    </button>
                                </form>
                            )}

                            {/* Shipping Options */}
                            {currentStep === 'shipping' && (
                                <div className="bg-surface rounded-xl p-6 border border-border">
                                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                        <Truck size={20} className="text-secondary" />
                                        {isTr ? 'Kargo Seçenekleri' : 'Shipping Options'}
                                    </h2>

                                    <div className="space-y-3">
                                        <label
                                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${shippingMethod === 'standard'
                                                ? 'border-secondary bg-secondary/10'
                                                : 'border-border hover:border-secondary/50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="shipping"
                                                value="standard"
                                                checked={shippingMethod === 'standard'}
                                                onChange={(e) => setShippingMethod(e.target.value)}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'standard' ? 'border-secondary' : 'border-text-dark'
                                                }`}>
                                                {shippingMethod === 'standard' && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {isTr ? 'Standart Kargo' : 'Standard Shipping'}
                                                </p>
                                                <p className="text-sm text-text-muted">
                                                    {isTr ? '3-5 iş günü' : '3-5 business days'}
                                                </p>
                                            </div>
                                            <span className="font-medium text-secondary">
                                                {subtotal >= shippingThreshold
                                                    ? (isTr ? 'Ücretsiz' : 'Free')
                                                    : '29.90 TL'
                                                }
                                            </span>
                                        </label>

                                        <label
                                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${shippingMethod === 'express'
                                                ? 'border-secondary bg-secondary/10'
                                                : 'border-border hover:border-secondary/50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="shipping"
                                                value="express"
                                                checked={shippingMethod === 'express'}
                                                onChange={(e) => setShippingMethod(e.target.value)}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'express' ? 'border-secondary' : 'border-text-dark'
                                                }`}>
                                                {shippingMethod === 'express' && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {isTr ? 'Hızlı Kargo' : 'Express Shipping'}
                                                </p>
                                                <p className="text-sm text-text-muted">
                                                    {isTr ? '1-2 iş günü' : '1-2 business days'}
                                                </p>
                                            </div>
                                            <span className="font-medium text-secondary">
                                                {subtotal >= shippingThreshold
                                                    ? (isTr ? 'Ücretsiz' : 'Free')
                                                    : '49.90 TL'
                                                }
                                            </span>
                                        </label>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={() => setCurrentStep('address')}
                                            className="btn btn-secondary flex-1"
                                        >
                                            <ArrowLeft size={18} />
                                            {isTr ? 'Geri' : 'Back'}
                                        </button>
                                        <button
                                            onClick={handleShippingSubmit}
                                            className="btn btn-primary flex-1"
                                        >
                                            {isTr ? 'Devam Et' : 'Continue'}
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Payment */}
                            {currentStep === 'payment' && (
                                <div className="bg-surface rounded-xl p-6 border border-border">
                                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                        <CreditCard size={20} className="text-secondary" />
                                        {isTr ? 'Ödeme' : 'Payment'}
                                    </h2>

                                    {iyzicoContent ? (
                                        <div className="w-full">
                                            {/* Render iyzico form or helper text */}
                                            <div id="iyzipay-checkout-form" className="responsive"></div>
                                            <div dangerouslySetInnerHTML={{ __html: iyzicoContent }} />
                                        </div>
                                    ) : (
                                        <>
                                            {/* Payment Info Placeholder */}
                                            <div className="bg-surface-light rounded-xl p-6 text-center mb-6">
                                                <Shield size={48} className="mx-auto text-secondary mb-4" />
                                                <h3 className="font-medium mb-2">
                                                    {isTr ? 'Güvenli Ödeme' : 'Secure Payment'}
                                                </h3>
                                                <p className="text-sm text-text-muted mb-4">
                                                    {isTr
                                                        ? 'iyzico güvenli ödeme altyapısı ile ödeme yapacaksınız.'
                                                        : 'You will pay with iyzico secure payment infrastructure.'
                                                    }
                                                </p>
                                                <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
                                                    <Lock size={14} />
                                                    {isTr ? '256-bit SSL şifreleme' : '256-bit SSL encryption'}
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setCurrentStep('shipping')}
                                                    className="btn btn-secondary flex-1"
                                                >
                                                    <ArrowLeft size={18} />
                                                    {isTr ? 'Geri' : 'Back'}
                                                </button>
                                                <button
                                                    onClick={handlePayment}
                                                    disabled={isProcessing}
                                                    className="btn btn-primary flex-1"
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <span className="animate-spin mr-2">
                                                                <Shield size={16} />
                                                            </span>
                                                            {isTr ? 'Başlatılıyor...' : 'Initializing...'}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {isTr ? 'Ödemeyi Tamamla' : 'Complete Payment'}
                                                            <Lock size={16} />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-surface rounded-xl border border-border p-6 sticky top-28">
                                <h2 className="text-lg font-semibold mb-4">
                                    {isTr ? 'Sipariş Özeti' : 'Order Summary'}
                                </h2>

                                {/* Items */}
                                <div className="space-y-3 pb-4 border-b border-border max-h-[300px] overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.variantId} className="flex gap-3">
                                            <div className="w-16 h-20 rounded-lg overflow-hidden bg-surface-light shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ShoppingBag size={20} className="text-text-dark" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-text-muted">{item.size} / {item.color}</p>
                                                <p className="text-xs text-text-muted">{isTr ? 'Adet' : 'Qty'}: {item.quantity}</p>
                                                <p className="text-sm font-medium text-secondary mt-1">
                                                    {(item.price * item.quantity).toLocaleString('tr-TR')} TL
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-3 py-4 border-b border-border">
                                    <div className="flex justify-between text-text-muted">
                                        <span>{isTr ? 'Ara Toplam' : 'Subtotal'} ({itemCount})</span>
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
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer locale={locale} />
        </div>
    )
}
