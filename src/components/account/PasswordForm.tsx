'use client'

import { useState } from 'react'
import { changePassword } from '@/actions/accountActions'
import { Lock, Save, Loader2, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/context/ToastContext'

interface PasswordFormProps {
    locale: string
}

export default function PasswordForm({ locale }: PasswordFormProps) {
    const isTr = locale === 'tr'
    const { addToast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.newPassword !== formData.confirmPassword) {
            addToast(isTr ? 'Yeni şifreler eşleşmiyor' : 'New passwords do not match', 'error')
            return
        }

        if (formData.newPassword.length < 6) {
            addToast(isTr ? 'Yeni şifre en az 6 karakter olmalı' : 'New password must be at least 6 characters', 'error')
            return
        }

        setIsLoading(true)

        try {
            const result = await changePassword(formData)

            if (result.success) {
                addToast(isTr ? 'Şifre başarıyla güncellendi' : 'Password updated successfully', 'success')
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
            } else {
                addToast(result.message || (isTr ? 'Hata oluştu' : 'Error occurred'), 'error')
            }
        } catch (error) {
            addToast(isTr ? 'Bir hata oluştu' : 'An error occurred', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const toggleVisibility = (field: 'current' | 'new' | 'confirm') => {
        if (field === 'current') setShowCurrentPassword(!showCurrentPassword)
        if (field === 'new') setShowNewPassword(!showNewPassword)
        if (field === 'confirm') setShowConfirmPassword(!showConfirmPassword)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <div>
                <label className="block text-sm font-medium mb-2">
                    {isTr ? 'Mevcut Şifre' : 'Current Password'}
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        className="input pl-10 pr-10 w-full"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => toggleVisibility('current')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                    >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    {isTr ? 'Yeni Şifre' : 'New Password'}
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="input pl-10 pr-10 w-full"
                        required
                        minLength={6}
                    />
                    <button
                        type="button"
                        onClick={() => toggleVisibility('new')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                    >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <p className="text-xs text-text-muted mt-1">
                    {isTr ? 'En az 6 karakter olmalı' : 'Must be at least 6 characters'}
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    {isTr ? 'Yeni Şifre (Tekrar)' : 'Confirm New Password'}
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="input pl-10 pr-10 w-full"
                        required
                        minLength={6}
                    />
                    <button
                        type="button"
                        onClick={() => toggleVisibility('confirm')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                    >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
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
                        {isTr ? 'Güncelleniyor...' : 'Updating...'}
                    </>
                ) : (
                    <>
                        <Save className="mr-2" size={18} />
                        {isTr ? 'Şifreyi Güncelle' : 'Update Password'}
                    </>
                )}
            </button>
        </form>
    )
}
