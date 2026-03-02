import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// POST /api/coupons/validate
// Body: { code: string, subtotal: number }
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { code, subtotal } = body

        if (!code || typeof subtotal !== 'number') {
            return NextResponse.json(
                { error: 'Kupon kodu ve sepet tutarı gerekli' },
                { status: 400 }
            )
        }

        const normalizedCode = code.trim().toUpperCase()

        const coupon = await prisma.coupon.findUnique({
            where: { code: normalizedCode }
        })

        // Not found
        if (!coupon) {
            return NextResponse.json(
                { error: 'Geçersiz kupon kodu' },
                { status: 404 }
            )
        }

        // Inactive
        if (!coupon.isActive) {
            return NextResponse.json(
                { error: 'Bu kupon kodu aktif değil' },
                { status: 400 }
            )
        }

        // Expired
        if (coupon.expiresAt && coupon.expiresAt < new Date()) {
            return NextResponse.json(
                { error: 'Bu kupon kodunun süresi dolmuş' },
                { status: 400 }
            )
        }

        // Usage limit exceeded
        if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
            return NextResponse.json(
                { error: 'Bu kupon kodunun kullanım limiti dolmuş' },
                { status: 400 }
            )
        }

        // Minimum order amount
        if (coupon.minOrderAmount !== null && subtotal < Number(coupon.minOrderAmount)) {
            return NextResponse.json(
                {
                    error: `Bu kupon için minimum sepet tutarı ${Number(coupon.minOrderAmount).toLocaleString('tr-TR')} TL olmalıdır`
                },
                { status: 400 }
            )
        }

        // Calculate discount
        let discountAmount = 0
        if (coupon.type === 'PERCENTAGE') {
            discountAmount = (subtotal * Number(coupon.value)) / 100
            // Apply max discount cap if set
            if (coupon.maxDiscount !== null) {
                discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount))
            }
        } else {
            // FIXED
            discountAmount = Math.min(Number(coupon.value), subtotal) // Can't exceed subtotal
        }

        discountAmount = Math.round(discountAmount * 100) / 100 // Round to 2 decimals

        return NextResponse.json({
            valid: true,
            coupon: {
                code: coupon.code,
                type: coupon.type,
                value: Number(coupon.value),
                description: coupon.description,
            },
            discountAmount,
        })
    } catch (error) {
        console.error('POST /api/coupons/validate error:', error)
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}
