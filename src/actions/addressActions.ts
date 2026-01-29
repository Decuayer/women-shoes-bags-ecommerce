'use server'

import { prisma } from '@/lib/prisma'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export interface AddressFormData {
    title: string
    fullName: string
    phone: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country?: string
    isDefault?: boolean
}

async function getUserId() {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value
    if (!token) return null

    const payload = await verifyAccessTokenEdge(token)
    return payload?.userId as string | undefined
}

export async function addAddress(data: AddressFormData) {
    try {
        const userId = await getUserId()
        if (!userId) {
            return { success: false, message: 'Unauthorized' }
        }

        // If this address is set as default, unset other default addresses
        if (data.isDefault) {
            await prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false }
            })
        } else {
            // If no addresses exist, make this one default automatically
            const count = await prisma.address.count({ where: { userId } })
            if (count === 0) {
                data.isDefault = true
            }
        }

        await prisma.address.create({
            data: {
                userId,
                title: data.title,
                fullName: data.fullName,
                phone: data.phone,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2,
                city: data.city,
                state: data.state,
                postalCode: data.postalCode,
                country: data.country || 'TR',
                isDefault: data.isDefault || false
            }
        })

        revalidatePath('/[locale]/account/addresses', 'page')
        return { success: true, message: 'Address added successfully' }
    } catch (error) {
        console.error('Error adding address:', error)
        return { success: false, message: 'Failed to add address' }
    }
}

export async function updateAddress(id: string, data: AddressFormData) {
    try {
        const userId = await getUserId()
        if (!userId) {
            return { success: false, message: 'Unauthorized' }
        }

        // Verify ownership
        const existing = await prisma.address.findUnique({
            where: { id, userId }
        })

        if (!existing) {
            return { success: false, message: 'Address not found' }
        }

        // If setting as default, unset others
        if (data.isDefault) {
            await prisma.address.updateMany({
                where: { userId, isDefault: true, id: { not: id } },
                data: { isDefault: false }
            })
        }

        await prisma.address.update({
            where: { id },
            data: {
                title: data.title,
                fullName: data.fullName,
                phone: data.phone,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2,
                city: data.city,
                state: data.state,
                postalCode: data.postalCode,
                country: data.country || 'TR',
                isDefault: data.isDefault
            }
        })

        revalidatePath('/[locale]/account/addresses', 'page')
        return { success: true, message: 'Address updated successfully' }
    } catch (error) {
        console.error('Error updating address:', error)
        return { success: false, message: 'Failed to update address' }
    }
}

export async function deleteAddress(id: string) {
    try {
        const userId = await getUserId()
        if (!userId) {
            return { success: false, message: 'Unauthorized' }
        }

        await prisma.address.delete({
            where: { id, userId }
        })

        revalidatePath('/[locale]/account/addresses', 'page')
        return { success: true, message: 'Address deleted successfully' }
    } catch (error) {
        console.error('Error deleting address:', error)
        return { success: false, message: 'Failed to delete address' }
    }
}
