import { prisma } from '@/lib/prisma'
import CategoryForm from '@/components/admin/CategoryForm'

interface CreateCategoryPageProps {
    params: Promise<{ locale: string }>
}

export default async function CreateCategoryPage({ params }: CreateCategoryPageProps) {
    const { locale } = await params

    // Fetch all parent-level categories (no parentId) for the dropdown
    const parentCategories = await prisma.category.findMany({
        where: { parentId: null, isActive: true },
        select: { id: true, name_tr: true, name_en: true },
        orderBy: { name_en: 'asc' }
    })

    return <CategoryForm locale={locale} parentCategories={parentCategories} />
}
