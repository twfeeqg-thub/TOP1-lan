-- ============================================================
-- Setup: platform-assets Storage Bucket + path-scoped policies
-- Run once via the Supabase SQL Editor (storage DDL can't run through the
-- pooler transaction safely). The upload route writes via the service role,
-- so no anon write access is granted.
-- ============================================================

-- 1) Create the bucket (idempotent).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'platform-assets',
  'platform-assets',
  true,
  1572864, -- 1.5 MB (matches the uploader/route MAX_BYTES)
  NULL
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2) Public read (anonymous browsers must load logo/favicon/pwa_icon).
DROP POLICY IF EXISTS "platform_assets_public_read" ON storage.objects;
CREATE POLICY "platform_assets_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'platform-assets');

-- 3) Service-role write confined to branding/{tenant}/{asset}.
--    (service_role bypasses RLS anyway; this is defense-in-depth for the anon
--    path and documents intent.)
DROP POLICY IF EXISTS "platform_assets_service_write" ON storage.objects;
CREATE POLICY "platform_assets_service_write"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'platform-assets'
    AND storage.foldername(name)[1] = 'branding'
  );

-- 4) Owner-scoped delete: platform staff can purge any branding path; other
--    authenticated users can only delete assets under their own tenant folder.
DROP POLICY IF EXISTS "platform_assets_owner_delete" ON storage.objects;
CREATE POLICY "platform_assets_owner_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'platform-assets'
    AND (
      (auth.role() = 'service_role')
      OR (auth.jwt() ->> 'role' IN ('super_admin', 'master'))
      OR (storage.foldername(name)[2] = coalesce(auth.jwt() ->> 'tenant_id', ''))
    )
  );
