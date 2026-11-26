-- ==============================================================================
-- The Spark Studio — pending database changes (2026-11-26)
-- Run once in Supabase: Dashboard → SQL Editor → paste → Run.
-- Safe to run more than once.
-- ==============================================================================

-- 1. Least privilege: anonymous visitors may only ADD rows (contact form + newsletter).
--    Row Level Security already limited them to inserts; this removes the broad grant too.
REVOKE ALL ON TABLE public.inquiries   FROM anon;
REVOKE ALL ON TABLE public.subscribers FROM anon;
GRANT INSERT ON TABLE public.inquiries   TO anon;
GRANT INSERT ON TABLE public.subscribers TO anon;

-- 2. The contact form now asks for a Timeline instead of a Budget.
--    Until this column exists, the timeline is appended to the message text.
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS timeline TEXT;

-- After running this, ask to switch src/lib/supabase.js to save into the new
-- "timeline" column (do NOT switch it before - inserts would fail without the column).
