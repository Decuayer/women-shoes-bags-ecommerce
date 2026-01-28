import CategoryForm from '@/components/admin/CategoryForm'

interface CreateCategoryPageProps {
    params: Promise<{ locale: string }>
}

export default async function CreateCategoryPage({ params }: CreateCategoryPageProps) {
    const { locale } = await params
    return <CategoryForm locale={locale} />
}
