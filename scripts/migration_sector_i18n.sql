-- ============================================================
-- Migration: Sector i18n (bilingual JSONB) — core.sectors.full_data
-- Adds `*_en` sibling keys for every bilingual text field while keeping the
-- Arabic root as the automatic fallback. No new columns/DDL.
-- Guards: only touches rows whose full_data already contains a hero section;
-- never overwrites an existing `*_en` value (COALESCE keep).
-- Run via scripts/migrate-sector-i18n.ts (6543 guard) or in the SQL Editor.
-- ============================================================

-- Education (edu-1)
UPDATE core.sectors
SET full_data = jsonb_set(
  jsonb_set(
    jsonb_set(
      full_data,
      '{hero,badge_en}',
      COALESCE(full_data #> '{hero,badge_en}', '"Ready now"'::jsonb)
    ),
    '{hero,title_en}',
    COALESCE(full_data #> '{hero,title_en}', '"Easy Intellect — Digital Education"'::jsonb)
  ),
  '{hero,description_en}',
  COALESCE(
    full_data #> '{hero,description_en}',
    '"An interactive platform for managing the digital educational process with smart automation."'::jsonb
  )
)
WHERE id = 'edu-1' AND full_data ? 'hero';

-- Health (health-1)
UPDATE core.sectors
SET full_data = jsonb_set(
  jsonb_set(
    jsonb_set(
      full_data,
      '{hero,badge_en}',
      COALESCE(full_data #> '{hero,badge_en}', '"Ready now"'::jsonb)
    ),
    '{hero,title_en}',
    COALESCE(full_data #> '{hero,title_en}', '"Easy Intellect — Digital Health"'::jsonb)
  ),
  '{hero,description_en}',
  COALESCE(
    full_data #> '{hero,description_en}',
    '"A platform for managing healthcare institutions with smart automation and digital tools."'::jsonb
  )
)
WHERE id = 'health-1' AND full_data ? 'hero';

-- Real estate (realestate-1)
UPDATE core.sectors
SET full_data = jsonb_set(
  jsonb_set(
    jsonb_set(
      full_data,
      '{hero,badge_en}',
      COALESCE(full_data #> '{hero,badge_en}', '"Coming soon"'::jsonb)
    ),
    '{hero,title_en}',
    COALESCE(full_data #> '{hero,title_en}', '"Easy Intellect — Digital Real Estate"'::jsonb)
  ),
  '{hero,description_en}',
  COALESCE(
    full_data #> '{hero,description_en}',
    '"A platform for managing real estate projects and digital showrooms with sovereign cloud infrastructure."'::jsonb
  )
)
WHERE id = 'realestate-1' AND full_data ? 'hero';

-- Commerce (commerce-1)
UPDATE core.sectors
SET full_data = jsonb_set(
  jsonb_set(
    jsonb_set(
      full_data,
      '{hero,badge_en}',
      COALESCE(full_data #> '{hero,badge_en}', '"Coming soon"'::jsonb)
    ),
    '{hero,title_en}',
    COALESCE(full_data #> '{hero,title_en}', '"Easy Intellect — Digital Commerce"'::jsonb)
  ),
  '{hero,description_en}',
  COALESCE(
    full_data #> '{hero,description_en}',
    '"A digital commerce platform integrated with WhatsApp Business API for secure online selling."'::jsonb
  )
)
WHERE id = 'commerce-1' AND full_data ? 'hero';

-- Verification guard: every hero-bearing sector must now expose a title_en.
DO $$
DECLARE
  missing int;
BEGIN
  SELECT count(*) INTO missing
  FROM core.sectors
  WHERE full_data ? 'hero'
    AND (full_data #>> '{hero,title_en}') IS NULL;

  IF missing > 0 THEN
    RAISE EXCEPTION 'i18n migration incomplete: % hero rows still lack title_en', missing;
  END IF;
END;
$$;
