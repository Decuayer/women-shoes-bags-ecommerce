'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

interface LoginFormProps {
    locale: string
}

export default function LoginForm({ locale }: LoginFormProps) {
    const router = useRouter()
    const isTr = locale === 'tr'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Login failed')
            }

            // Redirect to account page on success
            router.push(`/${locale}/account`)
            router.refresh()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    {isTr ? 'Giriş Yap' : 'Sign In'}
                </h1>
                <p className="text-text-muted">
                    {isTr
                        ? 'Hesabınıza giriş yapın'
                        : 'Sign in to your account'
                    }
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-error/10 text-error text-sm p-4 rounded-lg">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm text-text-muted mb-2">
                        {isTr ? 'E-posta' : 'Email'}
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input pl-12"
                            placeholder="ornek@email.com"
                            required
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark" size={20} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-text-muted mb-2">
                        {isTr ? 'Şifre' : 'Password'}
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input pl-12 pr-12"
                            placeholder="••••••••"
                            required
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
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-border" />
                        <span className="text-text-muted">
                            {isTr ? 'Beni hatırla' : 'Remember me'}
                        </span>
                    </label>
                    <Link href={`/${locale}/auth/forgot-password`} className="text-secondary hover:underline">
                        {isTr ? 'Şifremi unuttum' : 'Forgot password?'}
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full"
                >
                    {isLoading ? (
                        <span className="animate-pulse">
                            {isTr ? 'Giriş yapılıyor...' : 'Signing in...'}
                        </span>
                    ) : (
                        <>
                            {isTr ? 'Giriş Yap' : 'Sign In'}
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-text-muted">
                    {isTr ? 'Hesabınız yok mu?' : "Don't have an account?"}{' '}
                    <Link href={`/${locale}/auth/register`} className="text-secondary font-medium hover:underline">
                        {isTr ? 'Kayıt Ol' : 'Sign Up'}
                    </Link>
                </p>
            </div>
        </div>
    )
}
