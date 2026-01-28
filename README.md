# Women Shoes & Bags E-Commerce Platform

Profesyonel kadın ayakkabı ve çanta e-ticaret sitesi. Next.js App Router, PostgreSQL, Prisma ORM ve iyzico ödeme entegrasyonu ile geliştirilmiştir.

## 🚀 Özellikler

- ✅ **Çoklu Dil Desteği** (Türkçe/İngilizce) - next-intl
- ✅ **JWT Tabanlı Kimlik Doğrulama** - HTTP-only cookies
- ✅ **Varyant Bazlı Stok Yönetimi** - Beden ve renk kombinasyonları
- ✅ **Server-Side Filtreleme** - Kategori, fiyat, renk, beden, arama
- ✅ **Admin Paneli & CMS** - Ürün, sipariş ve site ayarları yönetimi (altyapı hazır)
- ✅ **iyzico Ödeme Entegrasyonu** (Hazır altyapı)
- ✅ **Responsive Design** - Mobil uyumlu arayüz

## 📋 Gereksinimler

- Node.js 18+ 
- PostgreSQL 14+
- npm

## 🛠️ Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Ortam Değişkenlerini Yapılandırın

`.env` dosyasını düzenleyin ve PostgreSQL bağlantı bilgilerinizi girin:

```env
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/veritabani_adi"
JWT_SECRET="güvenli-bir-anahtar-buraya"
JWT_REFRESH_SECRET="güvenli-bir-yenileme-anahtarı-buraya"
```

### 3. Veritabanını Oluşturun ve Migrate Edin

```bash
# Prisma Client oluştur
npx prisma generate

# Veritabanı migration'larını oluştur ve uygula
npx prisma migrate dev --name init

# Seed verilerini ekle (örnek ürünler, admin kullanıcı)
npx prisma db seed
```

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000/tr](http://localhost:3000/tr) adresini açın.

## 👤 Test Kullanıcıları

Seed işleminden sonra aşağıdaki kullanıcılar oluşturulur:

**Admin Kullanıcı:**
- Email: `admin@example.com`
- Şifre: `admin123456`
- Panel: `/tr/admin` (UI geliştirme aşamasında)

**Test Kullanıcı:**
- Email: `user@example.com`
- Şifre: `user123456`

## 📁 Proje Yapısı

```
women-shoes-bags-ecommerce/
├── prisma/
│   ├── schema.prisma          # Veritabanı şeması
│   ├── seed.ts                # Seed verileri
│   └── migrations/            # Migration dosyaları
├── src/
│   ├── app/
│   │   ├── [locale]/          # i18n routing (TR/EN)
│   │   │   ├── page.tsx       # Ana sayfa
│   │   │   ├── admin/         # Admin paneli (yapım aşamasında)
│   │   │   └── layout.tsx     # Root layout
│   │   └── api/               # API endpoints
│   │       ├── auth/          # Login, register, logout
│   │       └── products/      # Ürün API (filtreleme, CRUD)
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   └── auth.ts            # JWT utilities
│   ├── i18n.ts                # i18n yapılandırması
│   └── middleware.ts          # Auth & i18n middleware
├── messages/
│   ├── tr.json                # Türkçe çeviriler
│   └── en.json                # İngilizce çeviriler
└── public/
    └── uploads/               # Ürün resimleri (eklenecek)
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Yeni kullanıcı kaydı
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "phone": "+905551234567"
  }
  ```

- `POST /api/auth/login` - Giriş yap
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/logout` - Çıkış yap

### Products

- `GET /api/products` - Ürün listesi (filtreleme destekli)
  ```
  Query params:
  ?category=shoes
  &color=black,white
  &size=38,39
  &minPrice=100
  &maxPrice=500
  &search=bot
  &page=1
  &limit=12
  &locale=tr
  ```

- `POST /api/products` - Yeni ürün ekle (Admin)

## 🗃️ Veritabanı Şeması

### Ana Tablolar

- **User** - Kullanıcılar (müşteri ve admin)
- **Category** - Kategoriler (hiyerarşik, çoklu dil)
- **Product** - Ürünler (çoklu dil)
- **ProductImage** - Ürün resimleri (1-N ilişki)
- **ProductVariant** - Varyantlar (beden, renk, stok)
- **Cart & CartItem** - Sepet
- **Order & OrderItem** - Siparişler
- **Address** - Teslimat adresleri
- **Review** - Ürün yorumları
- **SiteSettings** - CMS ayarları (slider, menü, duyurular)

### Stok Yönetimi

Her ürün varyantı için ayrı stok takibi:
```typescript
ProductVariant {
  size: "38"
  color_tr: "Siyah"
  color_en: "Black"
  stock: 5
  sku: "BOOT-BLK-38"
}
```

## 🌐 Çoklu Dil Desteği

- **Statik İçerik:** `messages/tr.json` ve `messages/en.json`
- **Dinamik İçerik:** Veritabanında `_tr` ve `_en` sütunları
  - Product: `name_tr`, `name_en`, `description_tr`, `description_en`
  - Category: `name_tr`, `name_en`
  - SiteSettings: `title_tr`, `title_en`, `content_tr`, `content_en`
- **URL Yapısı:** `/tr/products`, `/en/products`
- **Otomatik Yönlendirme:** Middleware ile dil seçimi

## 🔐 Kimlik Doğrulama

- **JWT Access Token:** 15 dakika (HTTP-only cookie)
- **JWT Refresh Token:** 7 gün (HTTP-only cookie)
- **Middleware:** Protected routes için otomatik kontrol
- **Admin Kontrolü:** `/admin` rotaları sadece ADMIN rolü için
- **Bcrypt:** Şifre hashleme (10 rounds)

## 💳 Ödeme Entegrasyonu (Hazır Altyapı)

iyzico entegrasyonu için `.env` dosyasında yapılandırma yapılmalı:

```env
IYZICO_API_KEY="your-api-key"
IYZICO_SECRET_KEY="your-secret-key"
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"
```

## 📊 Veritabanı Yönetimi

```bash
# Prisma Studio'yu aç (GUI veritabanı yönetimi)
npx prisma studio

# Yeni migration oluştur
npx prisma migrate dev --name migration_adi

# Veritabanını resetle
npx prisma migrate reset

# Seed verilerini yeniden yükle
npx prisma db seed

# Prisma Client'ı yeniden oluştur
npx prisma generate
```

## 🚧 Tamamlanan & Geliştirilecek Özellikler

### ✅ Tamamlanan Altyapı

- [x] Veritabanı şeması (Prisma 7)
- [x] JWT authentication sistemi
- [x] Çoklu dil altyapısı (next-intl)
- [x] API endpoints (auth, products)
- [x] Server-side filtreleme
- [x] Middleware (auth, i18n)
- [x] Seed verileri
- [x] TypeScript yapılandırması

### 🔨 Geliştirilecekler

- [ ] **Frontend UI:**
  - [ ] Homepage (hero slider, featured products)
  - [ ] Product listing sayfası
  - [ ] Product detail sayfası
  - [ ] Sepet sayfası
  - [ ] Checkout flow
  - [ ] User profil ve sipariş geçmişi

- [ ] **Admin Panel UI:**
  - [ ] Dashboard
  - [ ] Ürün CRUD arayüzü
  - [ ] Sipariş yönetimi
  - [ ] Stok güncelleme
  - [ ] CMS (site ayarları)
  - [ ] Çoklu resim yükleme

- [ ] **Ödeme:**
  - [ ] iyzico checkout form entegrasyonu
  - [ ] 3D Secure akışı
  - [ ] Stok düşümü implementasyonu
  - [ ] Sipariş onay emaili

- [ ] **Diğer:**
  - [ ] File upload sistemi
  - [ ] Email notifications
  - [ ] Product review UI
  - [ ] SEO optimizasyonları

## 📝 Geliştirme Notları

Bu proje şu anda **temel altyapı (boilerplate)** aşamasındadır. 

**Tamamlanan bileşenler:**
- ✅ Veritabanı şeması ve ilişkiler
- ✅ Kimlik doğrulama sistemi (register, login, logout)
- ✅ Çoklu dil altyapısı (TR/EN)
- ✅ API endpoint'leri (auth, products with filtering)
- ✅ Middleware (auth protection, i18n routing)
- ✅ Seed verileri (admin user, categories, sample products)

**Sonraki adımlar:**
1. Frontend sayfalarını oluşturun (UI/UX)
2. Admin panel ara yüzünü geliştirin
3. File upload sistemini ekleyin
4. iyzico ödeme akışını tamamlayın

Detaylı implementasyon planı için proje içindeki `implementation_plan.md` dosyasına bakabilirsiniz.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altındadır.

## 🆘 Destek

Sorularınız için issue açabilir veya projeyi geliştiren ekiple iletişime geçebilirsiniz.

---

**Önemli Notlar:**

⚠️ Bu proje boilerplate/template olarak hazırlanmıştır.

⚠️ Production ortamında kullanmadan önce:
- JWT secrets'ı güçlü anahtarlarla değiştirin
- Database credentials'ı güvenli tutun
- CORS ayarlarını yapılandırın
- Rate limiting ekleyin
- Production-ready error handling uygulayın

⚠️ Prisma 7 kullanmaktadır:
- `DATABASE_URL` artık `prisma.config.ts` içinde tanımlıdır
- Migration'lar için `npx prisma migrate dev` kullanılmalıdır
