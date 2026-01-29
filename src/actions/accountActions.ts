'use server'

import { prisma } from '@/lib/prisma'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'
import { verifyPassword, hashPassword } from '@/lib/auth'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export interface ProfileFormData {
    firstName: string
    lastName: string
    phone: string
    email: string
}

export interface PasswordFormData {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

async function getUserId() {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value
    if (!token) return null

    const payload = await verifyAccessTokenEdge(token)
    return payload?.userId as string | undefined
}

export async function updateProfile(data: ProfileFormData) {
    try {
        const userId = await getUserId()
        if (!userId) {
            return { success: false, message: 'Unauthorized' }
        }

        // Check if email is taken by another user
        const existingUser = await prisma.user.findFirst({
            where: {
                email: data.email,
                NOT: {
                    id: userId
                }
            }
        })

        if (existingUser) {
            return { success: false, message: 'Email is already in use by another account' }
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                email: data.email
            }
        })

        revalidatePath('/[locale]/account/profile', 'page')
        revalidatePath('/[locale]/account', 'layout') // Update user card in sidebar
        return { success: true, message: 'Profile updated successfully' }
    } catch (error) {
        console.error('Error updating profile:', error)
        return { success: false, message: 'Failed to update profile' }
    }
}

export async function changePassword(data: PasswordFormData) {
    try {
        const userId = await getUserId()
        if (!userId) {
            return { success: false, message: 'Unauthorized' }
        }

        if (data.newPassword !== data.confirmPassword) {
            return { success: false, message: 'New passwords do not match' }
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user || !user.password) {
            return { success: false, message: 'User not found' }
        }

        // Verify current password
        // Note: verifyPassword assumes bcrypt is available. 
        // If auth-edge doesn't export strict bcrypt wrappers compatible here, we might need to use 'bcryptjs' directly if we are in node env.
        // But 'use server' runs in node, so bcryptjs is fine. 
        // Let's rely on the imports from auth-edge or auth.ts if possible, or just bcryptjs.
        // Looking at previous tools, auth.ts uses bcryptjs. auth-edge might use jose/web-crypto.
        // Let's double check auth-edge.ts content first? 
        // No, I'll assume I can use headers/cookies standard methods.
        // Actually, verification usually needs bcrypt. 

        const isValid = await verifyPassword(data.currentPassword, user.password)

        if (!isValid) {
            return { success: false, message: 'Incorrect current password' }
        }

        const hashedPassword = await hashPassword(data.newPassword)

        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword
            }
        })

        return { success: true, message: 'Password changed successfully' }
    } catch (error) {
        console.error('Error changing password:', error)
        return { success: false, message: 'Failed to change password' }
    }
}
