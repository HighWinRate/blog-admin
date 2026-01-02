import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'publishedDate'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'عنوان پست',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'آدرس یکتای پست برای URL (مثال: my-blog-post)',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      label: 'خلاصه پست',
      admin: {
        description: 'خلاصه کوتاه پست (150-160 کاراکتر توصیه می‌شود)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'محتوای پست',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'تصویر شاخص',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'نویسنده',
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'دسته‌بندی‌ها',
    },
    {
      name: 'tags',
      type: 'array',
      label: 'برچسب‌ها',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'وضعیت',
      options: [
        {
          label: 'پیش‌نویس',
          value: 'draft',
        },
        {
          label: 'منتشر شده',
          value: 'published',
        },
      ],
    },
    {
      name: 'publishedDate',
      type: 'date',
      label: 'تاریخ انتشار',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    // SEO Fields
    {
      name: 'seo',
      type: 'group',
      label: 'تنظیمات SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'عنوان متا (Meta Title)',
          admin: {
            description: 'عنوان برای موتورهای جستجو (50-60 کاراکتر توصیه می‌شود)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'توضیحات متا (Meta Description)',
          admin: {
            description: 'توضیحات برای موتورهای جستجو (150-160 کاراکتر توصیه می‌شود)',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'کلمات کلیدی',
          admin: {
            description: 'کلمات کلیدی مرتبط با محتوا (با کاما جدا کنید)',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'تصویر Open Graph',
          admin: {
            description: 'تصویر برای اشتراک‌گذاری در شبکه‌های اجتماعی (1200x630 پیکسل توصیه می‌شود)',
          },
        },
        {
          name: 'ogTitle',
          type: 'text',
          label: 'عنوان Open Graph',
          admin: {
            description: 'عنوان برای شبکه‌های اجتماعی (اگر خالی باشد، از عنوان اصلی استفاده می‌شود)',
          },
        },
        {
          name: 'ogDescription',
          type: 'textarea',
          label: 'توضیحات Open Graph',
          admin: {
            description: 'توضیحات برای شبکه‌های اجتماعی',
          },
        },
        {
          name: 'canonicalUrl',
          type: 'text',
          label: 'URL کانونیکال',
          admin: {
            description: 'URL اصلی و یکتای پست (برای جلوگیری از محتوای تکراری)',
          },
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          label: 'No Index',
          admin: {
            description: 'اگر فعال شود، این صفحه توسط موتورهای جستجو ایندکس نمی‌شود',
          },
        },
        {
          name: 'noFollow',
          type: 'checkbox',
          label: 'No Follow',
          admin: {
            description: 'اگر فعال شود، لینک‌های این صفحه دنبال نمی‌شوند',
          },
        },
      ],
    },
    // Reading time and view count
    {
      name: 'readingTime',
      type: 'number',
      label: 'زمان مطالعه (دقیقه)',
      admin: {
        description: 'تخمینی از زمان مطالعه پست',
      },
    },
    {
      name: 'viewCount',
      type: 'number',
      defaultValue: 0,
      label: 'تعداد بازدید',
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}

