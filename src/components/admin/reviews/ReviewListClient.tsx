'use client'

import { useState, useEffect } from 'react'
import { Star, CheckCircle, XCircle, Trash2, ExternalLink, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Review {
    id: string
    rating: number
    title: string | null
    comment: string
    isApproved: boolean
    createdAt: string
    user: {
        id: string
        firstName: string
        lastName: string
        email: string
    }
    product: {
        id: string
        name_tr: string
        name_en: string
        slug: string
    }
}

interface Props {
    locale: string
}

export default function ReviewListClient({ locale }: Props) {
    const isTr = locale === 'tr'
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL')
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

    const fetchReviews = async (status: 'ALL' | 'PENDING' | 'APPROVED') => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/admin/reviews?status=${status}`)
            if (res.ok) {
                const data = await res.json()
                setReviews(data)
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews(statusFilter)
    }, [statusFilter])

    const handleToggleStatus = async (review: Review) => {
        if (actionLoadingId) return
        setActionLoadingId(review.id)
        try {
            const res = await fetch(`/api/admin/reviews/${review.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isApproved: !review.isApproved })
            })
            if (res.ok) {
                // Optimistically update the list or refetch
                fetchReviews(statusFilter)
            } else {
                alert(isTr ? 'Güncelleme başarısız oldu' : 'Failed to update status')
            }
        } catch (error) {
            console.error('Update error:', error)
            alert(isTr ? 'Bir hata oluştu' : 'An error occurred')
        } finally {
            setActionLoadingId(null)
        }
    }

    const handleDelete = async (id: string) => {
        if (actionLoadingId) return
        const confirmed = window.confirm(
            isTr ? 'Bu değerlendirmeyi silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this review?'
        )
        if (!confirmed) return

        setActionLoadingId(id)
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                fetchReviews(statusFilter)
            } else {
                alert(isTr ? 'Silme işlemi başarısız oldu' : 'Failed to delete')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert(isTr ? 'Bir hata oluştu' : 'An error occurred')
        } finally {
            setActionLoadingId(null)
        }
    }

    const renderStars = (rating: number) => {
        return (
            <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < rating ? 'fill-current' : 'text-gray-300'} />
                ))}
            </div>
        )
    }

    return (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
            {/* Header & Filters */}
            <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold">
                    {isTr ? 'Ürün Değerlendirmeleri' : 'Product Reviews'}
                </h2>

                <div className="flex bg-surface-light p-1 rounded-lg">
                    <button
                        onClick={() => setStatusFilter('ALL')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${statusFilter === 'ALL' ? 'bg-surface shadow-sm text-text' : 'text-text-muted hover:text-text'}`}
                    >
                        {isTr ? 'Tümü' : 'All'}
                    </button>
                    <button
                        onClick={() => setStatusFilter('PENDING')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${statusFilter === 'PENDING' ? 'bg-surface shadow-sm text-amber-600' : 'text-text-muted hover:text-amber-600'}`}
                    >
                        {isTr ? 'Onay Bekleyenler' : 'Pending'}
                    </button>
                    <button
                        onClick={() => setStatusFilter('APPROVED')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${statusFilter === 'APPROVED' ? 'bg-surface shadow-sm text-success' : 'text-text-muted hover:text-success'}`}
                    >
                        {isTr ? 'Onaylananlar' : 'Approved'}
                    </button>
                </div>
            </div>

            {/* Content list */}
            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="p-8 flex justify-center text-text-muted">
                        <Loader2 className="animate-spin" size={32} />
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="p-8 text-center text-text-muted">
                        {isTr ? 'Hiç değerlendirme bulunamadı.' : 'No reviews found.'}
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-light text-text-muted text-sm border-b border-border">
                                <th className="p-4 font-medium">{isTr ? 'Müşteri / Ürün' : 'Customer / Product'}</th>
                                <th className="p-4 font-medium">{isTr ? 'Değerlendirme' : 'Rating'}</th>
                                <th className="p-4 font-medium">{isTr ? 'Yorum' : 'Comment'}</th>
                                <th className="p-4 font-medium">{isTr ? 'Tarih' : 'Date'}</th>
                                <th className="p-4 font-medium">{isTr ? 'Durum' : 'Status'}</th>
                                <th className="p-4 font-medium text-right">{isTr ? 'İşlemler' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {reviews.map((review) => (
                                <tr key={review.id} className="hover:bg-surface-light/50 transition-colors">
                                    <td className="p-4 align-top">
                                        <div className="font-medium text-sm text-text">
                                            {review.user.firstName} {review.user.lastName}
                                        </div>
                                        <div className="text-xs text-text-muted mb-2">{review.user.email}</div>
                                        <Link
                                            href={`/${locale}/products/${review.product.slug}`}
                                            target="_blank"
                                            className="text-xs text-secondary hover:underline flex items-center gap-1"
                                        >
                                            {isTr ? review.product.name_tr : review.product.name_en}
                                            <ExternalLink size={10} />
                                        </Link>
                                    </td>

                                    <td className="p-4 align-top whitespace-nowrap">
                                        {renderStars(review.rating)}
                                    </td>

                                    <td className="p-4 align-top">
                                        <div className="max-w-md">
                                            {review.title && <div className="font-medium text-sm mb-1">{review.title}</div>}
                                            <p className="text-sm text-text-muted whitespace-pre-wrap leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
                                                {review.comment}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="p-4 align-top text-sm text-text-muted whitespace-nowrap">
                                        {new Date(review.createdAt).toLocaleDateString(isTr ? 'tr-TR' : 'en-US', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </td>

                                    <td className="p-4 align-top">
                                        {review.isApproved ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                                                <CheckCircle size={14} />
                                                {isTr ? 'Onaylandı' : 'Approved'}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                                <Loader2 size={14} />
                                                {isTr ? 'Bekliyor' : 'Pending'}
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-4 align-top text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleToggleStatus(review)}
                                                disabled={actionLoadingId === review.id}
                                                className={`p-2 rounded-lg transition-colors border ${review.isApproved
                                                        ? 'text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100'
                                                        : 'text-success border-success/30 bg-success/5 hover:bg-success/10'
                                                    } disabled:opacity-50`}
                                                title={review.isApproved ? (isTr ? 'Onayı Kaldır' : 'Revoke Approval') : (isTr ? 'Onayla' : 'Approve')}
                                            >
                                                {actionLoadingId === review.id ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : review.isApproved ? (
                                                    <XCircle size={16} />
                                                ) : (
                                                    <CheckCircle size={16} />
                                                )}
                                            </button>

                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                disabled={actionLoadingId === review.id}
                                                className="p-2 rounded-lg text-error border border-error/20 bg-error/5 hover:bg-error/10 transition-colors disabled:opacity-50"
                                                title={isTr ? 'Sil' : 'Delete'}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
