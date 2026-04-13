-- ═══════════════════════════════════════════
-- Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  storage_path TEXT
);

-- Career entries
CREATE TABLE IF NOT EXISTS career_entries (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  location TEXT,
  "order" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings (KV store)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ─────────────────────
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public can read everything
CREATE POLICY IF NOT EXISTS "Public read photos" ON photos FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public read career" ON career_entries FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public read subscribers" ON subscribers FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public read settings" ON settings FOR SELECT USING (true);

-- Service role (admin) can do everything — handled via server-side using service key
-- Client writes disabled by default

-- ── Storage Buckets ────────────────────────
-- Create buckets in Supabase Dashboard > Storage, or via SQL:
-- CREATE BUCKET 'resume' (public = true);
-- CREATE BUCKET 'profile' (public = true);
-- CREATE BUCKET 'photos' (public = true);

-- ── Storage RLS Policies (photos bucket) ───
DROP POLICY IF EXISTS "Public read photos storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon insert into photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon delete from photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon update photos" ON storage.objects;

CREATE POLICY "Public read photos storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photos');

CREATE POLICY "Allow anon insert into photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Allow anon delete from photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'photos');

CREATE POLICY "Allow anon update photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'photos');

-- Make sure the photos bucket is public
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;
