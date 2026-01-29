'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { updateProfile } from '@/actions/accountActions'
import { User, Mail, Phone, Save, Loader2 } from 'lucide-react'
import { useToast } from '@/context/ToastContext'

interface ProfileFormProps {
    user: {
        firstName: string
        lastName: string
        phone: string
        email: string
    }
    locale: string
}

export default function ProfileForm({ user, locale }: ProfileFormProps) {
    const isTr = locale === 'tr'
    const { addToast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || '',
        email: user.email
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await updateProfile(formData)

            if (result.success) {
                addToast(isTr ? 'Profil güncellendi' : 'Profile updated', 'success')
            } else {
                addToast(result.message || (isTr ? 'Hata oluştu' : 'Error occurred'), 'error')
            }
        } catch (error) {
            addToast(isTr ? 'Bir hata oluştu' : 'An error occurred', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        {isTr ? 'Ad' : 'First Name'}
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="input !pl-10 w-full"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">
                        {isTr ? 'Soyad' : 'Last Name'}
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="input !pl-10 w-full"
                            required
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    {isTr ? 'E-posta' : 'Email'}
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input !pl-10 w-full"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    {isTr ? 'Telefon' : 'Phone'}
                </label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input !pl-10 w-full"
                        placeholder="+90 5XX XXX XX XX"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full md:w-auto"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        {isTr ? 'Kaydediliyor...' : 'Saving...'}
                    </>
                ) : (
                    <>
                        <Save className="mr-2" size={18} />
                        {isTr ? 'Değişiklikleri Kaydet' : 'Save Changes'}
                    </>
                )}
            </button>
        </form>
    )
}
