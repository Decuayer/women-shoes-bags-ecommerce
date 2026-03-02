import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

// Debug: Check if DATABASE_URL is loaded
const connectionString = process.env.DATABASE_URL
console.log('DATABASE_URL loaded:', connectionString ? 'Yes (length: ' + connectionString.length + ')' : 'No')

if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
}

// Create connection pool for Supabase/PostgreSQL with SSL
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
})
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Starting database seeding...')

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123456', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {
            password: adminPassword,
        },
        create: {
            email: 'admin@example.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
        },
    })
    console.log('✓ Admin user created:', admin.email)

    // Create test user
    const userPassword = await bcrypt.hash('user123456', 10)
    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {
            password: userPassword,
        },
        create: {
            email: 'user@example.com',
            password: userPassword,
            firstName: 'Test',
            lastName: 'User',
            phone: '+905551234567',
            role: 'USER',
        },
    })
    console.log('✓ Test user created:', user.email)

    // Create categories
    const shoesCategory = await prisma.category.upsert({
        where: { slug: 'shoes' },
        update: {},
        create: {
            slug: 'shoes',
            name_tr: 'Ayakkabılar',
            name_en: 'Shoes',
            description_tr: 'Kadın ayakkabı koleksiyonu',
            description_en: 'Women shoes collection',
            isActive: true,
            displayOrder: 1,
        },
    })

    const bagsCategory = await prisma.category.upsert({
        where: { slug: 'bags' },
        update: {},
        create: {
            slug: 'bags',
            name_tr: 'Çantalar',
            name_en: 'Bags',
            description_tr: 'Kadın çanta koleksiyonu',
            description_en: 'Women bags collection',
            isActive: true,
            displayOrder: 2,
        },
    })

    const bootsCategory = await prisma.category.upsert({
        where: { slug: 'boots' },
        update: {},
        create: {
            slug: 'boots',
            name_tr: 'Botlar',
            name_en: 'Boots',
            description_tr: 'Kadın bot koleksiyonu',
            description_en: 'Women boots collection',
            isActive: true,
            displayOrder: 3,
            parentId: shoesCategory.id,
        },
    })

    console.log('✓ Categories created')

    // Check if products exist before creating
    const existingProduct = await prisma.product.findUnique({ where: { slug: 'siyah-deri-bot' } })

    if (!existingProduct) {
        // Create sample products
        await prisma.product.create({
            data: {
                slug: 'siyah-deri-bot',
                name_tr: 'Siyah Deri Bot',
                name_en: 'Black Leather Boot',
                description_tr: 'Şık ve rahat siyah deri bot. Günlük kullanım için idealdir.',
                description_en: 'Stylish and comfortable black leather boot. Perfect for daily use.',
                categoryId: bootsCategory.id,
                price: 899.99,
                compareAtPrice: 1299.99,
                brand: 'Premium Shoes',
                material_tr: '%100 Hakiki Deri',
                material_en: '100% Genuine Leather',
                isFeatured: true,
                isActive: true,
                images: {
                    create: [
                        {
                            url: '/uploads/products/black-boot-1.jpg',
                            alt_tr: 'Siyah deri bot ön görünüm',
                            alt_en: 'Black leather boot front view',
                            displayOrder: 0,
                        },
                    ],
                },
                variants: {
                    create: [
                        { size: '36', color_tr: 'Siyah', color_en: 'Black', colorHex: '#000000', sku: 'BOOT-BLK-36', stock: 10 },
                        { size: '37', color_tr: 'Siyah', color_en: 'Black', colorHex: '#000000', sku: 'BOOT-BLK-37', stock: 15 },
                        { size: '38', color_tr: 'Siyah', color_en: 'Black', colorHex: '#000000', sku: 'BOOT-BLK-38', stock: 20 },
                        { size: '39', color_tr: 'Siyah', color_en: 'Black', colorHex: '#000000', sku: 'BOOT-BLK-39', stock: 12 },
                        { size: '40', color_tr: 'Siyah', color_en: 'Black', colorHex: '#000000', sku: 'BOOT-BLK-40', stock: 8 },
                    ],
                },
            },
        })

        await prisma.product.create({
            data: {
                slug: 'kahverengi-omuz-cantasi',
                name_tr: 'Kahverengi Omuz Çantası',
                name_en: 'Brown Shoulder Bag',
                description_tr: 'Şık kahverengi omuz çantası. Her kombine uyum sağlar.',
                description_en: 'Stylish brown shoulder bag. Matches every outfit.',
                categoryId: bagsCategory.id,
                price: 599.99,
                brand: 'Luxury Bags',
                material_tr: 'Suni Deri',
                material_en: 'Faux Leather',
                isFeatured: true,
                isActive: true,
                images: {
                    create: [
                        {
                            url: '/uploads/products/brown-bag-1.jpg',
                            alt_tr: 'Kahverengi omuz çantası',
                            alt_en: 'Brown shoulder bag',
                            displayOrder: 0,
                        },
                    ],
                },
                variants: {
                    create: [
                        { size: 'Standart', color_tr: 'Kahverengi', color_en: 'Brown', colorHex: '#8B4513', sku: 'BAG-BRN-ST', stock: 25 },
                        { size: 'Standart', color_tr: 'Siyah', color_en: 'Black', colorHex: '#000000', sku: 'BAG-BLK-ST', stock: 30 },
                    ],
                },
            },
        })

        console.log('✓ Sample products created')
    } else {
        console.log('✓ Products already exist, skipping creation')
    }

    // Create site settings (skip if already exist)
    const existingSettings = await prisma.siteSettings.findUnique({ where: { key: 'announcement_bar' } })

    if (!existingSettings) {
        await prisma.siteSettings.createMany({
            data: [
                {
                    key: 'announcement_bar',
                    type: 'ANNOUNCEMENT',
                    title_tr: 'Ücretsiz Kargo',
                    title_en: 'Free Shipping',
                    content_tr: '1750 TL ve üzeri alışverişlerde ücretsiz kargo!',
                    content_en: 'Free shipping on orders over 1750 TL!',
                    isActive: true,
                    displayOrder: 1,
                },
                {
                    key: 'hero_slider_1',
                    type: 'SLIDER',
                    title_tr: 'Yeni Sezon Koleksiyonu',
                    title_en: 'New Season Collection',
                    content_tr: 'En yeni ayakkabı ve çanta modellerini keşfedin',
                    content_en: 'Discover the latest shoes and bags',
                    jsonData: {
                        image: '/uploads/slider/hero-1.jpg',
                        link: '/products',
                        buttonText_tr: 'Alışverişe Başla',
                        buttonText_en: 'Start Shopping',
                    },
                    isActive: true,
                    displayOrder: 1,
                },
            ],
        })
        console.log('✓ Site settings created')
    } else {
        console.log('✓ Site settings already exist, skipping creation')
    }

    console.log('✅ Database seeding completed!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
