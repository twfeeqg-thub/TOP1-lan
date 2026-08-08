-- ============================================================
-- Migration: Phase 3 — Deterministic Display Ordering
-- Schema: core | Target: Supabase pooler (port 6543, SSL)
-- Idempotent — safe to re-run. Executed programmatically via:
--   npm run db:migrate:phase3  (scripts/migrate-phase3.ts)
-- ============================================================

-- ------------------------------------------------------------
-- 1) core.sectors — explicit ordering column
--    Deterministic sort order for the Dynamic Sectors Grid on
--    edge browsers (no reliance on insertion UUIDs).
-- ------------------------------------------------------------
ALTER TABLE core.sectors
  ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

-- ------------------------------------------------------------
-- 2) core.project_definitions — explicit ordering column
-- ------------------------------------------------------------
ALTER TABLE core.project_definitions
  ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

-- ------------------------------------------------------------
-- 3) B-Tree indexes — guaranteed deterministic ordering
--    Composite (display_order, created_at) yields a stable,
--    repeatable sort even when two entities share the same
--    display_order value.
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_sectors_display_order
  ON core.sectors (display_order ASC, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_project_definitions_display_order
  ON core.project_definitions (display_order ASC, created_at ASC);

-- ------------------------------------------------------------
-- 4) Force PostgREST to reload the schema cache
-- ------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
