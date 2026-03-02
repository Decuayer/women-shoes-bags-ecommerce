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

export type ContactSettings = {
    phone: string
    email: string
    location: string
}

export async function getContactSettings(): Promise<ContactSettings> {
    const setting = await prisma.siteSettings.findUnique({
        where: { key: 'contact_info' }
    })

    const jsonData = (setting?.jsonData as any) || {}

    return {
        phone: jsonData.phone || '+90 532 395 44 57',
        email: jsonData.email || 'crazyshoes4545@gmail.com',
        location: jsonData.location || 'Manisa, Türkiye'
    }
}

export type SocialMediaSettings = {
    facebook: string
    instagram: string
    twitter: string
}

export async function getSocialMediaSettings(): Promise<SocialMediaSettings> {
    const setting = await prisma.siteSettings.findUnique({
        where: { key: 'social_media' }
    })

    const jsonData = (setting?.jsonData as any) || {}

    return {
        facebook: jsonData.facebook || '#',
        instagram: jsonData.instagram || '#',
        twitter: jsonData.twitter || '#'
    }
}

export type FeatureHighlight = {
    id: string
    icon: string
    title_tr: string
    title_en: string
    desc_tr: string
    desc_en: string
    isActive: boolean
}

export async function getFeatureHighlights(): Promise<FeatureHighlight[]> {
    const setting = await prisma.siteSettings.findUnique({
        where: { key: 'feature_highlights' }
    })

    const features = (setting?.jsonData as any[]) || []

    // Return only active features, or default features if none configured
    if (features.length === 0) {
        return [
            {
                id: '1',
                icon: 'Truck',
                title_tr: 'Ücretsiz Kargo',
                title_en: 'Free Shipping',
                desc_tr: '1750 TL üzeri siparişlerde',
                desc_en: 'On orders over 1750 TL',
                isActive: true
            },
            {
                id: '2',
                icon: 'RefreshCw',
                title_tr: 'Kolay İade',
                title_en: 'Easy Returns',
                desc_tr: '14 gün içinde ücretsiz',
                desc_en: 'Free within 14 days',
                isActive: true
            },
            {
                id: '3',
                icon: 'Shield',
                title_tr: 'Güvenli Ödeme',
                title_en: 'Secure Payment',
                desc_tr: '256-bit SSL şifreleme',
                desc_en: '256-bit SSL encryption',
                isActive: true
            },
            {
                id: '4',
                icon: 'CreditCard',
                title_tr: 'Taksit İmkanı',
                title_en: 'Installment',
                desc_tr: '12 aya varan taksit',
                desc_en: 'Up to 12 installments',
                isActive: true
            }
        ]
    }

    return features.filter((f: any) => f.isActive !== false)
}

