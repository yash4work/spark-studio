-- ==============================================================================
-- Spark Studio — Supabase Database & Storage Setup
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
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors to insert inquiries
CREATE POLICY "Allow anonymous insert on inquiries"
ON public.inquiries
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated studio admins to read inquiries
CREATE POLICY "Allow authenticated users to read inquiries"
ON public.inquiries
FOR SELECT
TO authenticated
USING (true);

-- 2. Create Storage Bucket for template inner page assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('sparkstudio-templates', 'sparkstudio-templates', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public read access for template assets
CREATE POLICY "Public Access to Template Assets"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'sparkstudio-templates');

-- Storage RLS: Authenticated upload for studio admins
CREATE POLICY "Admin Upload to Template Assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sparkstudio-templates');
