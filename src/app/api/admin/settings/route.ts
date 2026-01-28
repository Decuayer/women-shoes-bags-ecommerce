import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { SettingType } from '@prisma/client'

export async function GET() {
    try {
        const settings = await prisma.siteSettings.findMany()
        return NextResponse.json(settings)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { key, type, title_tr, title_en, content_tr, content_en, jsonData, isActive } = body

        // Upsert setting based on key
        const setting = await prisma.siteSettings.upsert({
            where: { key },
            update: {
                title_tr,
                title_en,
                content_tr,
                content_en,
                jsonData,
                isActive
            },
            create: {
                key,
                type: type as SettingType, // Ensure typo safety
                title_tr,
                title_en,
                content_tr,
                content_en,
                jsonData,
                isActive
            }
        })

        return NextResponse.json(setting)
    } catch (error) {
        console.error('Settings save error:', error)
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
    }
}
