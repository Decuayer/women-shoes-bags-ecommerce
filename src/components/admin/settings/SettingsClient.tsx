'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/admin/products/ImageUploader'
import { Save, Loader2, Plus, Trash2, Phone, Share2, Star, Globe, Images, Megaphone } from 'lucide-react'
import IconPicker from './IconPicker'
import { useToast } from '@/context/ToastContext'

interface SettingsClientProps {
    settings: any[]
    locale: string
}

export default function SettingsClient({ settings, locale }: SettingsClientProps) {
    const router = useRouter()
    const isTr = locale === 'tr'
    const { addToast } = useToast()
    const [activeTab, setActiveTab] = useState('general')
    const [isLoading, setIsLoading] = useState(false)

    // Parse existing settings
    const sliderSettings = settings.find(s => s.key === 'hero_slider')
    const announcementSettings = settings.find(s => s.key === 'announcement_bar')
    const generalSettings = settings.find(s => s.key === 'site_general')
    const contactSettings = settings.find(s => s.key === 'contact_info')
    const socialSettings = settings.find(s => s.key === 'social_media')
    const featureSettings = settings.find(s => s.key === 'feature_highlights')

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
        siteName: generalSettings?.title_en || 'CRAZYSHOES',
        contactEmail: (generalSettings?.jsonData as any)?.email || 'info@crazyshoes.com',
        logoText1: (generalSettings?.jsonData as any)?.logoText1 || 'CRAZY',
        logoText2: (generalSettings?.jsonData as any)?.logoText2 || 'SHOES'
    })

    // State for Contact
    const [contact, setContact] = useState({
        phone: (contactSettings?.jsonData as any)?.phone || '+90 532 395 44 57',
        email: (contactSettings?.jsonData as any)?.email || 'crazyshoes4545@gmail.com',
        location: (contactSettings?.jsonData as any)?.location || 'Manisa, Türkiye'
    })

    // State for Social Media
    const [social, setSocial] = useState({
        facebook: (socialSettings?.jsonData as any)?.facebook || '#',
        instagram: (socialSettings?.jsonData as any)?.instagram || '#',
        twitter: (socialSettings?.jsonData as any)?.twitter || '#'
    })

    // State for Feature Highlights
    const [features, setFeatures] = useState<any[]>(
        (featureSettings?.jsonData as any[]) || []
    )

    // Initialize default features if empty
    useEffect(() => {
        if (featureSettings && !featureSettings.jsonData && features.length === 0) {
            setFeatures([
                {
                    id: '1',
                    icon: 'Truck',
                    title_tr: 'Ücretsiz Kargo',
                    title_en: 'Free Shipping',
                    desc_tr: '1500 TL üzeri siparişlerde',
                    desc_en: 'On orders over 1500 TL',
                    isActive: true
                },
                // ... add other defaults if needed, but usually empty is fine to start
            ])
        }
    }, [featureSettings, features.length])

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
                    jsonData: {
                        email: general.contactEmail,
                        logoText1: general.logoText1,
                        logoText2: general.logoText2
                    }
                })
            }))

            // Save Contact Info
            promises.push(fetch('/api/admin/settings', {
                method: 'POST',
                body: JSON.stringify({
                    key: 'contact_info',
                    type: 'GENERAL',
                    jsonData: contact,
                    isActive: true
                })
            }))

            // Save Social Media
            promises.push(fetch('/api/admin/settings', {
                method: 'POST',
                body: JSON.stringify({
                    key: 'social_media',
                    type: 'GENERAL',
                    jsonData: social,
                    isActive: true
                })
            }))

            // Save Feature Highlights
            promises.push(fetch('/api/admin/settings', {
                method: 'POST',
                body: JSON.stringify({
                    key: 'feature_highlights',
                    type: 'GENERAL', // Using generic type as it stores JSON array
                    jsonData: features,
                    isActive: true
                })
            }))

            await Promise.all(promises)
            router.refresh()
            addToast(
                isTr ? 'Ayarlar başarıyla kaydedildi' : 'Settings saved successfully',
                'success',
                { title: isTr ? 'Başarılı' : 'Success' }
            )
        } catch (error) {
            console.error(error)
            addToast(
                isTr ? 'Ayarlar kaydedilirken bir hata oluştu' : 'An error occurred while saving settings',
                'error',
                { title: isTr ? 'Hata' : 'Error' }
            )
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

    // Features Helpers
    const addFeature = () => {
        setFeatures([...features, {
            id: Date.now().toString(),
            icon: 'Star',
            title_tr: '',
            title_en: '',
            desc_tr: '',
            desc_en: '',
            isActive: true
        }])
    }

    const updateFeature = (index: number, field: string, value: any) => {
        const newFeatures = [...features]
        newFeatures[index] = { ...newFeatures[index], [field]: value }
        setFeatures(newFeatures)
    }

    const removeFeature = (index: number) => {
        const newFeatures = [...features]
        newFeatures.splice(index, 1)
        setFeatures(newFeatures)
    }

    const tabs = [
        { id: 'general', label: isTr ? 'Genel' : 'General', icon: Globe },
        { id: 'contact', label: isTr ? 'İletişim' : 'Contact', icon: Phone },
        { id: 'social', label: isTr ? 'Sosyal Medya' : 'Social Media', icon: Share2 },
        { id: 'features', label: isTr ? 'Öne Çıkanlar' : 'Features', icon: Star },
        { id: 'sliders', label: isTr ? 'Slaytlar' : 'Sliders', icon: Images },
        { id: 'announcement', label: isTr ? 'Duyuru' : 'Announcement', icon: Megaphone },
    ]

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
            <div className="flex border-b border-border overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                            ? 'border-secondary text-secondary'
                            : 'border-transparent text-text-muted hover:text-text'
                            }`}
                    >
                        {tab.icon && <tab.icon size={16} />}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-surface border border-border rounded-xl p-6">

                {activeTab === 'general' && (
                    <div className="space-y-4 max-w-lg">
                        <div>
                            <label className="label">{isTr ? 'Site Adı' : 'Site Name'}</label>
                            <input
                                className="input w-full"
                                value={general.siteName}
                                onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">{isTr ? 'İletişim E-postası' : 'Contact Email'}</label>
                            <input
                                className="input w-full"
                                value={general.contactEmail}
                                onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">{isTr ? 'Logo Metni 1' : 'Logo Text 1'}</label>
                                <input
                                    className="input w-full"
                                    value={general.logoText1}
                                    onChange={(e) => setGeneral({ ...general, logoText1: e.target.value })}
                                />
                                <p className="text-xs text-text-muted mt-1">{isTr ? 'İlk kısım (Gradient)' : 'First part (Gradient)'}</p>
                            </div>
                            <div>
                                <label className="label">{isTr ? 'Logo Metni 2' : 'Logo Text 2'}</label>
                                <input
                                    className="input w-full"
                                    value={general.logoText2}
                                    onChange={(e) => setGeneral({ ...general, logoText2: e.target.value })}
                                />
                                <p className="text-xs text-text-muted mt-1">{isTr ? 'İkinci kısım (Açık)' : 'Second part (Light)'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTACT TAB */}
                {activeTab === 'contact' && (
                    <div className="space-y-4 max-w-lg">
                        <div>
                            <label className="label">{isTr ? 'Telefon Numarası' : 'Phone Number'}</label>
                            <input
                                className="input w-full"
                                value={contact.phone}
                                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                                placeholder="+90 5XX XXX XX XX"
                            />
                        </div>
                        <div>
                            <label className="label">{isTr ? 'E-posta Adresi' : 'Email Address'}</label>
                            <input
                                className="input w-full"
                                value={contact.email}
                                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                placeholder="info@example.com"
                            />
                        </div>
                        <div>
                            <label className="label">{isTr ? 'Konum / Adres' : 'Location / Address'}</label>
                            <textarea
                                className="input w-full min-h-[100px]"
                                value={contact.location}
                                onChange={(e) => setContact({ ...contact, location: e.target.value })}
                                placeholder={isTr ? 'Tam Adres' : 'Full Address'}
                            />
                        </div>
                    </div>
                )}

                {/* SOCIAL MEDIA TAB */}
                {activeTab === 'social' && (
                    <div className="space-y-4 max-w-lg">
                        <div>
                            <label className="label">Facebook URL</label>
                            <input
                                className="input w-full"
                                value={social.facebook}
                                onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div>
                            <label className="label">Instagram URL</label>
                            <input
                                className="input w-full"
                                value={social.instagram}
                                onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div>
                            <label className="label">Twitter / X URL</label>
                            <input
                                className="input w-full"
                                value={social.twitter}
                                onChange={(e) => setSocial({ ...social, twitter: e.target.value })}
                                placeholder="https://twitter.com/..."
                            />
                        </div>
                    </div>
                )}

                {/* FEATURES TAB */}
                {activeTab === 'features' && (
                    <div className="space-y-6">
                        <div className="grid gap-6">
                            {features.map((feature, index) => (
                                <div key={feature.id || index} className="bg-surface-light border border-border rounded-lg p-4 relative">
                                    <button
                                        onClick={() => removeFeature(index)}
                                        className="absolute top-2 right-2 p-2 text-error hover:bg-error/10 rounded-lg"
                                        title={isTr ? 'Özelliği Kaldır' : 'Remove Feature'}
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    <div className="grid md:grid-cols-[200px_1fr] gap-6">
                                        {/* Icon Selection */}
                                        <div>
                                            <label className="label mb-2 block">{isTr ? 'İkon' : 'Icon'}</label>
                                            <IconPicker
                                                value={feature.icon}
                                                onChange={(val) => updateFeature(index, 'icon', val)}
                                            />
                                            <label className="flex items-center gap-2 mt-4 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={feature.isActive !== false}
                                                    onChange={(e) => updateFeature(index, 'isActive', e.target.checked)}
                                                    className="w-4 h-4 accent-secondary"
                                                />
                                                <span className="text-sm">{isTr ? 'Aktif' : 'Active'}</span>
                                            </label>
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs text-text-muted">{isTr ? 'Başlık (TR)' : 'Title (TR)'}</label>
                                                    <input
                                                        className="input w-full text-sm"
                                                        value={feature.title_tr}
                                                        onChange={(e) => updateFeature(index, 'title_tr', e.target.value)}
                                                        placeholder="Örn: Ücretsiz Kargo"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-text-muted">{isTr ? 'Başlık (EN)' : 'Title (EN)'}</label>
                                                    <input
                                                        className="input w-full text-sm"
                                                        value={feature.title_en}
                                                        onChange={(e) => updateFeature(index, 'title_en', e.target.value)}
                                                        placeholder="Ex: Free Shipping"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs text-text-muted">{isTr ? 'Açıklama (TR)' : 'Description (TR)'}</label>
                                                    <input
                                                        className="input w-full text-sm"
                                                        value={feature.desc_tr}
                                                        onChange={(e) => updateFeature(index, 'desc_tr', e.target.value)}
                                                        placeholder="Örn: 1500TL üzeri"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-text-muted">{isTr ? 'Açıklama (EN)' : 'Description (EN)'}</label>
                                                    <input
                                                        className="input w-full text-sm"
                                                        value={feature.desc_en}
                                                        onChange={(e) => updateFeature(index, 'desc_en', e.target.value)}
                                                        placeholder="Ex: Orders over 1500TL"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addFeature}
                            className="btn btn-secondary w-full py-4 border-dashed border-2 flex items-center justify-center gap-2"
                        >
                            <Plus size={20} /> {isTr ? 'Yeni Özellik Ekle' : 'Add New Feature'}
                        </button>
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
                                <p className="text-xs text-text-muted">{isTr ? 'Duyuru barını üstte göster' : 'Show announcement bar at top'}</p>
                            </div>
                        </label>

                        <div>
                            <label className="label">{isTr ? 'Metin (EN)' : 'Text (EN)'}</label>
                            <input
                                className="input w-full"
                                value={announcement.text_en}
                                onChange={(e) => setAnnouncement({ ...announcement, text_en: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">{isTr ? 'Metin (TR)' : 'Text (TR)'}</label>
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
                                        <label className="label mb-2 block">{isTr ? 'Slayt Görseli' : 'Slide Image'}</label>
                                        <ImageUploader
                                            images={getSliderImage(index)}
                                            onChange={(imgs) => updateSlider(index, 'imageFile', imgs[0])}
                                            maxFiles={1}
                                            aspectRatio="aspect-video"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-text-muted">{isTr ? 'Başlık (EN)' : 'Title (EN)'}</label>
                                                <input
                                                    className="input w-full text-sm"
                                                    value={slide.title_en}
                                                    onChange={(e) => updateSlider(index, 'title_en', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-text-muted">{isTr ? 'Başlık (TR)' : 'Title (TR)'}</label>
                                                <input
                                                    className="input w-full text-sm"
                                                    value={slide.title_tr}
                                                    onChange={(e) => updateSlider(index, 'title_tr', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-text-muted">{isTr ? 'Alt Başlık (EN)' : 'Subtitle (EN)'}</label>
                                                <input
                                                    className="input w-full text-sm"
                                                    value={slide.subtitle_en}
                                                    onChange={(e) => updateSlider(index, 'subtitle_en', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-text-muted">{isTr ? 'Alt Başlık (TR)' : 'Subtitle (TR)'}</label>
                                                <input
                                                    className="input w-full text-sm"
                                                    value={slide.subtitle_tr}
                                                    onChange={(e) => updateSlider(index, 'subtitle_tr', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-text-muted">{isTr ? 'Buton Yazısı (EN)' : 'Button Text (EN)'}</label>
                                                <input
                                                    className="input w-full text-sm"
                                                    value={slide.buttonText_en || 'Shop Now'}
                                                    onChange={(e) => updateSlider(index, 'buttonText_en', e.target.value)}
                                                    placeholder="Shop Now"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-text-muted">{isTr ? 'Buton Yazısı (TR)' : 'Button Text (TR)'}</label>
                                                <input
                                                    className="input w-full text-sm"
                                                    value={slide.buttonText_tr || 'Alışverişe Başla'}
                                                    onChange={(e) => updateSlider(index, 'buttonText_tr', e.target.value)}
                                                    placeholder="Alışverişe Başla"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-text-muted">{isTr ? 'Link' : 'Link'}</label>
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
