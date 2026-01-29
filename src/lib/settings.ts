import { prisma } from '@/lib/prisma'
import { SiteSettings } from '@prisma/client'

export type GeneralSettings = {
    siteName: string
    contactEmail: string
    logoText1: string
    logoText2: string
}

export type AnnouncementSettings = {
    isActive: boolean
    text_tr: string
    text_en: string
}

export async function getGeneralSettings(): Promise<GeneralSettings> {
    const setting = await prisma.siteSettings.findUnique({
        where: { key: 'site_general' }
    })

    const jsonData = (setting?.jsonData as any) || {}

    return {
        siteName: setting?.title_en || 'CRAZYSHOES',
        contactEmail: jsonData.email || 'info@crazyshoes.com',
        logoText1: jsonData.logoText1 || 'CRAZY',
        logoText2: jsonData.logoText2 || 'SHOES'
    }
}

export async function getAnnouncementSettings(): Promise<AnnouncementSettings> {
    const setting = await prisma.siteSettings.findUnique({
        where: { key: 'announcement_bar' }
    })

    return {
        isActive: setting?.isActive ?? true,
        text_tr: setting?.content_tr || 'Ücretsiz Kargo & İade',
        text_en: setting?.content_en || 'Free Shipping & Returns'
    }
}


export async function getSliderSettings() {
    const setting = await prisma.siteSettings.findUnique({
        where: { key: 'hero_slider' }
    })

    return (setting?.jsonData as any[]) || []
}

export type ShippingSettings = {
    freeShippingThreshold: number
    shippingCost: number
}

export async function getShippingSettings(): Promise<ShippingSettings> {
    const setting = await prisma.siteSettings.findUnique({
        where: { key: 'shipping_settings' }
    })

    const jsonData = (setting?.jsonData as any) || {}

    return {
        freeShippingThreshold: jsonData.freeShippingThreshold || 1500,
        shippingCost: jsonData.shippingCost || 50
    }
}

