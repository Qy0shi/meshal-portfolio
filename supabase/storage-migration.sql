-- ═══════════════════════════════════════════
-- Run this in Supabase Dashboard → SQL Editor
-- Step 1: Add storage columns
-- Step 2: Create storage RLS policies
-- ═══════════════════════════════════════════

-- Add storage_path column (existing url column stays for compatibility)
ALTER TABLE photos ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- ═══════════════════════════════
-- Storage policies
-- ═══════════════════════════════

-- Allow public to read photos bucket
CREATE POLICY "Public read photos storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');

-- Allow service role (admin API) to upload
CREATE POLICY "Service role upload photos"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'photos');

-- Allow service role to delete
CREATE POLICY "Service role delete photos"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'photos');

-- Allow service role to update
CREATE POLICY "Service role update photos"
ON storage.objects FOR UPDATE
TO service_role
USING (bucket_id = 'photos');
