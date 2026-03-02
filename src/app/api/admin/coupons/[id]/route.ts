import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'

async function isAdmin() {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value
    if (!token) return false
    const payload = await verifyAccessTokenEdge(token)
    return payload?.role === 'ADMIN'
}

// PUT /api/admin/coupons/[id] — update coupon
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const {
            code,
            type,
            value,
            description,
            minOrderAmount,
            maxDiscount,
            usageLimit,
            isActive,
            expiresAt
        } = body

        const coupon = await prisma.coupon.findUnique({ where: { id } })
        if (!coupon) {
            return NextResponse.json({ error: 'Kupon bulunamadı' }, { status: 404 })
        }

        const normalizedCode = code?.trim().toUpperCase().replace(/\s+/g, '') || coupon.code

        // Check code uniqueness if changing
        if (normalizedCode !== coupon.code) {
            const existing = await prisma.coupon.findUnique({ where: { code: normalizedCode } })
            if (existing) {
                return NextResponse.json({ error: 'Bu kupon kodu zaten kullanılıyor' }, { status: 400 })
            }
        }

        const updated = await prisma.coupon.update({
            where: { id },
            data: {
                code: normalizedCode,
                type: type || coupon.type,
                value: value !== undefined ? Number(value) : coupon.value,
                description: description !== undefined ? (description || null) : coupon.description,
                minOrderAmount: minOrderAmount !== undefined ? (minOrderAmount ? Number(minOrderAmount) : null) : coupon.minOrderAmount,
                maxDiscount: maxDiscount !== undefined ? (maxDiscount ? Number(maxDiscount) : null) : coupon.maxDiscount,
                usageLimit: usageLimit !== undefined ? (usageLimit ? Number(usageLimit) : null) : coupon.usageLimit,
                isActive: isActive !== undefined ? isActive : coupon.isActive,
                expiresAt: expiresAt !== undefined ? (expiresAt ? new Date(expiresAt) : null) : coupon.expiresAt,
            }
        })

        return NextResponse.json({ coupon: updated })
    } catch (error) {
        console.error('PUT /api/admin/coupons/[id] error:', error)
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}

// DELETE /api/admin/coupons/[id] — delete coupon
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        const coupon = await prisma.coupon.findUnique({ where: { id } })
        if (!coupon) {
            return NextResponse.json({ error: 'Kupon bulunamadı' }, { status: 404 })
        }

        await prisma.coupon.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('DELETE /api/admin/coupons/[id] error:', error)
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}
