'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/context/ToastContext'
import {
    Plus, Pencil, Trash2, Tag, ToggleLeft, ToggleRight,
    CheckCircle2, XCircle, Clock, Loader2
} from 'lucide-react'

interface Coupon {
    id: string
    code: string
    type: 'PERCENTAGE' | 'FIXED'
    value: number
    description: string | null
    minOrderAmount: number | null
    maxDiscount: number | null
    usageLimit: number | null
    usageCount: number
    isActive: boolean
    expiresAt: string | null
    createdAt: string
}

interface CouponListClientProps {
    coupons: Coupon[]
    locale: string
}

export default function CouponListClient({ coupons: initialCoupons, locale }: CouponListClientProps) {
    const router = useRouter()
    const { addToast } = useToast()
    const isTr = locale === 'tr'
    const [coupons, setCoupons] = useState(initialCoupons)
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleToggle = async (coupon: Coupon) => {
        setLoadingId(coupon.id)
        try {
            const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !coupon.isActive })
            })
            if (!res.ok) throw new Error()
            setCoupons(prev => prev.map(c =>
                c.id === coupon.id ? { ...c, isActive: !c.isActive } : c
            ))
            addToast(
                !coupon.isActive ? 'Kupon aktifleştirildi' : 'Kupon devre dışı bırakıldı',
                'success'
            )
        } catch {
            addToast('Güncelleme başarısız', 'error')
        } finally {
            setLoadingId(null)
        }
    }

    const handleDelete = async (id: string, code: string) => {
        if (!confirm(isTr ? `"${code}" kuponunu silmek istiyor musunuz?` : `Delete coupon "${code}"?`)) return

        setLoadingId(id)
        try {
            const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error()
            setCoupons(prev => prev.filter(c => c.id !== id))
            addToast('Kupon silindi', 'success')
        } catch {
            addToast('Silme başarısız', 'error')
        } finally {
            setLoadingId(null)
        }
    }

    const getStatus = (coupon: Coupon) => {
        if (!coupon.isActive) return { label: 'Pasif', color: 'text-text-muted', Icon: XCircle }
        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return { label: 'Süresi Dolmuş', color: 'text-error', Icon: Clock }
        if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) return { label: 'Limit Doldu', color: 'text-warning', Icon: XCircle }
        return { label: 'Aktif', color: 'text-success', Icon: CheckCircle2 }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">{isTr ? 'Kupon Yönetimi' : 'Coupon Management'}</h1>
                    <p className="text-text-muted text-sm mt-1">{coupons.length} kupon</p>
                </div>
                <Link href={`/${locale}/admin/coupons/new`} className="btn btn-primary">
                    <Plus size={16} />
                    {isTr ? 'Yeni Kupon' : 'New Coupon'}
                </Link>
            </div>

            {coupons.length === 0 ? (
                <div className="text-center py-16 bg-surface rounded-xl border border-border">
                    <Tag size={48} className="mx-auto text-text-dark mb-4" />
                    <h3 className="font-medium text-lg mb-2">{isTr ? 'Kupon bulunamadı' : 'No coupons yet'}</h3>
                    <p className="text-text-muted text-sm mb-4">
                        {isTr ? 'İndirim kuponu oluşturun' : 'Create discount coupons'}
                    </p>
                    <Link href={`/${locale}/admin/coupons/new`} className="btn btn-primary">
                        <Plus size={16} /> {isTr ? 'Kupon Oluştur' : 'Create Coupon'}
                    </Link>
                </div>
            ) : (
                <div className="bg-surface rounded-xl border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-text-muted">
                                <th className="text-left py-3 px-4">Kod</th>
                                <th className="text-left py-3 px-4">İndirim</th>
                                <th className="text-left py-3 px-4">Min Tutar</th>
                                <th className="text-left py-3 px-4">Kullanım</th>
                                <th className="text-left py-3 px-4">Son Tarih</th>
                                <th className="text-left py-3 px-4">Durum</th>
                                <th className="text-right py-3 px-4">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map(coupon => {
                                const status = getStatus(coupon)
                                return (
                                    <tr key={coupon.id} className="border-b border-border last:border-0 hover:bg-surface-light/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <Tag size={14} className="text-secondary shrink-0" />
                                                <span className="font-mono font-medium text-secondary">{coupon.code}</span>
                                            </div>
                                            {coupon.description && (
                                                <p className="text-xs text-text-muted mt-0.5 ml-5">{coupon.description}</p>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 font-medium">
                                            {coupon.type === 'PERCENTAGE'
                                                ? `%${Number(coupon.value)}`
                                                : `${Number(coupon.value).toLocaleString('tr-TR')} TL`
                                            }
                                            {coupon.maxDiscount !== null && coupon.type === 'PERCENTAGE' && (
                                                <span className="text-xs text-text-muted ml-1">(max {Number(coupon.maxDiscount).toLocaleString('tr-TR')} TL)</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-text-muted">
                                            {coupon.minOrderAmount !== null
                                                ? `${Number(coupon.minOrderAmount).toLocaleString('tr-TR')} TL`
                                                : '—'
                                            }
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit ? 'text-error' : ''}>
                                                {coupon.usageCount} / {coupon.usageLimit ?? '∞'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-text-muted">
                                            {coupon.expiresAt
                                                ? new Date(coupon.expiresAt).toLocaleDateString('tr-TR')
                                                : '—'
                                            }
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className={`flex items-center gap-1.5 ${status.color}`}>
                                                <status.Icon size={14} />
                                                <span className="text-xs">{status.label}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-1">
                                                {/* Toggle active */}
                                                <button
                                                    onClick={() => handleToggle(coupon)}
                                                    disabled={loadingId === coupon.id}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-light transition-colors"
                                                    title={coupon.isActive ? 'Devre dışı bırak' : 'Aktifleştir'}
                                                >
                                                    {loadingId === coupon.id
                                                        ? <Loader2 size={14} className="animate-spin" />
                                                        : coupon.isActive
                                                            ? <ToggleRight size={16} className="text-success" />
                                                            : <ToggleLeft size={16} className="text-text-muted" />
                                                    }
                                                </button>
                                                {/* Edit */}
                                                <Link
                                                    href={`/${locale}/admin/coupons/${coupon.id}`}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-light transition-colors text-text-muted hover:text-secondary"
                                                >
                                                    <Pencil size={14} />
                                                </Link>
                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDelete(coupon.id, coupon.code)}
                                                    disabled={loadingId === coupon.id}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-error/10 transition-colors text-text-muted hover:text-error"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
