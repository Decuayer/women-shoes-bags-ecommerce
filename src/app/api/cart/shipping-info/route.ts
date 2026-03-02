import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getShippingSettings } from '@/lib/settings'

// GET /api/cart/shipping-info — returns admin-configured shipping settings
export async function GET() {
    try {
        const settings = await getShippingSettings()
        return NextResponse.json(settings)
    } catch (error) {
        console.error('shipping-info error:', error)
        // Return safe defaults if DB fails
        return NextResponse.json({ freeShippingThreshold: 1500, shippingCost: 50 })
    }
}
