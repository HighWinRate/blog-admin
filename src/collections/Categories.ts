import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'نام دسته‌بندی',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'آدرس یکتای دسته‌بندی برای URL',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'توضیحات',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'تصویر دسته‌بندی',
    },
    // SEO for category pages
    {
      name: 'seo',
      type: 'group',
      label: 'تنظیمات SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'عنوان متا',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'توضیحات متا',
        },
      ],
    },
  ],
  timestamps: true,
}

