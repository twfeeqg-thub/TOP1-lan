-- ============================================================
-- Remediation QA-Fix: bring live DB to the state the app expects
-- Target: project ydjbwnmjlqlthyfmxmqj (core schema)
-- Idempotent: safe to re-run.
-- ============================================================

-- 1) core.sectors (missing everywhere) + seed education sector
CREATE TABLE IF NOT EXISTS core.sectors (
  id          text PRIMARY KEY,
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  icon        text NOT NULL DEFAULT 'FolderKanban',
  is_active   boolean NOT NULL DEFAULT true,
  full_data   jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

INSERT INTO core.sectors (id, name, slug, icon, is_active, full_data) VALUES
  ('edu-1', 'التعليم', 'education', 'GraduationCap', true, '{}'::jsonb),
  ('health-1', 'الصحة', 'health', 'HeartPulse', true, '{}'::jsonb),
  ('realestate-1', 'العقارات', 'realestate', 'Building2', true, '{}'::jsonb),
  ('commerce-1', 'التجارة', 'commerce', 'ShoppingCart', false, '{}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  is_active = EXCLUDED.is_active;

-- 2) core.features + core.schools (master features page)
CREATE TABLE IF NOT EXISTS core.features (
  id              text PRIMARY KEY,
  name            text NOT NULL,
  description     text NOT NULL DEFAULT '',
  slug            text NOT NULL UNIQUE,
  is_active       boolean NOT NULL DEFAULT true,
  icon            text NOT NULL DEFAULT 'Zap',
  priority        text NOT NULL DEFAULT 'متوسطة',
  enabled_schools integer[] NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS core.schools (
  id         integer PRIMARY KEY,
  name       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3) core.ad_requests (client ad requests)
CREATE TABLE IF NOT EXISTS core.ad_requests (
  id              text PRIMARY KEY,
  client_info     jsonb NOT NULL,
  campaign        jsonb NOT NULL,
  attachments     jsonb NOT NULL DEFAULT '{}'::jsonb,
  design_request  jsonb,
  status          text NOT NULL DEFAULT 'pending',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz
);

-- 4) core.kill_switch (single-row emergency switch)
CREATE TABLE IF NOT EXISTS core.kill_switch (
  id         boolean PRIMARY KEY DEFAULT true,
  active     boolean NOT NULL DEFAULT false,
  toggled_at timestamptz
);
INSERT INTO core.kill_switch (id, active) VALUES (true, false)
ON CONFLICT (id) DO NOTHING;

-- 5) core.ads_engine: add columns the master panel queries
ALTER TABLE core.ads_engine ADD COLUMN IF NOT EXISTS media_url   text;
ALTER TABLE core.ads_engine ADD COLUMN IF NOT EXISTS status      text NOT NULL DEFAULT 'active';
ALTER TABLE core.ads_engine ADD COLUMN IF NOT EXISTS clicks      bigint NOT NULL DEFAULT 0;
ALTER TABLE core.ads_engine ADD COLUMN IF NOT EXISTS impressions bigint NOT NULL DEFAULT 0;
ALTER TABLE core.ads_engine ADD COLUMN IF NOT EXISTS budget      text;
ALTER TABLE core.ads_engine ADD COLUMN IF NOT EXISTS platform    text;
ALTER TABLE core.ads_engine ADD COLUMN IF NOT EXISTS request_id  text;
UPDATE core.ads_engine
   SET status = CASE WHEN is_active THEN 'active' ELSE 'inactive' END
 WHERE (is_active = false AND status = 'active')
    OR (is_active = true AND status = 'inactive');

-- 6) core.master_audit_log: align with logAudit() contract
ALTER TABLE core.master_audit_log ADD COLUMN IF NOT EXISTS severity text NOT NULL DEFAULT 'info';
ALTER TABLE core.master_audit_log ALTER COLUMN entity_id TYPE text USING entity_id::text;
ALTER TABLE core.master_audit_log ALTER COLUMN details   TYPE text USING details::text;
ALTER TABLE core.master_audit_log ALTER COLUMN user_id      DROP NOT NULL;
ALTER TABLE core.master_audit_log ALTER COLUMN entity_type  DROP NOT NULL;
ALTER TABLE core.master_audit_log ALTER COLUMN entity_id    DROP NOT NULL;

-- 7) Grants: fixes the 403s for anon / authenticated / service_role
GRANT USAGE ON SCHEMA core TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA core TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA core TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 8) Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
