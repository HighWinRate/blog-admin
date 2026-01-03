# Blog Admin - PayloadCMS

پنل مدیریت محتوای بلاگ با PayloadCMS 3.0

## نمای کلی

این پروژه یک پنل مدیریت محتوای بلاگ (Headless CMS) است که با PayloadCMS ساخته شده و برای نمایش محتوا در [Landing Page](../landing) استفاده می‌شود.

### ویژگی‌های کلیدی

- ✅ **PayloadCMS 3.0** (Beta) - آخرین نسخه
- ✅ **Next.js 15** - Modern React Framework
- ✅ **PostgreSQL** - اتصال مستقیم به Supabase (schema: blog)
- ✅ **Supabase Storage** - ذخیره‌سازی تصاویر و رسانه‌ها
- ✅ **Lexical Editor** - Rich Text Editor قدرتمند
- ✅ **TypeScript** - Type-safe با تولید خودکار types
- ✅ **REST + GraphQL API** - دسترسی خودکار به داده‌ها
- ✅ **SEO-Friendly** - پشتیبانی کامل از متاتگ‌ها و Open Graph

## Collections

### 1. Posts (پست‌ها)
- عنوان، slug، خلاصه، محتوا (Lexical)
- تصویر شاخص، نویسنده
- دسته‌بندی‌ها، برچسب‌ها
- تنظیمات SEO کامل
- وضعیت: پیش‌نویس / منتشر شده
- شمارنده بازدید

### 2. Categories (دسته‌بندی‌ها)
- نام، slug، توضیحات
- تصویر دسته‌بندی
- تنظیمات SEO

### 3. Media (رسانه‌ها)
- آپلود خودکار به Supabase Storage
- مدیریت تصاویر
- Alt text برای accessibility

### 4. Users (کاربران)
- احراز هویت داخلی PayloadCMS
- نویسندگان بلاگ

## معماری

```
┌────────────────┐
│  blog-admin    │  پورت: 3005
│  (PayloadCMS)  │  Next.js 15 + PayloadCMS
└───────┬────────┘
        │
        ├──────────────┐
        │              │
        ▼              ▼
┌───────────────┐  ┌─────────────┐
│   Supabase    │  │  Supabase   │
│   PostgreSQL  │  │   Storage   │
│ Schema: blog  │  │ Bucket:media│
└───────────────┘  └─────────────┘
        │
        │ read
        ▼
┌────────────────┐
│    landing     │  پورت: 3003
│   (Next.js)    │  نمایش عمومی
└────────────────┘
```

## نصب و راه‌اندازی

### پیش‌نیازها

- Node.js 18+ یا 20+
- npm یا yarn
- حساب Supabase
- PostgreSQL database (Supabase)

### مراحل نصب

1. **نصب dependencies**

```bash
cd blog-admin
npm install
```

2. **تنظیم Environment Variables**

فایل `.env` ایجاد کنید:

```bash
# Payload Secret (با openssl rand -base64 32 بسازید)
PAYLOAD_SECRET=your-secret-key-here

# Database Connection
DATABASE_URI=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?schema=blog

# Server URL
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3005

# Supabase Storage
SUPABASE_URL=https://[PROJECT].supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_STORAGE_BUCKET=media
```

**نکته مهم**: حتماً `?schema=blog` در connection string قرار دهید.

3. **ساخت Schema در Supabase**

```sql
-- در Supabase SQL Editor
CREATE SCHEMA IF NOT EXISTS blog;
```

4. **ساخت Storage Bucket**

در Supabase Dashboard:
- Storage → New Bucket
- نام: `media`
- Public bucket: ✅ فعال
- ذخیره

یا با SQL:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true);
```

5. **اجرای Development Server**

```bash
npm run dev
```

سرور روی `http://localhost:3005` اجرا می‌شود.

### اولین اجرا

در اولین اجرا، PayloadCMS:
1. خودکار جداول را در schema `blog` ایجاد می‌کند
2. از شما می‌خواهد یک کاربر Admin ایجاد کنید
3. به `/admin` بروید و فرم ثبت‌نام را پر کنید

## استفاده

### پنل مدیریت

به آدرس زیر بروید:

```
http://localhost:3005/admin
```

### API Endpoints

PayloadCMS به صورت خودکار API ایجاد می‌کند:

#### REST API

```bash
# Base URL
http://localhost:3005/api

# لیست پست‌های منتشر شده
GET /api/posts?where[status][equals]=published

# دریافت پست با slug
GET /api/posts?where[slug][equals]=my-post

# دریافت دسته‌بندی‌ها
GET /api/categories

# دریافت تصاویر
GET /api/media
```

#### GraphQL

```
Endpoint: http://localhost:3005/api/graphql
Playground: http://localhost:3005/api/graphql-playground
```

مثال Query:

```graphql
query {
  Posts(where: { status: { equals: published } }) {
    docs {
      id
      title
      slug
      excerpt
      featuredImage {
        url
        alt
      }
      author {
        email
      }
      categories {
        name
        slug
      }
    }
  }
}
```

## Scripts

```bash
# Development
npm run dev

# Production Build
npm run build

# Start Production
npm start

# Generate TypeScript Types
npm run generate:types

# Payload CLI
npm run payload
```

## ساختار پروژه

```
blog-admin/
├── src/
│   ├── app/                    # Next.js App Router
│   │   └── (payload)/         # Payload Admin UI
│   ├── collections/           # Payload Collections
│   │   ├── Posts.ts          # پست‌های بلاگ
│   │   ├── Categories.ts     # دسته‌بندی‌ها
│   │   ├── Media.ts          # رسانه‌ها
│   │   └── Users.ts          # کاربران
│   ├── storage/
│   │   └── supabase-storage.ts  # Supabase Storage Adapter
│   ├── payload.config.ts     # تنظیمات اصلی Payload
│   └── payload-types.ts      # Generated Types
├── .env                       # Environment Variables
├── package.json
└── README.md
```

## تنظیمات

### payload.config.ts

فایل اصلی تنظیمات PayloadCMS:

```typescript
export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Posts, Categories],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    schemaName: 'blog',  // Schema جداگانه
  }),
});
```

### Supabase Storage Adapter

فایل `src/storage/supabase-storage.ts` مسئول:
- آپلود فایل‌ها به Supabase
- دریافت URL عمومی
- حذف فایل‌ها
- سرو فایل‌ها

## Production Deployment

### Vercel

1. **اضافه کردن پروژه**

```bash
vercel
```

2. **تنظیم Environment Variables**

در Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `PAYLOAD_SECRET` | با `openssl rand -base64 32` |
| `DATABASE_URI` | Connection string (با `?schema=blog`) |
| `PAYLOAD_PUBLIC_SERVER_URL` | `https://blog-admin.yourdomain.com` |
| `SUPABASE_URL` | URL پروژه Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key |
| `SUPABASE_ANON_KEY` | Anon key |
| `SUPABASE_STORAGE_BUCKET` | `media` |

3. **Deploy**

```bash
vercel --prod
```

## عیب‌یابی

### خطای Database Connection

```bash
# بررسی connection string
echo $DATABASE_URI

# باید شامل ?schema=blog باشد
# postgresql://...?schema=blog
```

### تصاویر نمایش داده نمی‌شوند

1. Storage bucket عمومی باشد
2. CORS تنظیم شده باشد
3. URL درست باشد

### Admin Panel باز نمی‌شود

```bash
# بررسی PAYLOAD_SECRET
echo $PAYLOAD_SECRET

# اگر خالی است:
openssl rand -base64 32
```

### جداول ایجاد نمی‌شوند

1. Schema `blog` وجود داشته باشد
2. User دسترسی CREATE TABLE داشته باشد
3. Connection string صحیح باشد

## مستندات

- **راهنمای کامل**: [docs/guides/blog-guide.md](../docs/guides/blog-guide.md)
- **معماری بلاگ**: [docs/architecture/blog-architecture.md](../docs/architecture/blog-architecture.md)
- **Database Schema**: [docs/database/blog-schema.md](../docs/database/blog-schema.md)
- **PayloadCMS Docs**: https://payloadcms.com/docs

## پشتیبانی

برای سوالات و مشکلات:
1. مستندات را بررسی کنید
2. به [PayloadCMS Discord](https://discord.com/invite/payload) بپیوندید
3. [GitHub Issues](https://github.com/payloadcms/payload/issues) را چک کنید

## لایسنس

MIT
