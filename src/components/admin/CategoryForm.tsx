'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface CategoryFormProps {
    initialData?: {
        id: string
        name_tr: string
        name_en: string
    }
    locale: string
}

export default function CategoryForm({ initialData, locale }: CategoryFormProps) {
    const router = useRouter()
    const isTr = locale === 'tr'
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name_tr: initialData?.name_tr || '',
        name_en: initialData?.name_en || '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const url = initialData
                ? `/api/admin/categories/${initialData.id}`
                : '/api/admin/categories'

            const method = initialData ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!res.ok) throw new Error('Failed to save category')

            router.push(`/${locale}/admin/categories`)
            router.refresh()
        } catch (error) {
            console.error('Save error:', error)
            alert('Failed to save category')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-4 mb-6">
                <Link href={`/${locale}/admin/categories`} className="btn btn-ghost rounded-full p-2">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold">
                    {initialData ? (isTr ? 'Kategoriyi Düzenle' : 'Edit Category') : (isTr ? 'Yeni Kategori' : 'New Category')}
                </h1>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                <div>
                    <label className="label">Category Name (EN)</label>
                    <input
                        required
                        className="input w-full"
                        value={formData.name_en}
                        onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                        placeholder="Shoes"
                    />
                </div>
                <div>
                    <label className="label">Kategori Adı (TR)</label>
                    <input
                        required
                        className="input w-full"
                        value={formData.name_tr}
                        onChange={(e) => setFormData({ ...formData, name_tr: e.target.value })}
                        placeholder="Ayakkabılar"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full flex items-center justify-center gap-2 mt-6"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isTr ? 'Kaydet' : 'Save'}
                </button>
            </div>
        </form>
    )
}
