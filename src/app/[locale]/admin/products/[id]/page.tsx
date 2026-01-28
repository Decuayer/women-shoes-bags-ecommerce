import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/products/ProductForm'
import { notFound } from 'next/navigation'

interface EditProductPageProps {
    params: Promise<{ locale: string; id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { locale, id } = await params
    const isTr = locale === 'tr'

    // Fetch product and categories in parallel
    const [product, categories] = await Promise.all([
        prisma.product.findUnique({
            where: { id },
            include: {
                variants: true,
                images: {
                    orderBy: { displayOrder: 'asc' }
                }
            }
        }),
        prisma.category.findMany({
            select: {
                id: true,
                slug: true,
                name_tr: true,
                name_en: true
            }
        })
    ])

    if (!product) {
        notFound()
    }

    const formattedCategories = categories.map(c => ({
        id: c.id,
        slug: c.slug,
        name: isTr ? c.name_tr : c.name_en
    }))

    return (
        <ProductForm
            initialData={product}
            categories={formattedCategories}
            locale={locale}
        />
    )
}
