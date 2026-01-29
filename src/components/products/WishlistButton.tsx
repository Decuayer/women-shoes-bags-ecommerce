'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { toggleWishlist } from '@/actions/wishlistActions'
import { useRouter, useParams } from 'next/navigation'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'

interface WishlistButtonProps {
    productId: string
    initialIsWishlisted?: boolean
    className?: string
    iconSize?: number
}

export default function WishlistButton({
    productId,
    initialIsWishlisted = false,
    className = "",
    iconSize = 20
}: WishlistButtonProps) {
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const params = useParams()
    const locale = params.locale as string
    const isTr = locale === 'tr'
    const { addToast } = useToast()
    const { user } = useAuth()

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation if inside a link card
        e.stopPropagation()

        if (!user) {
            addToast(
                isTr ? 'Favorilere eklemek için giriş yapmalısınız' : 'Please login to add to wishlist',
                'error'
            )
            return
        }

        // Optimistic update
        const newState = !isWishlisted
        setIsWishlisted(newState)
        setIsLoading(true)

        try {
            const result = await toggleWishlist(productId)

            if (result.success) {
                // If the result state mismatches optimistic state (rare race condition), correct it
                if (result.isWishlisted !== undefined && result.isWishlisted !== newState) {
                    setIsWishlisted(result.isWishlisted)
                }

                // Show notification only when added (per user request) or maybe toggle
                if (newState) {
                    addToast(
                        isTr ? 'Favorilere eklendi' : 'Added to wishlist',
                        'success'
                    )
                } else {
                    addToast(
                        isTr ? 'Favorilerden çıkarıldı' : 'Removed from wishlist',
                        'success' // or info
                    )
                }

                router.refresh()
            } else {
                // Revert on failure
                setIsWishlisted(!newState)
                // Could show toast here if unauthorized
                if (result.message === 'Unauthorized') {
                    addToast(
                        isTr ? 'Favorilere eklemek için giriş yapmalısınız' : 'Please login to add to wishlist',
                        'error'
                    )
                } else {
                    addToast(
                        isTr ? 'Bir hata oluştu' : 'An error occurred',
                        'error'
                    )
                }
            }
        } catch (error) {
            setIsWishlisted(!newState)
            addToast(
                isTr ? 'Bir hata oluştu' : 'An error occurred',
                'error'
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`flex items-center justify-center transition-colors ${className} ${isWishlisted ? 'text-error' : 'text-text hover:text-error'}`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                size={iconSize}
                className={`transition-all ${isWishlisted ? 'fill-error' : ''} ${isLoading ? 'opacity-50' : ''}`}
            />
        </button>
    )
}
