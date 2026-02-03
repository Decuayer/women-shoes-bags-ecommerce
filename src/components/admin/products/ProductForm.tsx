'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ImageUploader from './ImageUploader'
import VariantManager from './VariantManager'
import { useToast } from '@/context/ToastContext'

interface Category {
    id: string
    name: string
    slug: string
}

interface ProductFormProps {
    initialData?: any
    categories: Category[]
    locale: string
}

export default function ProductForm({ initialData, categories, locale }: ProductFormProps) {
    const router = useRouter()
    const isTr = locale === 'tr'
    const { addToast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [images, setImages] = useState<{ file?: File; url: string }[]>(
        initialData?.images?.map((img: any) => ({ url: img.url })) || []
    )
    const [variants, setVariants] = useState<any[]>(
        initialData?.variants || []
    )

    const [formData, setFormData] = useState({
        name_tr: initialData?.name_tr || '',
        name_en: initialData?.name_en || '',
        description_tr: initialData?.description_tr || '',
        description_en: initialData?.description_en || '',
        price: initialData?.price || '',
        compareAtPrice: initialData?.compareAtPrice || '',
        categoryId: initialData?.categoryId || '',
        brand: initialData?.brand || '',
        material_tr: initialData?.material_tr || '',
        material_en: initialData?.material_en || '',
        isActive: initialData?.isActive ?? true,
        isFeatured: initialData?.isFeatured ?? false,
    })

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // First upload images if there are new files
            const uploadedImageUrls: string[] = []

            // For existing images, keep their URLs
            const existingImages = images.filter(img => !img.file).map(img => img.url)

            // Upload new images
            const newImages = images.filter(img => img.file)

            for (const img of newImages) {
                if (img.file) {
                    const formData = new FormData()
                    formData.append('file', img.file)

                    const res = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    })

                    if (res.ok) {
                        const data = await res.json()
                        uploadedImageUrls.push(data.url)
                    }
                }
            }

            const finalImages = [...existingImages, ...uploadedImageUrls]

            // Prepare payload - auto-populate English fields from Turkish
            const payload = {
                ...formData,
                // Auto-fill English fields with Turkish content
                name_en: formData.name_tr,
                description_en: formData.description_tr,
                material_en: formData.material_tr,
                price: Number(formData.price),
                compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
                images: finalImages,
                variants: variants
            }

            const url = initialData
                ? `/api/admin/products/${initialData.id}`
                : '/api/admin/products'

            const method = initialData ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || 'Failed to save product')
            }

            const savedProduct = await res.json()

            // Show success toast
            addToast(
                isTr
                    ? `"${formData.name_tr}" başarıyla ${initialData ? 'güncellendi' : 'eklendi'}!`
                    : `"${formData.name_tr}" ${initialData ? 'updated' : 'added'} successfully!`,
                'success',
                { title: isTr ? 'Başarılı' : 'Success' }
            )

            router.push(`/${locale}/admin/products`)
            router.refresh()
        } catch (error: any) {
            console.error('Save error:', error)

            // Show detailed error toast
            addToast(
                error.message || (isTr ? 'Ürün kaydedilemedi' : 'Failed to save product'),
                'error',
                { title: isTr ? 'Hata' : 'Error', duration: 7000 }
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 sticky top-20 bg-background z-10 py-4 border-b border-border">
                <div className="flex items-center gap-4">
                    <Link href={`/${locale}/admin/products`} className="btn btn-ghost rounded-full p-2">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {initialData ? (isTr ? 'Ürünü Düzenle' : 'Edit Product') : (isTr ? 'Yeni Ürün' : 'New Product')}
                        </h1>
                        <p className="text-text-muted text-sm">
                            {isTr ? 'Ürün bilgilerini aşağıdan yönetin.' : 'Manage product details below.'}
                        </p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary flex items-center gap-2 min-w-[120px]"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isTr ? 'Kaydet' : 'Save'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Details */}
                    <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                        <h2 className="font-bold text-lg mb-4 border-b border-border pb-2">
                            Temel Bilgiler
                        </h2>

                        <div>
                            <label className="label">Ürün Adı</label>
                            <input
                                required
                                className="input w-full"
                                value={formData.name_tr}
                                onChange={(e) => handleChange('name_tr', e.target.value)}
                                placeholder="Siyah Deri Çanta"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Kategori</label>
                                <select
                                    required
                                    className="input w-full"
                                    value={formData.categoryId}
                                    onChange={(e) => handleChange('categoryId', e.target.value)}
                                >
                                    <option value="">Kategori Seçin</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="label">Marka</label>
                                <input
                                    className="input w-full"
                                    value={formData.brand}
                                    onChange={(e) => handleChange('brand', e.target.value)}
                                    placeholder="Marka Adı"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Açıklama</label>
                            <textarea
                                className="input w-full h-32 py-2"
                                value={formData.description_tr}
                                onChange={(e) => handleChange('description_tr', e.target.value)}
                                placeholder="Ürün açıklamasını buraya yazın..."
                            />
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-surface border border-border rounded-xl p-6">
                        <h2 className="font-bold text-lg mb-4 border-b border-border pb-2">
                            Ürün Görselleri
                        </h2>
                        <ImageUploader images={images} onChange={setImages} />
                    </div>

                    {/* Variants */}
                    <div className="bg-surface border border-border rounded-xl p-6">
                        <h2 className="font-bold text-lg mb-4 border-b border-border pb-2">
                            Varyantlar & Stok
                        </h2>
                        <VariantManager variants={variants} onChange={setVariants} locale={locale} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Pricing */}
                    <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                        <h2 className="font-bold text-lg mb-4 border-b border-border pb-2">
                            Fiyatlandırma
                        </h2>

                        <div>
                            <label className="label">Satış Fiyatı (TL)</label>
                            <input
                                type="number"
                                required
                                className="input w-full"
                                value={formData.price}
                                onChange={(e) => handleChange('price', e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="label">İndirimsiz Fiyat (TL)</label>
                            <input
                                type="number"
                                className="input w-full"
                                value={formData.compareAtPrice}
                                onChange={(e) => handleChange('compareAtPrice', e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                        <h2 className="font-bold text-lg mb-4 border-b border-border pb-2">
                            Durum
                        </h2>

                        <label className="flex items-center gap-3 p-3 bg-surface-light rounded-lg border border-border cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => handleChange('isActive', e.target.checked)}
                                className="w-5 h-5 accent-secondary"
                            />
                            <div>
                                <p className="font-medium">Aktif</p>
                                <p className="text-xs text-text-muted">Şu anda satın alınabilir</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-surface-light rounded-lg border border-border cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isFeatured}
                                onChange={(e) => handleChange('isFeatured', e.target.checked)}
                                className="w-5 h-5 accent-secondary"
                            />
                            <div>
                                <p className="font-medium">Öne Çıkan</p>
                                <p className="text-xs text-text-muted">Ana sayfada göster</p>
                            </div>
                        </label>
                    </div>

                    {/* Extra Info */}
                    <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                        <h2 className="font-bold text-lg mb-4 border-b border-border pb-2">
                            Ek Özellikler
                        </h2>
                        <div>
                            <label className="label">Malzeme</label>
                            <input
                                className="input w-full"
                                value={formData.material_tr}
                                onChange={(e) => handleChange('material_tr', e.target.value)}
                                placeholder="Örn: %100 Deri, Pamuk, Süet..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
