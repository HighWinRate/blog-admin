import type {
  CollectionConfig,
  CollectionBeforeChangeHook,
  CollectionAfterDeleteHook,
  PayloadRequest,
} from 'payload'
import { supabaseStorageAdapter } from '../storage/supabase-storage'

type FileFetchHandler = (
  req: PayloadRequest,
  args: {
    doc?: Record<string, unknown> & {
      url?: string
      id?: string | number
    }
    params: {
      collection: string
      filename: string
    }
  },
) => Promise<Response>

function getStorageHooks() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase Storage not configured. Media uploads default to local storage.')
    return {
      beforeChange: [] as CollectionBeforeChangeHook[],
      afterDelete: [] as CollectionAfterDeleteHook[],
      handlers: [] as FileFetchHandler[],
    }
  }

  const hooks = supabaseStorageAdapter({
    supabaseUrl,
    supabaseKey,
    bucket: process.env.SUPABASE_STORAGE_BUCKET || 'media',
  })

  return {
    beforeChange: hooks.beforeChange ? [hooks.beforeChange] : [],
    afterDelete: hooks.afterDelete ? [hooks.afterDelete] : [],
    handlers: hooks.fileHandler ? [hooks.fileHandler] : [],
  }
}

const storageHooks = getStorageHooks()

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    disableLocalStorage: true,
    handlers: storageHooks.handlers,
  },
  hooks: {
    beforeChange: storageHooks.beforeChange,
    afterDelete: storageHooks.afterDelete,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
