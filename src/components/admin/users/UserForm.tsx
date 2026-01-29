'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface UserFormProps {
    initialData: any
    locale: string
}

export default function UserForm({ initialData, locale }: UserFormProps) {
    const router = useRouter()
    const isTr = locale === 'tr'
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone || '',
        role: initialData.role
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch(`/api/admin/users/${initialData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!res.ok) throw new Error('Failed to update')

            router.refresh()
            router.push(`/${locale}/admin/users`)
        } catch (error) {
            console.error('Update error:', error)
            alert(isTr ? 'Güncelleme hatası' : 'Update failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/${locale}/admin/users`} className="btn btn-ghost rounded-full p-2">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold">
                        {isTr ? 'Kullanıcı Düzenle' : 'Edit User'}
                    </h1>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary flex items-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isTr ? 'Kaydet' : 'Save'}
                </button>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{isTr ? 'Ad' : 'First Name'}</label>
                        <input
                            type="text"
                            required
                            className="input w-full"
                            value={formData.firstName}
                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{isTr ? 'Soyad' : 'Last Name'}</label>
                        <input
                            type="text"
                            required
                            className="input w-full"
                            value={formData.lastName}
                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input
                            type="email"
                            required
                            className="input w-full"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{isTr ? 'Telefon' : 'Phone'}</label>
                        <input
                            type="tel"
                            className="input w-full"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{isTr ? 'Rol' : 'Role'}</label>
                        <select
                            className="input w-full"
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                </div>
            </div>
        </form>
    )
}
