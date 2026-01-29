import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSlider from '@/components/home/HeroSlider'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import CategoryShowcase from '@/components/home/CategoryShowcase'
import { prisma } from '@/lib/prisma'

interface HomePageProps {
    params: Promise<{ locale: string }>
}

async function getFeaturedProducts(locale: string) {
    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            isFeatured: true,
        },
        include: {
            category: true,
            images: {
                orderBy: { displayOrder: 'asc' },
                take: 1,
            },
        },
        take: 8,
        orderBy: { createdAt: 'desc' },
    })

    return products.map((product) => ({
        id: product.id,
        slug: product.slug,
        name: locale === 'tr' ? product.name_tr : product.name_en,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
        category: {
            name: locale === 'tr' ? product.category.name_tr : product.category.name_en,
            slug: product.category.slug,
        },
        images: product.images.map((img) => ({
            url: img.url,
            alt: locale === 'tr' ? (img.alt_tr || product.name_tr) : (img.alt_en || product.name_en),
        })),
        rating: 4.5, // Placeholder - will be calculated from reviews later
    }))
}

import { getGeneralSettings, getAnnouncementSettings, getSliderSettings } from '@/lib/settings'

export default async function HomePage({ params }: HomePageProps) {
    const { locale } = await params
    const featuredProducts = await getFeaturedProducts(locale)
    const general = await getGeneralSettings()
    const announcement = await getAnnouncementSettings()
    const slider = await getSliderSettings() // This returns array of slides

    return (
        <div className="min-h-screen flex flex-col">
            <Header locale={locale} settings={{ general, announcement }} />

            <main className="flex-1">
                <HeroSlider locale={locale} slides={slider} />
                <CategoryShowcase locale={locale} />
                <FeaturedProducts locale={locale} products={featuredProducts} />

                {/* Newsletter Section */}
                <section className="section bg-gradient-to-br from-secondary/10 to-background">
                    <div className="container">
                        <div className="max-w-xl mx-auto text-center">
                            <h2 className="text-3xl font-bold mb-4">
                                {locale === 'tr' ? 'Bültenimize Katılın' : 'Join Our Newsletter'}
                            </h2>
                            <p className="text-text-muted mb-6">
                                {locale === 'tr'
                                    ? 'Yeni ürünler ve özel indirimlerden ilk siz haberdar olun'
                                    : 'Be the first to know about new products and exclusive discounts'
                                }
                            </p>
                            <form className="flex gap-3">
                                <input
                                    type="email"
                                    placeholder={locale === 'tr' ? 'E-posta adresiniz' : 'Your email address'}
                                    className="input flex-1"
                                    required
                                />
                                <button type="submit" className="btn btn-primary whitespace-nowrap">
                                    {locale === 'tr' ? 'Abone Ol' : 'Subscribe'}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <Footer locale={locale} />
        </div>
    )
}
