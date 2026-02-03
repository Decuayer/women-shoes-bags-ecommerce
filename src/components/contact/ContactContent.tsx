'use client'

import { useState } from 'react'
import { useToast } from '@/context/ToastContext'
import { Mail, Phone, MapPin, Clock, Loader2, Send } from 'lucide-react'

interface ContactContentProps {
    locale: string
    settings: {
        general: any
        announcement: any
        contact: any
    }
}

export default function ContactContent({ locale, settings }: ContactContentProps) {
    const isTr = locale === 'tr'
    const { addToast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const { contact: contactSettings, general, announcement } = settings

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        }

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                addToast(
                    isTr ? 'Mesajınız başarıyla gönderildi.' : 'Your message has been sent successfully.',
                    'success',
                    { title: isTr ? 'Başarılı' : 'Success' }
                )
                e.currentTarget.reset()
            } else {
                throw new Error('Failed to send message')
            }
        } catch (error) {
            addToast(
                isTr ? 'Mesaj gönderilemedi.' : 'Failed to send message.',
                'error',
                { title: isTr ? 'Hata' : 'Error' }
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="container !py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        {isTr ? 'İletişim' : 'Contact Us'}
                    </h1>
                    <p className="text-text-muted max-w-2xl mx-auto">
                        {isTr
                            ? 'Sorularınız, önerileriniz veya talepleriniz için bizimle iletişime geçin. Size en kısa sürede dönüş yapacağız.'
                            : 'Get in touch with us for your questions, suggestions or requests. We will get back to you as soon as possible.'
                        }
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Contact Form */}
                    <div className="card p-6 md:p-8">
                        <h2 className="text-2xl font-bold mb-6">
                            {isTr ? 'Bize Ulaşın' : 'Send us a message'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="label">
                                    {isTr ? 'Ad Soyad' : 'Full Name'}
                                </label>
                                <input
                                    name="name"
                                    required
                                    type="text"
                                    className="input w-full"
                                    placeholder={isTr ? 'Adınız ve soyadınız' : 'Your full name'}
                                />
                            </div>
                            <div>
                                <label className="label">
                                    {isTr ? 'E-posta' : 'Email'}
                                </label>
                                <input
                                    name="email"
                                    required
                                    type="email"
                                    className="input w-full"
                                    placeholder={isTr ? 'ornek@email.com' : 'example@email.com'}
                                />
                            </div>
                            <div>
                                <label className="label">
                                    {isTr ? 'Konu' : 'Subject'}
                                </label>
                                <input
                                    name="subject"
                                    required
                                    type="text"
                                    className="input w-full"
                                    placeholder={isTr ? 'Mesajınızın konusu' : 'Subject of your message'}
                                />
                            </div>
                            <div>
                                <label className="label">
                                    {isTr ? 'Mesajınız' : 'Your Message'}
                                </label>
                                <textarea
                                    name="message"
                                    required
                                    className="input w-full min-h-32 resize-none"
                                    placeholder={isTr ? 'Mesajınızı buraya yazın...' : 'Write your message here...'}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary w-full flex items-center justify-center gap-2 group"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span>{isTr ? 'Gönder' : 'Send Message'}</span>
                                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold mb-6">
                                {isTr ? 'İletişim Bilgileri' : 'Contact Information'}
                            </h2>
                            <div className="space-y-4">
                                <a
                                    href={`tel:${contactSettings?.phone?.replace(/\s/g, '') || ''}`}
                                    className="flex items-start gap-4 p-4 rounded-lg bg-surface-light hover:bg-surface transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                        <Phone className="text-secondary" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {isTr ? 'Telefon' : 'Phone'}
                                        </h3>
                                        <p className="text-text-muted">{contactSettings?.phone || '-'}</p>
                                    </div>
                                </a>

                                <a
                                    href={`mailto:${contactSettings?.email || ''}`}
                                    className="flex items-start gap-4 p-4 rounded-lg bg-surface-light hover:bg-surface transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                        <Mail className="text-secondary" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {isTr ? 'E-posta' : 'Email'}
                                        </h3>
                                        <p className="text-text-muted">{contactSettings?.email || '-'}</p>
                                    </div>
                                </a>

                                <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-light">
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                        <MapPin className="text-secondary" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {isTr ? 'Adres' : 'Address'}
                                        </h3>
                                        <p className="text-text-muted">{contactSettings?.location || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-light">
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                        <Clock className="text-secondary" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {isTr ? 'Çalışma Saatleri' : 'Working Hours'}
                                        </h3>
                                        <p className="text-text-muted text-sm">
                                            {isTr ? 'Pazartesi - Cuma: 09:00 - 18:00' : 'Monday - Friday: 09:00 - 18:00'}
                                        </p>
                                        <p className="text-text-muted text-sm">
                                            {isTr ? 'Cumartesi: 10:00 - 16:00' : 'Saturday: 10:00 - 16:00'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Link */}
                        <div className="card p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                            <h3 className="font-semibold mb-2">
                                {isTr ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
                            </h3>
                            <p className="text-sm text-text-muted mb-4">
                                {isTr
                                    ? 'Aradığınız cevap S.S.S. sayfamızda olabilir.'
                                    : 'The answer you are looking for might be on our FAQ page.'
                                }
                            </p>
                            <a
                                href={`/${locale}/faq`}
                                className="btn btn-secondary btn-sm inline-flex"
                            >
                                {isTr ? 'S.S.S. Sayfasına Git' : 'Go to FAQ Page'}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
