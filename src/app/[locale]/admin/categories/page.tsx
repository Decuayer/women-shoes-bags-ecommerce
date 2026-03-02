import { prisma } from '@/lib/prisma'
import CategoryListClient from '@/components/admin/categories/CategoryListClient'

interface CategoryListPageProps {
    params: Promise<{ locale: string }>
}

export default async function CategoryListPage({ params }: CategoryListPageProps) {
    const { locale } = await params

    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true }
            },
            parent: {
                select: { id: true, name_en: true, name_tr: true }
            },
            children: {
                select: {
                    id: true,
                    name_en: true,
                    name_tr: true,
                    slug: true,
                    isActive: true,
                    displayOrder: true,
                    _count: { select: { products: true } }
                },
                orderBy: { displayOrder: 'asc' }
            }
        },
        orderBy: [{ displayOrder: 'asc' }, { name_en: 'asc' }]
    })

    return (
        <CategoryListClient data={categories} locale={locale} />
    )
}
