'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Check } from 'lucide-react'

interface RegisterFormProps {
    locale: string
}

export default function RegisterForm({ locale }: RegisterFormProps) {
    const router = useRouter()
    const isTr = locale === 'tr'

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [agreeMarketing, setAgreeMarketing] = useState(false)

    const passwordStrength = (password: string) => {
        let strength = 0
        if (password.length >= 8) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++
        return strength
    }

    const strength = passwordStrength(formData.password)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError(isTr ? 'Şifreler eşleşmiyor' : 'Passwords do not match')
            return
        }

        if (!agreeTerms) {
            setError(isTr ? 'Kullanım koşullarını kabul etmelisiniz' : 'You must agree to the terms')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed')
            }

            // Redirect to account page on success
            router.push(`/${locale}/account`)
            router.refresh()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Registration failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    {isTr ? 'Hesap Oluştur' : 'Create Account'}
                </h1>
                <p className="text-text-muted">
                    {isTr
                        ? 'Alışverişe başlamak için hesap oluşturun'
                        : 'Create an account to start shopping'
                    }
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-error/10 text-error text-sm p-4 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-text-muted mb-2">
                            {isTr ? 'Ad' : 'First Name'}
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="input !pl-12"
                                required
                            />
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark" size={20} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-text-muted mb-2">
                            {isTr ? 'Soyad' : 'Last Name'}
                        </label>
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="input"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-text-muted mb-2">
                        {isTr ? 'E-posta' : 'Email'}
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="input !pl-12"
                            placeholder="ornek@email.com"
                            required
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark" size={20} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-text-muted mb-2">
                        {isTr ? 'Telefon' : 'Phone'}
                    </label>
                    <div className="relative">
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="input !pl-12"
                            placeholder="+90 5XX XXX XX XX"
                        />
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark" size={20} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-text-muted mb-2">
                        {isTr ? 'Şifre' : 'Password'}
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="input !pl-12 pr-12"
                            placeholder="••••••••"
                            required
                            minLength={8}
                        />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark" size={20} />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dark hover:text-text"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {/* Password Strength */}
                    {formData.password && (
                        <div className="mt-2">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded-full ${i <= strength
                                                ? strength <= 2 ? 'bg-error' : strength <= 4 ? 'bg-warning' : 'bg-success'
                                                : 'bg-surface-light'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className={`text-xs mt-1 ${strength <= 2 ? 'text-error' : strength <= 4 ? 'text-warning' : 'text-success'
                                }`}>
                                {strength <= 2
                                    ? (isTr ? 'Zayıf' : 'Weak')
                                    : strength <= 4
                                        ? (isTr ? 'Orta' : 'Medium')
                                        : (isTr ? 'Güçlü' : 'Strong')
                                }
                            </p>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm text-text-muted mb-2">
                        {isTr ? 'Şifre Tekrar' : 'Confirm Password'}
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="input !pl-12"
                            placeholder="••••••••"
                            required
                        />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark" size={20} />
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                            <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-success" size={20} />
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            className="w-4 h-4 rounded border-border mt-1"
                        />
                        <span className="text-sm text-text-muted">
                            {isTr ? (
                                <>
                                    <Link href={`/${locale}/terms`} className="text-secondary hover:underline">Kullanım koşullarını</Link>
                                    {' '}ve{' '}
                                    <Link href={`/${locale}/privacy`} className="text-secondary hover:underline">gizlilik politikasını</Link>
                                    {' '}kabul ediyorum. *
                                </>
                            ) : (
                                <>
                                    I agree to the{' '}
                                    <Link href={`/${locale}/terms`} className="text-secondary hover:underline">Terms of Service</Link>
                                    {' '}and{' '}
                                    <Link href={`/${locale}/privacy`} className="text-secondary hover:underline">Privacy Policy</Link>. *
                                </>
                            )}
                        </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={agreeMarketing}
                            onChange={(e) => setAgreeMarketing(e.target.checked)}
                            className="w-4 h-4 rounded border-border mt-1"
                        />
                        <span className="text-sm text-text-muted">
                            {isTr
                                ? 'Kampanya ve indirimlerden haberdar olmak istiyorum.'
                                : 'I want to receive news about campaigns and discounts.'
                            }
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full"
                >
                    {isLoading ? (
                        <span className="animate-pulse">
                            {isTr ? 'Kayıt yapılıyor...' : 'Creating account...'}
                        </span>
                    ) : (
                        <>
                            {isTr ? 'Hesap Oluştur' : 'Create Account'}
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-text-muted">
                    {isTr ? 'Zaten hesabınız var mı?' : 'Already have an account?'}{' '}
                    <Link href={`/${locale}/auth/login`} className="text-secondary font-medium hover:underline">
                        {isTr ? 'Giriş Yap' : 'Sign In'}
                    </Link>
                </p>
            </div>
        </div>
    )
}
