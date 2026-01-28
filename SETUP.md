# E-Commerce Platform Setup Guide

## Quick Start (Turbo)

```bash
# 1. Install dependencies
npm install

# 2. Configure database in .env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# 3. Generate Prisma Client
npx prisma generate

# 4. Run migrations
npx prisma migrate dev --name init

# 5. Seed database
npx prisma db seed

# 6. Start dev server
npm run dev
```

Open [http://localhost:3000/tr](http://localhost:3000/tr)

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Required
DATABASE_URL="postgresql://..."
JWT_SECRET="change-me-in-production"
JWT_REFRESH_SECRET="change-me-in-production"

# Optional (for payment)
IYZICO_API_KEY="sandbox-key"
IYZICO_SECRET_KEY="sandbox-secret"
```

## Test Users

After seeding:

**Admin:**
- Email: admin@example.com
- Password: admin123456
- Access: /tr/admin

**User:**
- Email: user@example.com
- Password: user123456

## Database Commands

```bash
# Open Prisma Studio (GUI)
npx prisma studio

# Create new migration
npx prisma migrate dev --name <migration_name>

# Reset database (destructive!)
npx prisma migrate reset

# Re-seed data
npx prisma db seed
```

## API Testing

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123456"
  }'
```

### Get Products
```bash
curl "http://localhost:3000/api/products?locale=tr&page=1&limit=10"
```

### Filter Products
```bash
curl "http://localhost:3000/api/products?category=shoes&color=black&size=38&minPrice=100&maxPrice=1000&locale=tr"
```

## Multi-language

- Turkish: http://localhost:3000/tr
- English: http://localhost:3000/en

URLs automatically include locale prefix.

## Project Structure Overview

```
src/
├── app/
│   ├── [locale]/       # i18n pages (TR/EN)
│   └── api/            # Backend API routes
├── lib/
│   ├── prisma.ts       # DB client
│   └── auth.ts         # JWT utils
├── middleware.ts       # Auth + i18n
└── i18n.ts            # i18n config

prisma/
├── schema.prisma      # Database schema
└── seed.ts           # Test data

messages/
├── tr.json           # Turkish translations
└── en.json           # English translations
```

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL 14+ with Prisma 7
- **Auth:** JWT (HTTP-only cookies)
- **i18n:** next-intl
- **Validation:** Zod

## Development Tips

1. **Always run `npx prisma generate` after schema changes**
2. Use Prisma Studio for quick database inspection
3. Check `messages/tr.json` for adding UI translations
4. API routes are server-side only (no CORS needed for same-origin)
5. Middleware handles auth automatically for protected routes

## Next Steps

1. Build frontend pages (homepage, product listing, detail)
2. Create admin panel UI
3. Implement file upload for product images
4. Complete iyzico payment flow
5. Add email notifications

See `implementation_plan.md` for detailed roadmap.
