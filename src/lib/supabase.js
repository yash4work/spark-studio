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
      const client = await getSupabase();
      if (client) {
        const { error, data: inserted } = await client.from('inquiries').insert([payload]);
        if (error) throw error;
        return { success: true, data: inserted, mode: 'cloud' };
      }
    } catch (err) {
      console.warn('Supabase insert failed, saving locally:', err);
    }
  }

  // Graceful local cache fallback
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      let existing = [];
      try {
        const raw = localStorage.getItem('spark_inquiries');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) existing = parsed;
        }
      } catch {
        existing = [];
      }
      existing.push(payload);
      localStorage.setItem('spark_inquiries', JSON.stringify(existing));
    }
  } catch (e) {
    console.warn('LocalStorage write unavailable, keeping in-memory:', e);
  }

  return { success: true, fallback: true, mode: 'local' };
}

/**
 * Save launch alert / early-bird newsletter subscriber with cloud persistence and localStorage cache
 */
export async function saveSubscriber(email, source = 'expanding_pipeline') {
  const cleanEmail = (email || '').trim().toLowerCase();
  const payload = {
    email: cleanEmail,
    source,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      const client = await getSupabase();
      if (client) {
        // Try 'subscribers' table first
        const { error, data: inserted } = await client.from('subscribers').insert([payload]);
        if (!error) return { success: true, data: inserted, mode: 'cloud' };

        // Fallback to 'inquiries' table as an alert subscriber lead
        const { error: inqErr, data: inqInserted } = await client.from('inquiries').insert([{
          name: 'Launch Alert Subscriber',
          email: cleanEmail,
          projectType: 'Launch Alert / Early-Bird Newsletter',
          budget: 'N/A',
          message: `Subscribed via ${source}`,
          created_at: payload.created_at,
          source: 'sparkstudio_newsletter'
        }]);
        if (!inqErr) return { success: true, data: inqInserted, mode: 'cloud' };
      }
    } catch (err) {
      console.warn('Supabase subscriber insert failed, saving locally:', err);
    }
  }

  // Graceful local cache fallback
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      let existing = [];
      try {
        const raw = localStorage.getItem('spark_subscribers');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) existing = parsed;
        }
      } catch {
        existing = [];
      }
      if (!existing.some(s => s && s.email === cleanEmail)) {
        existing.push(payload);
        localStorage.setItem('spark_subscribers', JSON.stringify(existing));
      }
    }
  } catch (e) {
    console.warn('LocalStorage write unavailable for subscriber, keeping in-memory:', e);
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
