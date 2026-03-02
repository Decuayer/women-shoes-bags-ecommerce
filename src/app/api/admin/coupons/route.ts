import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'

async function isAdmin(request: Request) {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value
    if (!token) return false
    const payload = await verifyAccessTokenEdge(token)
    return payload?.role === 'ADMIN'
}

// GET /api/admin/coupons — list all coupons
export async function GET() {
    try {
        if (!await isAdmin(new Request('http://localhost'))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ coupons })
    } catch (error) {
        console.error('GET /api/admin/coupons error:', error)
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}

// POST /api/admin/coupons — create coupon
export async function POST(request: Request) {
    try {
        if (!await isAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

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

        if (!code || !type || value === undefined || value === null) {
            return NextResponse.json({ error: 'Kod, tip ve değer zorunludur' }, { status: 400 })
        }

        const normalizedCode = code.trim().toUpperCase().replace(/\s+/g, '')

        // Check uniqueness
        const existing = await prisma.coupon.findUnique({ where: { code: normalizedCode } })
        if (existing) {
            return NextResponse.json({ error: 'Bu kupon kodu zaten kullanılıyor' }, { status: 400 })
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: normalizedCode,
                type,
                value: Number(value),
                description: description || null,
                minOrderAmount: minOrderAmount ? Number(minOrderAmount) : null,
                maxDiscount: maxDiscount ? Number(maxDiscount) : null,
                usageLimit: usageLimit ? Number(usageLimit) : null,
                isActive: isActive !== false,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            }
        })

        return NextResponse.json({ coupon }, { status: 201 })
    } catch (error) {
        console.error('POST /api/admin/coupons error:', error)
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}
