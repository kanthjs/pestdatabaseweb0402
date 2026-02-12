-- ============================================
-- Supabase Storage Setup for pestPics Bucket
-- ============================================
-- Run this in Supabase Dashboard SQL Editor
-- This creates the bucket and sets up RLS policies

-- 1. Create the bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('pestPics', 'pestPics', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Enable RLS on storage.objects (usually already enabled by default)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Create Storage Policies

-- 3.1 Public Read Access (for displaying images via public URL)
DROP POLICY IF EXISTS "Allow public select for pestPics" ON storage.objects;
CREATE POLICY "Allow public select for pestPics"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'pestPics');

-- 3.2 Authenticated Upload (only logged-in users can upload)
DROP POLICY IF EXISTS "Allow authenticated insert for pestPics" ON storage.objects;
CREATE POLICY "Allow authenticated insert for pestPics"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'pestPics');

-- 3.3 Authenticated Update (only logged-in users can update)
DROP POLICY IF EXISTS "Allow authenticated update for pestPics" ON storage.objects;
CREATE POLICY "Allow authenticated update for pestPics"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'pestPics');

-- 3.4 Authenticated Delete (only logged-in users can delete)
DROP POLICY IF EXISTS "Allow authenticated delete for pestPics" ON storage.objects;
CREATE POLICY "Allow authenticated delete for pestPics"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'pestPics');

-- ============================================
-- NOTES:
-- ============================================
-- - Bucket 'pestPics' is PUBLIC to allow direct URL access
-- - Upload/Update/Delete requires authentication
-- - Used for:
--   * Pest Report images (survey form)
--   * Expert proof documents (profile form)
-- 
-- SECURITY WARNING: Expert proofs are currently stored in 
-- public bucket. In production, consider:
--   1. Creating a separate PRIVATE bucket for sensitive docs
--   2. Using signed URLs instead of public URLs
--   3. Or storing expert proofs in a different storage service
-- ============================================
