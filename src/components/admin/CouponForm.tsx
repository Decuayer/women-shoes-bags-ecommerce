'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/context/ToastContext'
import { Save, Loader2, Tag, Percent, DollarSign, ShoppingBag, AlignLeft, Info } from 'lucide-react'

interface CouponFormProps {
    locale: string
    initialData?: {
        id: string
        code: string
        type: 'PERCENTAGE' | 'FIXED'
        value: number
        description: string | null
        minOrderAmount: number | null
        maxDiscount: number | null
        usageLimit: number | null
        isActive: boolean
        expiresAt: string | null
    }
}

export default function CouponForm({ locale, initialData }: CouponFormProps) {
    const router = useRouter()
    const { addToast } = useToast()
    const isTr = locale === 'tr'
    const isEdit = !!initialData

    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({
        code: initialData?.code || '',
        type: initialData?.type || 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
        value: initialData?.value ?? '',
        description: initialData?.description || '',
        minOrderAmount: initialData?.minOrderAmount ?? '',
        maxDiscount: initialData?.maxDiscount ?? '',
        usageLimit: initialData?.usageLimit ?? '',
        isActive: initialData?.isActive !== false,
        expiresAt: initialData?.expiresAt
            ? new Date(initialData.expiresAt).toISOString().split('T')[0]
            : '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.code.trim()) {
            addToast(isTr ? 'Kupon kodu zorunludur' : 'Coupon code is required', 'error')
            return
        }

        setIsLoading(true)
        try {
            const url = isEdit
                ? `/api/admin/coupons/${initialData.id}`
                : '/api/admin/coupons'

            const res = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: form.code.trim().toUpperCase(),
                    type: form.type,
                    value: Number(form.value),
                    description: form.description || null,
                    minOrderAmount: form.minOrderAmount !== '' ? Number(form.minOrderAmount) : null,
                    maxDiscount: form.maxDiscount !== '' ? Number(form.maxDiscount) : null,
                    usageLimit: form.usageLimit !== '' ? Number(form.usageLimit) : null,
                    isActive: form.isActive,
                    expiresAt: form.expiresAt || null,
                })
            })

            const data = await res.json()
            if (!res.ok) {
                addToast(data.error || 'Bir hata oluştu', 'error')
                return
            }

            addToast(
                isEdit ? (isTr ? 'Kupon güncellendi' : 'Coupon updated') : (isTr ? 'Kupon oluşturuldu' : 'Coupon created'),
                'success'
            )
            router.push(`/${locale}/admin/coupons`)
            router.refresh()
        } catch {
            addToast(isTr ? 'Bağlantı hatası' : 'Connection error', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const set = (field: string, value: unknown) =>
        setForm(prev => ({ ...prev, [field]: value }))

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6 pb-12 container">

            {/* Temel Bilgiler Section */}
            <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-6">
                <div className="border-b border-border pb-4">
                    <h3 className="text-xl font-bold text-text">{isTr ? 'Temel Bilgiler' : 'Basic Details'}</h3>
                    <p className="text-sm text-text-muted mt-1">
                        {isTr ? 'Kuponun kodunu ve indirim oranlarını buradan belirleyin.' : 'Set the coupon code and discount rates here.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                        <label className="label">
                            {isTr ? 'Kupon Kodu *' : 'Coupon Code *'}
                        </label>
                        <div className="relative mt-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                                <Tag size={20} />
                            </div>
                            <input
                                type="text"
                                className="input w-full uppercase !pl-12 h-14 text-lg font-semibold tracking-wider"
                                value={form.code}
                                onChange={e => set('code', e.target.value.toUpperCase())}
                                placeholder="YAZI20"
                                required
                            />
                        </div>
                        <p className="text-sm text-text-muted mt-2 flex items-center gap-1.5">
                            <Info size={16} className="text-secondary" />
                            {isTr ? 'Müşterilerinizin indirimden faydalanmak için kullanacağı koddur. Boşluk içermemelidir.' : 'The code customers will use to get the discount. Must not contain spaces.'}
                        </p>
                    </div>

                    <div>
                        <label className="label">{isTr ? 'İndirim Tipi *' : 'Discount Type *'}</label>
                        <select
                            className="input w-full h-12 mt-1"
                            value={form.type}
                            onChange={e => set('type', e.target.value)}
                        >
                            <option value="PERCENTAGE">% {isTr ? 'Yüzde İndirim' : 'Percentage Discount'}</option>
                            <option value="FIXED">TL {isTr ? 'Sabit Tutar İndirim' : 'Fixed Amount Discount'}</option>
                        </select>
                    </div>

                    <div>
                        <label className="label">
                            {form.type === 'PERCENTAGE'
                                ? (isTr ? 'İndirim Yüzdesi *' : 'Discount % *')
                                : (isTr ? 'İndirim Tutarı (TL) *' : 'Discount Amount (TL) *')
                            }
                        </label>
                        <div className="relative mt-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                                {form.type === 'PERCENTAGE' ? <Percent size={18} /> : <DollarSign size={18} />}
                            </div>
                            <input
                                type="number"
                                min="0"
                                max={form.type === 'PERCENTAGE' ? '100' : undefined}
                                step="0.01"
                                className="input w-full !pl-11 h-12"
                                value={form.value}
                                onChange={e => set('value', e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Koşullar & Limitler Section */}
            <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-6">
                <div className="border-b border-border pb-4">
                    <h3 className="text-xl font-bold text-text">{isTr ? 'Koşullar & Limitler' : 'Conditions & Limits'}</h3>
                    <p className="text-sm text-text-muted mt-1">
                        {isTr ? 'Kuponun kullanılabileceği minimum sepet tutarları ve limitasyonlarını ayarlayın.' : 'Configure minimum order amounts and usage limitations.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="label">{isTr ? 'Minimum Sepet Tutarı (TL)' : 'Min. Order Amount (TL)'}</label>
                        <div className="relative mt-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                                <ShoppingBag size={18} />
                            </div>
                            <input
                                type="number"
                                min="0"
                                className="input w-full !pl-11 h-12"
                                value={form.minOrderAmount}
                                onChange={e => set('minOrderAmount', e.target.value)}
                                placeholder={isTr ? 'Limit yok (Boş bırakın)' : 'No limit (Leave empty)'}
                            />
                        </div>
                    </div>

                    {form.type === 'PERCENTAGE' ? (
                        <div>
                            <label className="label">{isTr ? 'Maksimum İndirim Tutarı (TL)' : 'Max Discount Amount (TL)'}</label>
                            <div className="relative mt-1">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                                    <DollarSign size={18} />
                                </div>
                                <input
                                    type="number"
                                    min="0"
                                    className="input w-full !pl-11 h-12"
                                    value={form.maxDiscount}
                                    onChange={e => set('maxDiscount', e.target.value)}
                                    placeholder={isTr ? 'Sınır yok (Boş bırakın)' : 'No limit (Leave empty)'}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:block"></div>
                    )}

                    <div>
                        <label className="label">{isTr ? 'Toplam Kullanım Limiti' : 'Total Usage Limit'}</label>
                        <input
                            type="number"
                            min="1"
                            className="input w-full h-12 mt-1"
                            value={form.usageLimit}
                            onChange={e => set('usageLimit', e.target.value)}
                            placeholder={isTr ? 'Sınırsız (Boş bırakın)' : 'Unlimited (Leave empty)'}
                        />
                        <p className="text-xs text-text-muted mt-2">
                            {isTr ? 'Bu kupon toplamda müşteriler tarafından kaç defa kullanılabilir?' : 'How many times can this coupon be used in total by all customers?'}
                        </p>
                    </div>

                    <div>
                        <label className="label">{isTr ? 'Son Geçerlilik Tarihi' : 'Expiry Date'}</label>
                        <div className="relative mt-1">
                            <input
                                type="date"
                                className="input w-full h-12"
                                value={form.expiresAt}
                                onChange={e => set('expiresAt', e.target.value)}
                            />
                        </div>
                        <p className="text-xs text-text-muted mt-2">
                            {isTr ? 'Seçilen tarihten sonra kupon iptal olur. Sınırsız ise boş bırakın.' : 'Coupon invalidates after this date. Leave empty for no expiry.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Ekstra & Durum Section */}
            <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-6">
                <div className="border-b border-border pb-4">
                    <h3 className="text-xl font-bold text-text">{isTr ? 'Diğer Bilgiler' : 'Other Details'}</h3>
                </div>

                <div className="space-y-8">
                    <div>
                        <label className="label">{isTr ? 'Açıklama (İç not)' : 'Description (Internal note)'}</label>
                        <div className="relative mt-1">
                            <div className="absolute left-4 top-4 text-text-muted pointer-events-none">
                                <AlignLeft size={18} />
                            </div>
                            <textarea
                                className="input w-full !pl-11 py-3 min-h-[100px] resize-y"
                                value={form.description}
                                onChange={e => set('description', e.target.value)}
                                placeholder={isTr ? 'Örn: Yaza Veda Kampanyası için özel oluşturuldu...' : 'e.g., Created specifically for the Summer End Campaign...'}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-5 border border-border rounded-xl bg-surface-light">
                        <div>
                            <div className="text-base font-semibold text-text">{isTr ? 'Kupon Durumu' : 'Coupon Status'}</div>
                            <div className="text-sm text-text-muted mt-1">
                                {isTr ? 'Kuponun aktifliği kapanırsa, kullanılabilir olsa dahi sepet ekranında reddedilir.' : 'If inactive, the coupon will be rejected at checkout even if valid.'}
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={form.isActive}
                                onChange={() => set('isActive', !form.isActive)}
                            />
                            <div className="w-14 h-7 bg-surface-dark border border-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-success"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-end gap-4 pt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn btn-secondary px-8 h-12 text-base font-medium"
                >
                    {isTr ? 'İptal' : 'Cancel'}
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary px-8 h-12 text-base font-medium min-w-[180px]"
                >
                    {isLoading
                        ? <><Loader2 size={18} className="animate-spin" /> {isTr ? 'Kaydediliyor...' : 'Saving...'}</>
                        : <><Save size={18} /> {isEdit ? (isTr ? 'Değişiklikleri Kaydet' : 'Save Changes') : (isTr ? 'Kuponu Oluştur' : 'Create Coupon')}</>
                    }
                </button>
            </div>
        </form>
    )
}
