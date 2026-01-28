'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/admin/products/ImageUploader'
import { Save, Loader2, Plus, Trash2 } from 'lucide-react'

interface SettingsClientProps {
    settings: any[]
    locale: string
}

export default function SettingsClient({ settings, locale }: SettingsClientProps) {
    const router = useRouter()
    const isTr = locale === 'tr'
    const [activeTab, setActiveTab] = useState('general')
    const [isLoading, setIsLoading] = useState(false)

    // Parse existing settings
    const sliderSettings = settings.find(s => s.key === 'hero_slider')
    const announcementSettings = settings.find(s => s.key === 'announcement_bar')
    const generalSettings = settings.find(s => s.key === 'site_general')

    // State for Sliders
    const [sliders, setSliders] = useState<any[]>(
        (sliderSettings?.jsonData as any[]) || []
    )

    // State for Announcement
    const [announcement, setAnnouncement] = useState({
        text_tr: announcementSettings?.content_tr || 'Ücretsiz Kargo & İade',
        text_en: announcementSettings?.content_en || 'Free Shipping & Returns',
        isActive: announcementSettings?.isActive ?? true
    })

    // State for General
    const [general, setGeneral] = useState({
        siteName: generalSettings?.title_en || 'LUXEBAGS',
        contactEmail: (generalSettings?.jsonData as any)?.email || 'info@luxebags.com'
    })

    const handleSave = async () => {
        setIsLoading(true)
        try {
            // Process slider images
            const processedSliders = await Promise.all(sliders.map(async (slide) => {
                if (slide.file) {
                    const formData = new FormData()
                    formData.append('file', slide.file)

                    const res = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    })

                    if (res.ok) {
                        const data = await res.json()
                        const { file, ...rest } = slide
                        return { ...rest, image: data.url }
                    }
                }
                const { file, ...rest } = slide
                return rest
            }))

            setSliders(processedSliders)

            const promises = []

            // Save Sliders
            promises.push(fetch('/api/admin/settings', {
                method: 'POST',
                body: JSON.stringify({
                    key: 'hero_slider',
                    type: 'SLIDER',
                    jsonData: processedSliders,
                    isActive: true
                })
            }))

            // Save Announcement
            promises.push(fetch('/api/admin/settings', {
                method: 'POST',
                body: JSON.stringify({
                    key: 'announcement_bar',
                    type: 'ANNOUNCEMENT',
                    content_tr: announcement.text_tr,
                    content_en: announcement.text_en,
                    isActive: announcement.isActive
                })
            }))

            // Save General
            promises.push(fetch('/api/admin/settings', {
                method: 'POST',
                body: JSON.stringify({
                    key: 'site_general',
                    type: 'GENERAL',
                    title_en: general.siteName,
                    jsonData: { email: general.contactEmail }
                })
            }))

            await Promise.all(promises)
            router.refresh()
            alert(isTr ? 'Ayarlar kaydedildi' : 'Settings saved')
        } catch (error) {
            console.error(error)
            alert('Failed to save')
        } finally {
            setIsLoading(false)
        }
    }

    const addSlider = () => {
        setSliders([...sliders, {
            image: '',
            title_tr: '',
            title_en: '',
            subtitle_tr: '',
            subtitle_en: '',
            buttonText_tr: 'Alışverişe Başla',
            buttonText_en: 'Shop Now',
            link: '/products'
        }])
    }

    const updateSlider = (index: number, field: string, value: any) => {
        const newSliders = [...sliders]
        if (field === 'imageFile') {
            const imgData = value || { url: '' }
            newSliders[index] = {
                ...newSliders[index],
                image: imgData.url,
                file: imgData.file
            }
        } else {
            newSliders[index] = { ...newSliders[index], [field]: value }
        }
        setSliders(newSliders)
    }

    const removeSlider = (index: number) => {
        const newSliders = [...sliders]
        newSliders.splice(index, 1)
        setSliders(newSliders)
    }

    // Helper for ImageUploader adapter
    const getSliderImage = (index: number) => {
        const url = sliders[index].image
        return url ? [{ url }] : []
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{isTr ? 'Site Ayarları' : 'Site Settings'}</h1>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="btn btn-primary flex items-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isTr ? 'Değişiklikleri Kaydet' : 'Save Changes'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
                {['general', 'sliders', 'announcement'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === tab
                            ? 'border-secondary text-secondary'
                            : 'border-transparent text-text-muted hover:text-text'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-surface border border-border rounded-xl p-6">

                {/* GENERAL TAB */}
                {activeTab === 'general' && (
                    <div className="space-y-4 max-w-lg">
                        <div>
                            <label className="label">Site Name</label>
                            <input
                                className="input w-full"
                                value={general.siteName}
                                onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Contact Email</label>
                            <input
                                className="input w-full"
                                value={general.contactEmail}
                                onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {/* ANNOUNCEMENT TAB */}
                {activeTab === 'announcement' && (
                    <div className="space-y-6 max-w-lg">
                        <label className="flex items-center gap-3 p-3 bg-surface-light rounded-lg border border-border cursor-pointer">
                            <input
                                type="checkbox"
                                checked={announcement.isActive}
                                onChange={(e) => setAnnouncement({ ...announcement, isActive: e.target.checked })}
                                className="w-5 h-5 accent-secondary"
                            />
                            <div>
                                <p className="font-medium">{isTr ? 'Aktif' : 'Active'}</p>
                                <p className="text-xs text-text-muted">Show announcement bar at top</p>
                            </div>
                        </label>

                        <div>
                            <label className="label">Text (EN)</label>
                            <input
                                className="input w-full"
                                value={announcement.text_en}
                                onChange={(e) => setAnnouncement({ ...announcement, text_en: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Metin (TR)</label>
                            <input
                                className="input w-full"
                                value={announcement.text_tr}
                                onChange={(e) => setAnnouncement({ ...announcement, text_tr: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {/* SLIDERS TAB */}
                {activeTab === 'sliders' && (
                    <div className="space-y-8">
                        {sliders.map((slide, index) => (
                            <div key={index} className="bg-surface-light border border-border rounded-lg p-4 relative">
                                <button
                                    onClick={() => removeSlider(index)}
                                    className="absolute top-2 right-2 p-2 text-error hover:bg-error/10 rounded-lg"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Image */}
                                    <div>
                                        <label className="label mb-2 block">Slide Image</label>
                                        <ImageUploader
                                            images={getSliderImage(index)}
                                            onChange={(imgs) => updateSlider(index, 'imageFile', imgs[0])}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-text-muted">Title (EN)</label>
                                                <input
                                                    className="input w-full text-sm"
                                                    value={slide.title_en}
                                                    onChange={(e) => updateSlider(index, 'title_en', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-text-muted">Başlık (TR)</label>
                                                <input
                                                    className="input w-full text-sm"
                                                    value={slide.title_tr}
                                                    onChange={(e) => updateSlider(index, 'title_tr', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-text-muted">Subtitle (EN)</label>
                                                <input
                                                    className="input w-full text-sm"
                                                    value={slide.subtitle_en}
                                                    onChange={(e) => updateSlider(index, 'subtitle_en', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-text-muted">Alt Başlık (TR)</label>
                                                <input
                                                    className="input w-full text-sm"
                                                    value={slide.subtitle_tr}
                                                    onChange={(e) => updateSlider(index, 'subtitle_tr', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-text-muted">Link</label>
                                                <input
                                                    className="input w-full text-sm"
                                                    value={slide.link}
                                                    onChange={(e) => updateSlider(index, 'link', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={addSlider}
                            className="btn btn-secondary w-full py-4 border-dashed border-2 flex items-center justify-center gap-2"
                        >
                            <Plus size={20} /> {isTr ? 'Yeni Slayt Ekle' : 'Add New Slide'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
