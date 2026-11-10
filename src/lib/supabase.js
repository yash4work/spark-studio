import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Save contact form inquiry to Supabase table 'inquiries', falling back safely to localStorage/memory
 */
export async function saveInquiry(data) {
  const payload = {
    ...data,
    created_at: new Date().toISOString(),
    source: 'sparkstudio_web',
  };

  if (isSupabaseConfigured) {
    try {
      const { error, data: inserted } = await supabase.from('inquiries').insert([payload]);
      if (error) throw error;
      return { success: true, data: inserted, mode: 'cloud' };
    } catch (err) {
      console.warn('Supabase insert failed, saving locally:', err);
    }
  }

  // Graceful local cache fallback
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const existing = JSON.parse(localStorage.getItem('spark_inquiries') || '[]');
      existing.push(payload);
      localStorage.setItem('spark_inquiries', JSON.stringify(existing));
    }
  } catch (e) {
    console.warn('LocalStorage write unavailable, keeping in-memory:', e);
  }

  return { success: true, fallback: true, mode: 'local' };
}

/**
 * Upload file to Supabase Storage bucket
 */
export async function uploadToStorage(bucketName, path, file) {
  if (!isSupabaseConfigured) {
    return { error: 'Supabase storage not configured', data: null };
  }
  return await supabase.storage.from(bucketName).upload(path, file);
}

/**
 * Retrieve public CDN URL for an asset in Supabase Storage
 */
export function getStoragePublicUrl(bucketName, path) {
  if (!isSupabaseConfigured) {
    // Return relative path or empty if not configured
    return path.startsWith('/') ? path : `/${path}`;
  }
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return data?.publicUrl || path;
}

/**
 * Get public URL for template inner page assets (with fallback to local /templates/ or /assets/)
 */
export function getTemplateStorageUrl(slug, filename, fallbackPath) {
  if (isSupabaseConfigured) {
    return getStoragePublicUrl('sparkstudio-templates', `${slug}/${filename}`);
  }
  return fallbackPath || `/templates/${slug}.png`;
}

/**
 * List files in Supabase Storage bucket folder
 */
export async function listStorageFiles(bucketName, folder = '') {
  if (!isSupabaseConfigured) {
    return { data: [], error: 'Supabase storage not configured' };
  }
  return await supabase.storage.from(bucketName).list(folder);
}
