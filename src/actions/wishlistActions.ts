'use server'

import { prisma } from '@/lib/prisma'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function toggleWishlist(productId: string) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            return { success: false, message: 'Unauthorized' }
        }

        const payload = await verifyAccessTokenEdge(token)
        if (!payload) {
            return { success: false, message: 'Unauthorized' }
        }

        const userId = payload.userId as string

        // Check if exists
        const existing = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        })

        if (existing) {
            // Remove
            await prisma.wishlist.delete({
                where: {
                    userId_productId: {
                        userId,
                        productId
                    }
                }
            })
            revalidatePath('/[locale]/account/favorites')
            return { success: true, isWishlisted: false, message: 'Removed from wishlist' }
        } else {
            // Add
            await prisma.wishlist.create({
                data: {
                    userId,
                    productId
                }
            })
            revalidatePath('/[locale]/account/favorites')
            return { success: true, isWishlisted: true, message: 'Added to wishlist' }
        }

    } catch (error) {
        console.error('Wishlist toggle error:', error)
        return { success: false, message: 'Failed to update wishlist' }
    }
}
