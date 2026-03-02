'use client'

import { useState } from 'react'
import { Star, ThumbsUp, CheckCircle, Send, Loader2 } from 'lucide-react'
import { useToast } from '@/context/ToastContext'

interface Review {
    id: string
    rating: number
    title: string | null
    comment: string
    isVerifiedPurchase: boolean
    createdAt: string
    user: { name: string }
}

interface ProductReviewsProps {
    productId: string
    initialReviews: Review[]
    avgRating: number | null
    reviewCount: number
    locale: string
    canReview: boolean // user has a DELIVERED order with this product
    hasReviewed: boolean // user already reviewed this product
}

function StarRating({ rating, interactive = false, onChange }: {
    rating: number
    interactive?: boolean
    onChange?: (r: number) => void
}) {
    const [hovered, setHovered] = useState(0)

    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type={interactive ? 'button' : undefined}
                    onClick={() => interactive && onChange?.(star)}
                    onMouseEnter={() => interactive && setHovered(star)}
                    onMouseLeave={() => interactive && setHovered(0)}
                    className={interactive ? 'cursor-pointer' : 'cursor-default pointer-events-none'}
                >
                    <Star
                        size={interactive ? 28 : 16}
                        className={`transition-colors ${star <= (hovered || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-border'
                            }`}
                    />
                </button>
            ))}
        </div>
    )
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
    const pct = total > 0 ? (count / total) * 100 : 0
    return (
        <div className="flex items-center gap-3 text-sm">
            <span className="w-4 text-right text-text-muted">{label}</span>
            <Star size={12} className="fill-amber-400 text-amber-400 shrink-0" />
            <div className="flex-1 h-2 bg-surface-light rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-6 text-right text-text-muted">{count}</span>
        </div>
    )
}

export default function ProductReviews({
    productId,
    initialReviews,
    avgRating,
    reviewCount,
    locale,
    canReview,
    hasReviewed,
}: ProductReviewsProps) {
    const isTr = locale === 'tr'
    const { addToast } = useToast()
    const [reviews, setReviews] = useState<Review[]>(initialReviews)
    const [avg, setAvg] = useState<number | null>(avgRating)
    const [count, setCount] = useState(reviewCount)
    const [submitted, setSubmitted] = useState(hasReviewed)

    // Form state
    const [selectedRating, setSelectedRating] = useState(0)
    const [title, setTitle] = useState('')
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Calculate distribution
    const distribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length
    }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedRating === 0) {
            addToast(
                isTr ? 'Lütfen bir puan seçin' : 'Please select a rating',
                'error'
            )
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, rating: selectedRating, title, comment })
            })

            const data = await res.json()

            if (!res.ok) {
                addToast(data.error || (isTr ? 'Bir hata oluştu' : 'An error occurred'), 'error')
                return
            }

            setSubmitted(true)
            addToast(
                isTr
                    ? 'Yorumunuz alındı. Yayınlanmadan önce inceleme yapılacak.'
                    : 'Your review has been received. It will be published after review.',
                'success',
                { title: isTr ? 'Teşekkürler!' : 'Thank you!', duration: 6000 }
            )
        } catch {
            addToast(isTr ? 'Bağlantı hatası' : 'Connection error', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="mt-16 pt-12 border-t border-border" id="reviews">
            <h2 className="text-2xl font-bold mb-8">
                {isTr ? 'Müşteri Yorumları' : 'Customer Reviews'}
            </h2>

            {/* Summary */}
            <div className="grid md:grid-cols-[200px_1fr] gap-8 mb-10 p-6 bg-surface rounded-xl border border-border">
                {/* Big score */}
                <div className="flex flex-col items-center justify-center text-center gap-2">
                    <span className="text-6xl font-bold text-secondary">{avg ?? '–'}</span>
                    {avg && <StarRating rating={Math.round(avg)} />}
                    <span className="text-sm text-text-muted">
                        {count} {isTr ? 'değerlendirme' : 'reviews'}
                    </span>
                </div>

                {/* Distribution */}
                <div className="flex flex-col justify-center gap-2">
                    {distribution.map(({ star, count: c }) => (
                        <RatingBar key={star} label={String(star)} count={c} total={count} />
                    ))}
                </div>
            </div>

            {/* Write a review */}
            {canReview && !submitted && (
                <div className="mb-10 p-6 bg-surface rounded-xl border border-border">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Star size={20} className="text-amber-400 fill-amber-400" />
                        {isTr ? 'Değerlendirme Yaz' : 'Write a Review'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Star picker */}
                        <div>
                            <label className="text-sm text-text-muted mb-2 block">
                                {isTr ? 'Puanınız *' : 'Your Rating *'}
                            </label>
                            <StarRating rating={selectedRating} interactive onChange={setSelectedRating} />
                        </div>

                        <div>
                            <label className="text-sm text-text-muted mb-1 block">
                                {isTr ? 'Başlık (opsiyonel)' : 'Title (optional)'}
                            </label>
                            <input
                                type="text"
                                className="input w-full"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder={isTr ? 'Örn: Çok beğendim' : 'e.g. Really loved it'}
                                maxLength={100}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-text-muted mb-1 block">
                                {isTr ? 'Yorumunuz *' : 'Your Comment *'}
                            </label>
                            <textarea
                                required
                                className="input w-full min-h-[100px]"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                placeholder={isTr ? 'Deneyimlerinizi paylaşın...' : 'Share your experience...'}
                                maxLength={1000}
                            />
                            <p className="text-xs text-text-dark mt-1">{comment.length}/1000</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || selectedRating === 0}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            {isSubmitting
                                ? <><Loader2 size={16} className="animate-spin" /> {isTr ? 'Gönderiliyor...' : 'Sending...'}</>
                                : <><Send size={16} /> {isTr ? 'Yorumu Gönder' : 'Submit Review'}</>
                            }
                        </button>
                    </form>
                </div>
            )}

            {/* Already reviewed notice */}
            {submitted && (
                <div className="mb-8 p-4 bg-success/10 border border-success/30 rounded-xl flex items-center gap-3">
                    <CheckCircle size={20} className="text-success shrink-0" />
                    <p className="text-sm text-success">
                        {isTr
                            ? 'Bu ürünü değerlendirdiniz. Teşekkürler!'
                            : 'You have reviewed this product. Thank you!'}
                    </p>
                </div>
            )}

            {/* Can't review notice (not delivered) */}
            {!canReview && !hasReviewed && (
                <div className="mb-8 p-4 bg-surface-light border border-border rounded-xl">
                    <p className="text-sm text-text-muted flex items-center gap-2">
                        <ThumbsUp size={16} />
                        {isTr
                            ? 'Yalnızca teslim edilmiş siparişlere sahip müşteriler değerlendirme yapabilir.'
                            : 'Only customers with delivered orders can leave a review.'}
                    </p>
                </div>
            )}

            {/* Reviews list */}
            {reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="p-5 bg-surface rounded-xl border border-border">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <StarRating rating={review.rating} />
                                        {review.isVerifiedPurchase && (
                                            <span className="text-xs flex items-center gap-1 text-success">
                                                <CheckCircle size={12} />
                                                {isTr ? 'Doğrulanmış Alım' : 'Verified Purchase'}
                                            </span>
                                        )}
                                    </div>
                                    {review.title && (
                                        <h4 className="font-semibold">{review.title}</h4>
                                    )}
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-medium text-sm">{review.user.name}</p>
                                    <p className="text-xs text-text-muted">
                                        {new Date(review.createdAt).toLocaleDateString(
                                            locale === 'tr' ? 'tr-TR' : 'en-US',
                                            { year: 'numeric', month: 'long', day: 'numeric' }
                                        )}
                                    </p>
                                </div>
                            </div>
                            <p className="text-text-muted text-sm leading-relaxed">{review.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-text-muted">
                    <Star size={48} className="mx-auto mb-4 opacity-30" />
                    <p>{isTr ? 'Henüz yorum yok. İlk yorumu siz yazın!' : 'No reviews yet. Be the first to review!'}</p>
                </div>
            )}
        </section>
    )
}
