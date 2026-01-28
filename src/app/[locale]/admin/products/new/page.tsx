import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/products/ProductForm'

interface CreateProductPageProps {
    params: Promise<{ locale: string }>
}

export default async function CreateProductPage({ params }: CreateProductPageProps) {
    const { locale } = await params
    const isTr = locale === 'tr'

    // Fetch categories for the dropdown
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            slug: true,
            name_tr: true,
            name_en: true
        }
    })

    const formattedCategories = categories.map(c => ({
        id: c.id,
        slug: c.slug,
        name: isTr ? c.name_tr : c.name_en
    }))

    return (
        <ProductForm
            categories={formattedCategories}
            locale={locale}
        />
    )
}
