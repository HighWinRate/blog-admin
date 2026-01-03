import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { CollectionBeforeChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'

interface SupabaseStorageAdapterArgs {
  supabaseUrl: string
  supabaseKey: string
  bucket?: string
}

let supabaseClient: SupabaseClient | null = null
let storageBucket = 'media'

export function getSupabaseClient(supabaseUrl: string, supabaseKey: string): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseKey)
  }

  return supabaseClient
}

export function supabaseStorageAdapter({
  supabaseUrl,
  supabaseKey,
  bucket = 'media',
}: SupabaseStorageAdapterArgs) {
  storageBucket = bucket
  const supabase = getSupabaseClient(supabaseUrl, supabaseKey)

  const beforeChange: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
    if (operation === 'create' && req.file) {
      const file = req.file
      const filename = file.name || 'file'

      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('')
      const fileExt = filename.split('.').pop() || 'bin'
      const storageFileName = `${randomName}.${fileExt}`
      // Store directly in bucket root (bucket is already named 'media')
      const storagePath = storageFileName

      let buffer: Buffer
      if (Buffer.isBuffer(file.data)) {
        buffer = file.data
      } else {
        buffer = Buffer.from(file.data)
      }

      const { error: uploadError } = await supabase.storage
        .from(storageBucket)
        .upload(storagePath, buffer, {
          contentType: file.mimetype || 'application/octet-stream',
          upsert: false,
        })

      if (uploadError) {
        throw new Error(`Failed to upload file to Supabase Storage: ${uploadError.message}`)
      }

      const { data: urlData } = supabase.storage.from(storageBucket).getPublicUrl(storagePath)

      return {
        ...data,
        url: urlData.publicUrl,
        filename: storageFileName,
      }
    }

    return data
  }

  const afterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
    if (doc.url) {
      const url = new URL(doc.url)
      const path = url.pathname.split('/').slice(-2).join('/')

      const { error } = await supabase.storage.from(storageBucket).remove([path])

      if (error) {
        console.warn(`Failed to delete file from Supabase Storage: ${error.message}`)
      }
    }
  }

  const fileHandler = async (
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
  ): Promise<Response> => {
    const { doc, params } = args

    // If doc has a Supabase URL, redirect/proxy to it
    if (doc?.url && doc.url.includes('supabase.co')) {
      const supabaseResponse = await fetch(doc.url)
      return supabaseResponse
    }

    // Fallback: construct URL from filename if doc doesn't have url
    if (params?.filename) {
      const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
      const constructedUrl = `${supabaseUrl}/storage/v1/object/public/${storageBucket}/${params.filename}`
      const supabaseResponse = await fetch(constructedUrl)
      return supabaseResponse
    }

    // No URL available, return 404
    return new Response('File not found', { status: 404 })
  }

  return {
    beforeChange,
    afterDelete,
    fileHandler,
  }
}
