# 👜 Women Shoes & Bags E-Commerce Platform

A professional, full-stack e-commerce platform specialized in women's shoes and bags, built with modern web technologies and best practices.

## 👨‍💻 Author

**Demir Cücü**  
📧 demircucu35@gmail.com

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Configuration](#-environment-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Authentication & Authorization](#-authentication--authorization)
- [Multi-Language Support](#-multi-language-support)
- [Payment Integration](#-payment-integration)
- [Admin Panel](#-admin-panel)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Development Guide](#-development-guide)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🛍️ Customer Features
- **Multi-Language Support** (Turkish/English) - Seamless language switching with next-intl
- **Product Browsing** - Advanced filtering by category, price, color, size, and search
- **Product Variants** - Size and color combinations with real-time stock tracking
- **Shopping Cart** - Persistent cart with variant-based item management
- **Secure Checkout** - Complete checkout flow with address management
- **User Accounts** - Profile management, order history, saved addresses
- **Wishlists** - Save favorite products for later
- **Product Reviews** - Rate and review purchased products
- **Responsive Design** - Mobile-first, fully responsive UI
- **SEO Optimized** - Meta tags, structured data, and semantic HTML

### 🔧 Admin Features
- **Dashboard** - Sales analytics, order statistics, and key metrics
- **Product Management** - CRUD operations for products, variants, and images
- **Order Management** - Track and update order status, shipping information
- **Inventory Control** - Real-time stock management across all variants
- **Category Management** - Hierarchical category structure with multi-language support
- **User Management** - Customer accounts and role-based access control
- **CMS Features** - Site settings, sliders, announcements, and menu management
- **Sales Analytics** - Revenue tracking, sales trends, and performance metrics

### 🔐 Security Features
- **JWT Authentication** - Secure token-based authentication with HTTP-only cookies
- **Password Encryption** - Bcrypt hashing with salt rounds
- **Role-Based Access Control** - User and Admin roles with protected routes
- **CSRF Protection** - Built-in Next.js security features
- **SQL Injection Prevention** - Prisma ORM with parameterized queries

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Charts:** Recharts
- **Internationalization:** next-intl
- **TypeScript:** Full type safety

### Backend
- **Runtime:** Node.js 18+
- **API:** Next.js API Routes (Server-side)
- **Database:** PostgreSQL 14+
- **ORM:** Prisma 7
- **Authentication:** JWT (jsonwebtoken + jose)
- **Validation:** Zod
- **Password Hashing:** bcryptjs

### Payment Integration
- **Provider:** iyzico (Turkish payment gateway)
- **Features:** Credit card payments, 3D Secure support

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14 or higher ([Download](https://www.postgresql.org/download/))
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd women-shoes-bags-ecommerce
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js and React
- Prisma ORM and PostgreSQL adapter
- Authentication libraries (JWT, bcrypt)
- UI components and utilities

---

## ⚙️ Environment Configuration

### 1. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` and update the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"

# JWT Secrets (Replace with strong, random strings)
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-min-32-characters"

# Payment Gateway (Optional - for iyzico integration)
IYZICO_API_KEY="sandbox-your-api-key"
IYZICO_SECRET_KEY="sandbox-your-secret-key"
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**🔐 Security Note:** 
- Use strong, unique secrets for production
- Never commit `.env` file to version control
- Rotate secrets periodically

---

## 🗄️ Database Setup

### 1. Create PostgreSQL Database

```bash
# Using PostgreSQL CLI
createdb ecommerce_db

# Or using psql
psql -U postgres
CREATE DATABASE ecommerce_db;
\q
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This creates all necessary tables based on the Prisma schema.

### 4. Seed Database with Sample Data

```bash
npx prisma db seed
```

This populates your database with:
- Admin user account
- Test user account
- Sample product categories (Shoes, Bags, Accessories)
- Sample products with variants (sizes, colors)
- Site settings and CMS content

---

## 🎯 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

**Available URLs:**
- Turkish: [http://localhost:3000/tr](http://localhost:3000/tr)
- English: [http://localhost:3000/en](http://localhost:3000/en)
- Admin Panel: [http://localhost:3000/tr/admin](http://localhost:3000/tr/admin)

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Database GUI (Prisma Studio)

```bash
npm run studio
```

Opens Prisma Studio at [http://localhost:5555](http://localhost:5555) for visual database management.

---

## 👤 Test Accounts

After running the seed script, use these credentials:

### Admin Account
```
Email: admin@example.com
Password: admin123456
Access: Full admin panel access
```

### Test User Account
```
Email: user@example.com
Password: user123456
Access: Customer features only
```

---

## 📁 Project Structure

```
women-shoes-bags-ecommerce/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   ├── seed.ts                # Database seeding script
│   └── migrations/            # Database migration history
│
├── src/
│   ├── app/
│   │   ├── [locale]/          # Internationalized routes (TR/EN)
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── admin/         # Admin panel pages
│   │   │   ├── auth/          # Authentication pages (login/register)
│   │   │   ├── products/      # Product listing and details
│   │   │   ├── cart/          # Shopping cart
│   │   │   ├── checkout/      # Checkout flow
│   │   │   ├── account/       # User account management
│   │   │   └── layout.tsx     # Root layout with providers
│   │   │
│   │   ├── api/               # Backend API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── products/      # Product CRUD
│   │   │   ├── admin/         # Admin endpoints
│   │   │   ├── payment/       # Payment processing
│   │   │   └── upload/        # File upload handling
│   │   │
│   │   └── globals.css        # Global styles
│   │
│   ├── components/
│   │   ├── admin/             # Admin panel components
│   │   ├── auth/              # Authentication forms
│   │   ├── cart/              # Cart components
│   │   ├── checkout/          # Checkout components
│   │   ├── products/          # Product displays
│   │   ├── account/           # Account management
│   │   ├── home/              # Homepage components
│   │   ├── layout/            # Layout components (header, footer)
│   │   └── ui/                # Reusable UI components
│   │
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client instance
│   │   ├── auth.ts            # JWT utilities
│   │   └── utils.ts           # Helper functions
│   │
│   ├── actions/               # Server actions
│   │   ├── auth.ts            # Authentication actions
│   │   ├── cart.ts            # Cart operations
│   │   └── products.ts        # Product operations
│   │
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   │
│   ├── context/               # React contexts
│   │   └── CartContext.tsx    # Global cart state
│   │
│   ├── i18n/                  # i18n configuration
│   └── middleware.ts          # Auth & i18n middleware
│
├── messages/
│   ├── tr.json                # Turkish translations
│   └── en.json                # English translations
│
├── public/
│   └── uploads/               # Product images and media
│
├── .env                       # Environment variables (gitignored)
├── .env.example               # Environment template
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

---

## 🔌 API Documentation

### Authentication Endpoints

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+905551234567"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response: 200 OK
{
  "success": true,
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

#### Logout
```http
POST /api/auth/logout

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Product Endpoints

#### Get Products (with filtering)
```http
GET /api/products?category=shoes&color=black,white&size=38,39&minPrice=100&maxPrice=500&search=boot&page=1&limit=12&locale=tr

Response: 200 OK
{
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "totalPages": 4
  }
}
```

**Query Parameters:**
- `category` - Filter by category slug (e.g., "shoes", "bags")
- `color` - Comma-separated color values
- `size` - Comma-separated size values
- `minPrice` / `maxPrice` - Price range
- `search` - Search in product name and description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `locale` - Language (tr/en)

#### Get Single Product
```http
GET /api/products/[slug]?locale=tr

Response: 200 OK
{
  "product": {
    "id": "...",
    "slug": "leather-ankle-boots",
    "name_tr": "Deri Bot",
    "name_en": "Leather Boots",
    "price": "599.99",
    "images": [...],
    "variants": [...],
    "category": {...}
  }
}
```

---

### Admin Endpoints (requires ADMIN role)

#### Create Product
```http
POST /api/admin/products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name_tr": "Deri Çanta",
  "name_en": "Leather Bag",
  "description_tr": "...",
  "description_en": "...",
  "categoryId": "...",
  "price": 799.99,
  "variants": [...]
}
```

#### Update Product
```http
PUT /api/admin/products/[id]
Authorization: Bearer <admin-token>
```

#### Delete Product
```http
DELETE /api/admin/products/[id]
Authorization: Bearer <admin-token>
```

#### Get Orders
```http
GET /api/admin/orders?status=PENDING&page=1&limit=20
```

#### Update Order Status
```http
PATCH /api/admin/orders/[id]
{
  "status": "SHIPPED",
  "trackingNumber": "TR1234567890"
}
```

---

## 🗃️ Database Schema

### Core Models

#### User
Stores customer and admin accounts
- Authentication: email, password (bcrypt hashed)
- Profile: firstName, lastName, phone
- Roles: USER, ADMIN
- Relations: addresses, orders, cart, reviews, wishlist

#### Category
Hierarchical product categories with multi-language support
- Multi-language: name_tr, name_en, description_tr, description_en
- Hierarchy: parent-child relationships
- Display: image, displayOrder, isActive

#### Product
Main product information
- Multi-language: name, description, meta tags (TR/EN)
- Pricing: price, compareAtPrice (for discounts)
- SEO: metaTitle, metaDescription
- Features: isFeatured, isActive, displayOrder
- Relations: category, images, variants, reviews

#### ProductVariant
Individual SKUs with size/color combinations
- Attributes: size, color (TR/EN), colorHex
- Stock: SKU, stock quantity
- Pricing: optional priceAdjustment
- Unique constraint: productId + size + color

#### ProductImage
Product photos with multi-language alt text
- Storage: URL path
- Display: displayOrder
- Accessibility: alt_tr, alt_en

#### Cart & CartItem
Shopping cart management
- User-specific cart
- Variant-based items
- Quantity tracking

#### Order & OrderItem
Complete order processing
- Order tracking: orderNumber, status, timestamps
- Shipping: full address details, tracking number
- Payment: paymentId, paymentStatus, paymentMethod
- Totals: subtotal, shippingCost, tax, total
- Historical snapshot: product/variant data at purchase time

#### Review
Product reviews and ratings
- Rating: 1-5 stars
- Content: title, comment
- Verification: isVerifiedPurchase
- Moderation: isApproved (admin approval)

#### Wishlist
Save products for later

#### Address
Saved shipping/billing addresses
- Multiple addresses per user
- Default address flag

#### SiteSettings (CMS)
Dynamic site content management
- Types: SLIDER, ANNOUNCEMENT, MENU, FOOTER, SEO, GENERAL
- Multi-language: title, content (TR/EN)
- Flexible: JSON data for structured content

---

### Database Relationships Diagram

```
User (1) ──< (N) Address
User (1) ──< (N) Order
User (1) ──o (1) Cart
User (1) ──< (N) Review
User (1) ──< (N) Wishlist

Category (1) ──< (N) Product
Category (1) ──< (N) Category (self-ref, hierarchy)

Product (1) ──< (N) ProductImage
Product (1) ──< (N) ProductVariant
Product (1) ──< (N) Review
Product (1) ──< (N) CartItem
Product (1) ──< (N) OrderItem
Product (1) ──< (N) Wishlist

Cart (1) ──< (N) CartItem
Order (1) ──< (N) OrderItem

ProductVariant (1) ──< (N) CartItem
ProductVariant (1) ──< (N) OrderItem
```

---

## 🔐 Authentication & Authorization

### JWT Token System

**Access Token**
- Duration: 15 minutes
- Storage: HTTP-only cookie
- Usage: API authentication
- Claims: userId, email, role

**Refresh Token**
- Duration: 7 days
- Storage: HTTP-only cookie
- Usage: Access token renewal
- Claims: userId

### Password Security
- Hashing: bcrypt with 10 salt rounds
- Validation: Minimum 8 characters
- Storage: Never store plain passwords

### Protected Routes

**User Routes** (requires authentication):
- `/[locale]/account/*` - Profile management
- `/[locale]/checkout` - Checkout process
- `/api/cart/*` - Cart operations

**Admin Routes** (requires ADMIN role):
- `/[locale]/admin/*` - Admin panel
- `/api/admin/*` - Admin API endpoints

### Middleware Protection

The `middleware.ts` file automatically:
- Verifies JWT tokens
- Checks user roles
- Redirects unauthenticated users
- Handles locale routing

---

## 🌐 Multi-Language Support

### Supported Languages
- Turkish (tr)
- English (en)

### Implementation

**Static Content:**
- Location: `messages/tr.json`, `messages/en.json`
- Usage: UI labels, buttons, messages
- Library: next-intl

**Dynamic Content:**
- Database fields with `_tr` and `_en` suffixes
- Examples:
  - Product: `name_tr`, `name_en`, `description_tr`, `description_en`
  - Category: `name_tr`, `name_en`
  - SiteSettings: `title_tr`, `title_en`, `content_tr`, `content_en`

**URL Structure:**
- Turkish: `/tr/products`, `/tr/admin`
- English: `/en/products`, `/en/admin`
- Automatic redirect to user's preferred language

**Language Switching:**
- Seamless switching without losing context
- Preserves cart and session data
- Updates all dynamic content

---

## 💳 Payment Integration

### iyzico Payment Gateway

**Features:**
- Credit/debit card payments
- 3D Secure authentication
- Installment support (Turkish market)
- Secure payment processing

**Configuration:**

1. Sign up for iyzico account ([https://www.iyzico.com](https://www.iyzico.com))
2. Get API credentials (sandbox for testing)
3. Configure in `.env`:

```env
IYZICO_API_KEY="your-api-key"
IYZICO_SECRET_KEY="your-secret-key"
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"  # sandbox
# IYZICO_BASE_URL="https://api.iyzipay.com"  # production
```

**Payment Flow:**
1. Customer completes checkout form
2. Order created with PENDING status
3. Redirect to iyzico payment page
4. 3D Secure authentication
5. Payment callback updates order
6. Stock deduction on successful payment
7. Order confirmation email sent

---

## 🎛️ Admin Panel

### Dashboard
- Overview statistics (total revenue, orders, customers)
- Sales analytics charts
- Recent orders table
- Low stock alerts
- Quick actions

### Product Management
- List all products with filters
- Create/Edit/Delete products
- Manage product variants
- Upload multiple images
- Set featured products
- Stock level management
- Bulk operations

### Order Management
- View all orders
- Filter by status, date, customer
- Update order status
- Add tracking numbers
- Print invoices
- Order timeline
- Refund processing

### Category Management
- Hierarchical category tree
- Create/Edit/Delete categories
- Multi-language category names
- Set category images
- Reorder categories

### User Management
- View customer list
- Search and filter users
- View order history
- Manage user roles

### CMS (Site Settings)
- Hero sliders
- Announcement bars
- Navigation menus
- Footer content
- SEO settings
- General site configuration

---

## 🧪 Testing

### Manual Testing

**Test User Registration:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+905551234567"
  }'
```

**Test Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123456"
  }'
```

**Test Product API:**
```bash
# Get all products
curl "http://localhost:3000/api/products?locale=tr"

# Filter products
curl "http://localhost:3000/api/products?category=shoes&size=38&locale=tr"
```

### Database Testing
```bash
# Open Prisma Studio for visual inspection
npm run studio

# Reset database and re-seed
npx prisma migrate reset

# View database in PostgreSQL
psql -U postgres -d ecommerce_db
```

---

## 🚀 Deployment

### Prerequisites
- Node.js hosting (Vercel, Netlify, AWS, etc.)
- PostgreSQL database (Neon, Supabase, AWS RDS, etc.)
- Domain name (optional)

### Deployment Steps

**1. Build the Application**
```bash
npm run build
```

**2. Set Environment Variables**
Configure in your hosting platform:
- `DATABASE_URL` - Production PostgreSQL connection string
- `JWT_SECRET` - Strong secret key
- `JWT_REFRESH_SECRET` - Strong refresh key
- `IYZICO_API_KEY` - Production API key
- `IYZICO_SECRET_KEY` - Production secret
- `IYZICO_BASE_URL` - Production URL
- `NEXT_PUBLIC_APP_URL` - Your domain

**3. Run Database Migrations**
```bash
npx prisma migrate deploy
```

**4. Seed Production Database** (optional)
```bash
npx prisma db seed
```

### Recommended Platforms

**Vercel** (Easiest for Next.js):
1. Connect GitHub repository
2. Set environment variables
3. Auto-deploys on push

**Database Options:**
- **Neon** - Serverless PostgreSQL (recommended)
- **Supabase** - PostgreSQL with real-time features
- **AWS RDS** - Managed PostgreSQL
- **Railway** - Simple PostgreSQL hosting

### Production Checklist

- [ ] Update JWT secrets to strong, unique values
- [ ] Use production database credentials
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS if needed
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Enable rate limiting
- [ ] Set up backup strategy
- [ ] Configure CDN for images
- [ ] Test payment flow thoroughly
- [ ] Set up email service
- [ ] Configure analytics

---

## 💻 Development Guide

### Database Management

**Create New Migration:**
```bash
npx prisma migrate dev --name add_new_feature
```

**Reset Database:**
```bash
npx prisma migrate reset
```

**Update Prisma Client:**
```bash
npx prisma generate
```

**Open Database GUI:**
```bash
npm run studio
```

### Adding New Features

**1. Update Database Schema**
- Edit `prisma/schema.prisma`
- Run `npx prisma migrate dev --name feature_name`

**2. Create API Endpoint**
- Add route in `src/app/api/`
- Implement business logic
- Add error handling

**3. Create Components**
- Add React components in `src/components/`
- Use TypeScript for type safety
- Follow existing patterns

**4. Add Translations**
- Update `messages/tr.json`
- Update `messages/en.json`

### Code Style

- Use TypeScript for all files
- Follow Next.js App Router conventions
- Use Server Components by default
- Add "use client" only when necessary
- Implement proper error handling
- Add loading states
- Use Prisma for all database operations

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the Repository**
```bash
git clone https://github.com/yourusername/women-shoes-bags-ecommerce.git
```

2. **Create a Feature Branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make Your Changes**
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

4. **Commit Your Changes**
```bash
git commit -m "feat: add amazing feature"
```

5. **Push to Your Fork**
```bash
git push origin feature/amazing-feature
```

6. **Open a Pull Request**
- Describe your changes
- Reference any related issues

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 Support & Contact

For questions, issues, or support:

**Developer:** Demir Cücü  
**Email:** demircucu35@gmail.com

**Project Issues:** Open an issue on GitHub  
**Documentation:** See this README and inline code comments

---

## 🎯 Roadmap & Future Features

### Planned Enhancements

**Frontend:**
- [ ] Advanced product filtering UI
- [ ] Product comparison feature
- [ ] Customer reviews and ratings UI
- [ ] Social media integration
- [ ] Live chat support
- [ ] Mobile app (React Native)

**Backend:**
- [ ] Email notifications (order confirmations, shipping updates)
- [ ] SMS notifications
- [ ] Inventory alerts
- [ ] Automated backup system
- [ ] API rate limiting
- [ ] GraphQL API option

**Features:**
- [ ] Loyalty program
- [ ] Discount codes and coupons
- [ ] Gift cards
- [ ] Product recommendations
- [ ] Recently viewed products
- [ ] Size guide
- [ ] Virtual try-on (AR)

**Admin:**
- [ ] Sales reports export (PDF, Excel)
- [ ] Customer analytics
- [ ] Email marketing integration
- [ ] Bulk product import/export
- [ ] Advanced inventory forecasting

---

## ⚠️ Important Notes

### Security Warnings

**Before Production Deployment:**
- ✅ Replace default JWT secrets with strong, unique keys
- ✅ Use environment variables for all sensitive data
- ✅ Enable HTTPS/SSL certificates
- ✅ Implement rate limiting
- ✅ Set up CORS policies
- ✅ Enable security headers
- ✅ Regular security audits
- ✅ Keep dependencies updated

### Database Notes

**Prisma 7 Specifics:**
- Database URL now configured in `prisma.config.ts`
- Use `npx prisma migrate dev` for migrations
- Connection pooling configured automatically
- Edge-compatible with serverless databases

### Development Notes

This project is production-ready but continuously evolving. It includes:
- ✅ Complete database schema
- ✅ Authentication system
- ✅ Multi-language support
- ✅ Shopping cart & checkout
- ✅ Admin panel
- ✅ Payment integration foundation
- ✅ Responsive UI components

---

## 📊 Project Statistics

- **Database Models:** 12
- **API Endpoints:** 25+
- **React Components:** 50+
- **Supported Languages:** 2 (TR, EN)
- **Payment Methods:** Credit Card (iyzico)
- **User Roles:** 2 (User, Admin)

---

## 🙏 Acknowledgments

Built with modern technologies:
- Next.js Team for the amazing framework
- Prisma Team for the excellent ORM
- Vercel for hosting solutions
- iyzico for payment processing
- Open source community

---

**Made with ❤️ by Demir Cücü**

For professional e-commerce solutions and custom development:  
📧 demircucu35@gmail.com
