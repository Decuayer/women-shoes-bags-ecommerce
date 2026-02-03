import Link from 'next/link'

export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f0f1a',
            color: '#ffffff',
            fontFamily: 'Inter, system-ui, sans-serif',
            margin: 0,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                textAlign: 'center',
                maxWidth: '48rem',
                margin: '0 auto',
                padding: '1rem'
            }}>
                {/* 404 Large Number */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: 'clamp(120px, 20vw, 200px)',
                        fontWeight: 'bold',
                        lineHeight: '1',
                        background: 'linear-gradient(135deg, #c9a959 0%, #d4b96a 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        opacity: '0.2',
                        margin: '0'
                    }}>
                        404
                    </h1>
                </div>

                {/* Error Icon */}
                <div style={{
                    position: 'relative',
                    marginTop: '-8rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{ display: 'inline-block' }}>
                        <div style={{
                            width: '128px',
                            height: '128px',
                            background: 'linear-gradient(to bottom right, #c9a959, #d4b96a)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                        }}>
                            <svg
                                style={{ width: '64px', height: '64px', color: '#1a1a2e', position: 'relative', zIndex: '10' }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <h2 style={{
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    color: '#ffffff'
                }}>
                    Sayfa Bulunamadı
                </h2>

                <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                    color: '#a0a0b0',
                    marginBottom: '3rem',
                    lineHeight: '1.75',
                    maxWidth: '36rem',
                    margin: '0 auto 3rem'
                }}>
                    Aradığınız sayfa bulunamadı veya taşınmış olabilir.
                </p>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '4rem'
                }}>
                    <Link
                        href="/tr"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '1rem 2rem',
                            background: '#c9a959',
                            color: '#1a1a2e',
                            fontWeight: '600',
                            borderRadius: '0.5rem',
                            textDecoration: 'none',
                            transition: 'all 0.3s'
                        }}
                    >
                        <svg
                            style={{ width: '20px', height: '20px' }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        Ana Sayfaya Dön
                    </Link>
                    <Link
                        href="/tr/products"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '1rem 2rem',
                            background: '#1e1e2f',
                            color: '#ffffff',
                            fontWeight: '600',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            textDecoration: 'none',
                            transition: 'all 0.3s'
                        }}
                    >
                        <svg
                            style={{ width: '20px', height: '20px' }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                        Ürünleri Keşfet
                    </Link>
                </div>

                {/* Category Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem',
                    maxWidth: '56rem',
                    margin: '0 auto'
                }}>
                    {[
                        { icon: '👠', label: 'Ayakkabılar', href: '/tr/products?category=shoes' },
                        { icon: '👜', label: 'Çantalar', href: '/tr/products?category=bags' },
                        { icon: '✨', label: 'Yeni Ürünler', href: '/tr/products?filter=new' },
                        { icon: '🔥', label: 'İndirimler', href: '/tr/products?filter=sale' },
                    ].map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            style={{
                                background: '#1e1e2f',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                padding: '1.5rem',
                                borderRadius: '1rem',
                                textDecoration: 'none',
                                transition: 'all 0.3s',
                                display: 'block'
                            }}
                        >
                            <div style={{
                                fontSize: '2.5rem',
                                marginBottom: '0.5rem'
                            }}>
                                {item.icon}
                            </div>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#a0a0b0',
                                margin: 0
                            }}>
                                {item.label}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
