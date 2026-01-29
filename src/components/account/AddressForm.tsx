'use client'

import { useState } from 'react'
import { AddressFormData, addAddress, updateAddress } from '@/actions/addressActions'
import { useToast } from '@/context/ToastContext'
import { X, Save } from 'lucide-react'

interface Address {
    id: string
    title: string
    fullName: string
    phone: string
    addressLine1: string
    addressLine2: string | null
    city: string
    state: string
    postalCode: string
    country: string
    isDefault: boolean
}

interface AddressFormProps {
    address?: Address
    locale: string
    onClose: () => void
    onSuccess?: () => void
}

export default function AddressForm({ address, locale, onClose, onSuccess }: AddressFormProps) {
    const isTr = locale === 'tr'
    const { addToast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<AddressFormData>({
        title: address?.title || '',
        fullName: address?.fullName || '',
        phone: address?.phone || '',
        addressLine1: address?.addressLine1 || '',
        addressLine2: address?.addressLine2 || '',
        city: address?.city || '',
        state: address?.state || '',
        postalCode: address?.postalCode || '',
        country: address?.country || 'TR',
        isDefault: address?.isDefault || false
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            let result
            if (address) {
                result = await updateAddress(address.id, formData)
            } else {
                result = await addAddress(formData)
            }

            if (result.success) {
                addToast(
                    isTr ? 'Adres kaydedildi' : 'Address saved successfully',
                    'success'
                )
                if (onSuccess) onSuccess()
                onClose()
            } else {
                addToast(
                    isTr ? 'Bir hata oluştu' : 'An error occurred',
                    'error'
                )
            }
        } catch {
            addToast(
                isTr ? 'Bir hata oluştu' : 'An error occurred',
                'error'
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-background w-full max-w-lg rounded-2xl shadow-xl border border-border flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-bold">
                        {address
                            ? (isTr ? 'Adresi Düzenle' : 'Edit Address')
                            : (isTr ? 'Yeni Adres Ekle' : 'Add New Address')
                        }
                    </h2>
                    <button
                        onClick={onClose}
                        className="btn-ghost p-2 rounded-lg hover:bg-surface"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">
                            {isTr ? 'Adres Başlığı' : 'Address Title'} (Örn: Ev, İş)
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="input w-full"
                            placeholder={isTr ? 'Örn: Ev' : 'e.g. Home'}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                {isTr ? 'Ad Soyad' : 'Full Name'}
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="input w-full"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                {isTr ? 'Telefon' : 'Phone'}
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="input w-full"
                            />
                        </div>
                    </div>

                    {/* Address Line 1 */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">
                            {isTr ? 'Adres' : 'Address'}
                        </label>
                        <input
                            type="text"
                            name="addressLine1"
                            value={formData.addressLine1}
                            onChange={handleChange}
                            required
                            className="input w-full"
                            placeholder={isTr ? 'Cadde, sokak, no...' : 'Street address'}
                        />
                    </div>

                    {/* Address Line 2 */}
                    <div>
                        <input
                            type="text"
                            name="addressLine2"
                            value={formData.addressLine2 || ''}
                            onChange={handleChange}
                            className="input w-full"
                            placeholder={isTr ? 'Daire no, kat (Opsiyonel)' : 'Apartment, suite, etc. (Optional)'}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* City */}
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                {isTr ? 'Şehir' : 'City'}
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="input w-full"
                            />
                        </div>

                        {/* State */}
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                {isTr ? 'İlçe' : 'State/District'}
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                className="input w-full"
                            />
                        </div>
                    </div>

                    {/* Postal Code */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">
                            {isTr ? 'Posta Kodu' : 'Postal Code'}
                        </label>
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            required
                            className="input w-full"
                        />
                    </div>

                    {/* Is Default Checkbox */}
                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="isDefault"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <label htmlFor="isDefault" className="text-sm cursor-pointer select-none">
                            {isTr ? 'Varsayılan adres olarak ayarla' : 'Set as default address'}
                        </label>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost flex-1"
                            disabled={isLoading}
                        >
                            {isTr ? 'İptal' : 'Cancel'}
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                <>
                                    <Save size={18} className="mr-2" />
                                    {isTr ? 'Kaydet' : 'Save'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
