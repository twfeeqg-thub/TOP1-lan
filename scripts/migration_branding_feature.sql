-- ============================================================
-- Migration: Enable custom brand uploads for selected tenants.
-- Sets core.project_definitions.modules_config.feature.branding.custom_upload
-- = true for the targeted project slugs. No new columns/DDL.
-- Run via scripts/migrate-branding-feature.ts (6543 guard) or SQL Editor.
-- ============================================================

UPDATE core.project_definitions
SET modules_config = jsonb_set(
  jsonb_set(
    COALESCE(modules_config, '{}'::jsonb),
    '{feature,branding}',
    '{}'::jsonb,
    true
  ),
  '{feature,branding,custom_upload}',
  'true'
)
WHERE project_slug IN (
  'edu_schools',
  'edu_exam',
  'edu_twin',
  'health_clinic'
);

-- Verification guard: the targeted slugs must now expose the flag.
DO $$
DECLARE
  missing int;
BEGIN
  SELECT count(*) INTO missing
  FROM core.project_definitions
  WHERE project_slug IN ('edu_schools', 'edu_exam', 'edu_twin', 'health_clinic')
    AND (modules_config #>> '{feature,branding,custom_upload}') IS DISTINCT FROM 'true';

  IF missing > 0 THEN
    RAISE EXCEPTION 'branding migration incomplete: % target rows still lack custom_upload=true', missing;
  END IF;
END;
$$;
