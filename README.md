# 👜 Women's Shoes & Bags E-Commerce Platform

A professional, full-stack e-commerce platform specialized in women's shoes and bags, built with modern web technologies.

## 👨‍💻 Author

**Demir Cücü**  
📧 demircucu35@gmail.com

---

## ✨ Features

### 🛍️ Customer Features
- **Multi-Language Support** (Turkish/English)
- **Advanced Product Filtering** (Category, price, color, size)
- **Stock Tracking** (With size and color variants)
- **Shopping Cart & Secure Checkout**
- **User Accounts** (Order history, saved addresses, favorites)
- **Product Reviews**
- **Mobile-First Responsive Design**

### 🔧 Admin Panel
- **Dashboard** - Sales analytics and order statistics
- **Product Management** - Manage products, variants, and stock
- **Order Management** - Track orders and shipping status
- **Category Management**
- **User Management**
- **CMS Content Management** - Hero sliders and site settings

---

## 📋 Prerequisites

- **Node.js** 18.0 or higher
- **PostgreSQL** 14 or higher

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

### 3. Configure Environment Variables

Copy the example file and configure `.env`:

```bash
cp .env.example .env
```

### 4. Setup Database

```bash
# Create database tables
npx prisma migrate dev --name init

# Seed the database (Creates Admin account, categories, sample products)
npx prisma db seed
```

### 5. Start Application

```bash
npm run dev
```

 The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 👤 Test Accounts

Use the following credentials after running the seed script:

### Admin Account
- **Email:** admin@example.com
- **Password:** admin123456

### Test User Account
- **Email:** user@example.com
- **Password:** user123456
