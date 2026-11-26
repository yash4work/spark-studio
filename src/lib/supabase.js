const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' && process.env) || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  env.VITE_SUPABASE_URL && 
  env.VITE_SUPABASE_ANON_KEY &&
  !env.VITE_SUPABASE_URL.includes('placeholder')
);

let supabaseClient = null;

export async function getSupabase() {
  if (!supabaseClient && isSupabaseConfigured) {
    const { createClient } = await import('@supabase/supabase-js');
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

/**
 * Save contact form inquiry to Supabase table 'inquiries'
 */
export async function saveInquiry(data) {
  const payload = {
    name: data.name,
    email: data.email,
    project_type: data.projectType || data.project_type || 'General Inquiry',
    // The form now asks for a timeline instead of a budget. The table has no
    // timeline column, so it is added to the message (no database change needed).
    budget: data.budget ?? null,
    message: data.timeline ? `${data.message || ''}\n\nTimeline: ${data.timeline}`.trim() : data.message,
    created_at: new Date().toISOString(),
    source: 'sparkstudio_web',
  };

  if (isSupabaseConfigured) {
    try {
      const client = await getSupabase();
      if (client) {
        const { error, data: inserted } = await client.from('inquiries').insert([payload]);
        if (error) throw error;
        return { success: true, data: inserted, mode: 'cloud' };
      }
    } catch (err) {
      console.warn('Supabase insert failed:', err);
    }
  }

  return { success: false, mode: 'unavailable' };
}

/**
 * Save launch alert / early-bird newsletter subscriber to Supabase table 'subscribers'
 */
export async function saveSubscriber(email, source = 'expanding_pipeline') {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, error: 'Email is required' };
  }

  const payload = {
    email: cleanEmail,
    source,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      const client = await getSupabase();
      if (client) {
        // Direct insert into 'subscribers' table (no fallback to inquiries)
        const { error, data: inserted } = await client.from('subscribers').insert([payload]);
        if (!error || error.code === '23505') return { success: true, data: inserted, mode: 'cloud' };
      }
    } catch (err) {
      console.warn('Supabase subscriber insert failed:', err);
    }
  }

  return { success: false, mode: 'unavailable' };
}

/**
 * Upload file to Supabase Storage bucket
 */
export async function uploadToStorage(bucketName, path, file) {
  if (!isSupabaseConfigured) {
    return { error: 'Supabase storage not configured', data: null };
  }
  const client = await getSupabase();
  return await client.storage.from(bucketName).upload(path, file);
}

/**
 * Retrieve public CDN URL for an asset in Supabase Storage
 */
export function getStoragePublicUrl(bucketName, path) {
  if (!isSupabaseConfigured) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  // If not initialized yet, construct standard public CDN url pattern
  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${path}`;
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
  const client = await getSupabase();
  return await client.storage.from(bucketName).list(folder);
}
