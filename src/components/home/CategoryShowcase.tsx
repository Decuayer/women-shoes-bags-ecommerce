import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface CategoryShowcaseProps {
    locale: string
}

export default function CategoryShowcase({ locale }: CategoryShowcaseProps) {
    const isTr = locale === 'tr'

    const categories = [
        {
            id: 'shoes',
            name: isTr ? 'Ayakkabılar' : 'Shoes',
            description: isTr
                ? 'Şık ve rahat ayakkabı modelleri'
                : 'Stylish and comfortable shoe models',
            image: '/images/categories/shoes.jpg',
            color: 'from-amber-900/80 to-amber-950/80'
        },
        {
            id: 'bags',
            name: isTr ? 'Çantalar' : 'Bags',
            description: isTr
                ? 'Premium kalite çantalar'
                : 'Premium quality bags',
            image: '/images/categories/bags.jpg',
            color: 'from-rose-900/80 to-rose-950/80'
        },
        {
            id: 'boots',
            name: isTr ? 'Botlar' : 'Boots',
            description: isTr
                ? 'Kış sezonu bot koleksiyonu'
                : 'Winter season boot collection',
            image: '/images/categories/boots.jpg',
            color: 'from-slate-800/80 to-slate-900/80'
        }
    ]

    return (
        <section className="section bg-background-light">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {isTr ? 'Kategorilere Göz At' : 'Browse Categories'}
                    </h2>
                    <p className="text-text-muted max-w-2xl mx-auto">
                        {isTr
                            ? 'Tarzınıza uygun ürünleri kolayca bulun'
                            : 'Easily find products that match your style'
                        }
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/${locale}/products?category=${category.id}`}
                            className="group relative h-80 md:h-96 rounded-2xl overflow-hidden"
                        >
                            {/* Background */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${category.color} transition-all duration-500 group-hover:scale-105`}
                                style={{
                                    backgroundImage: `url(${category.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-t ${category.color}`} />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-secondary transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-text-muted mb-4">{category.description}</p>
                                <div className="flex items-center gap-2 text-secondary font-medium">
                                    <span>{isTr ? 'Keşfet' : 'Explore'}</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>

                            {/* Hover Border */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-secondary rounded-2xl transition-colors" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
