-- ==============================================================================
-- The Spark Studio — Supabase Database & Storage Setup
-- ==============================================================================

-- 1. Create inquiries table for contact form submissions
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    project_type TEXT,
    budget TEXT,
    message TEXT,
    source TEXT DEFAULT 'sparkstudio_web'
);

-- Enable Row Level Security (RLS)
CREATE TABLE IF NOT EXISTS public.subscribers (
    email TEXT PRIMARY KEY,
    source TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Accept subscriptions" ON public.subscribers;
CREATE POLICY "Accept subscriptions" ON public.subscribers FOR INSERT TO anon
WITH CHECK (email = lower(trim(email)) AND length(email) BETWEEN 3 AND 320);
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors to insert inquiries
DROP POLICY IF EXISTS "Allow anonymous insert on inquiries" ON public.inquiries;
CREATE POLICY "Allow anonymous insert on inquiries"
ON public.inquiries
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated studio admins to read inquiries
DROP POLICY IF EXISTS "Allow authenticated users to read inquiries" ON public.inquiries;
CREATE POLICY "Allow authenticated users to read inquiries"
ON public.inquiries
FOR SELECT
TO authenticated
USING (auth.jwt() -> 'app_metadata' ->> 'studio_role' = 'admin');

-- 2. Create Storage Bucket for template inner page assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('sparkstudio-templates', 'sparkstudio-templates', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public read access for template assets
DROP POLICY IF EXISTS "Public Access to Template Assets" ON storage.objects;
CREATE POLICY "Public Access to Template Assets"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'sparkstudio-templates');

-- Storage RLS: Authenticated upload for studio admins
DROP POLICY IF EXISTS "Admin Upload to Template Assets" ON storage.objects;
CREATE POLICY "Admin Upload to Template Assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sparkstudio-templates' AND auth.jwt() -> 'app_metadata' ->> 'studio_role' = 'admin');
