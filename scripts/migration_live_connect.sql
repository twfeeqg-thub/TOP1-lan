-- ============================================================
-- Migration: Live Connection (core schema) — Run in Supabase SQL Editor
-- OR via DBeaver connected to the SAME project (ydjbwnmjlqlthyfmxmqj)
-- This creates the tables the platform needs and grants permissions.
-- ============================================================

-- 1) Sectors table (missing in cloud)
CREATE TABLE IF NOT EXISTS core.sectors (
  id          text PRIMARY KEY,
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  icon        text NOT NULL DEFAULT 'FolderKanban',
  is_active   boolean NOT NULL DEFAULT true,
  full_data   jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 2) Features + Schools (for master features page)
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

-- 3) Ad requests (client requests for ads)
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

-- 4) Kill switch (global ad emergency switch — single row, id = true)
CREATE TABLE IF NOT EXISTS core.kill_switch (
  id         boolean PRIMARY KEY DEFAULT true,
  active     boolean NOT NULL DEFAULT false,
  toggled_at timestamptz
);
INSERT INTO core.kill_switch (id, active) VALUES (true, false)
ON CONFLICT (id) DO NOTHING;

-- 5) Extend ads_engine with the columns the master panel needs
ALTER TABLE core.ads_engine ADD COLUMN IF NOT EXISTS media_url   text;
ALTER TABLE core.ads_engine ADD COLUMN IF NOT EXISTS status      text NOT NULL DEFAULT 'active';
ALTER TABLE core.ads_engine ADD COLUMN IF NOT EXISTS clicks      bigint NOT NULL DEFAULT 0;
ALTER TABLE core.ads_engine ADD COLUMN IF NOT EXISTS impressions bigint NOT NULL DEFAULT 0;
ALTER TABLE core.ads_engine ADD COLUMN IF NOT EXISTS budget      text;
ALTER TABLE core.ads_engine ADD COLUMN IF NOT EXISTS platform    text;
ALTER TABLE core.ads_engine ADD COLUMN IF NOT EXISTS request_id  text;
-- Backfill status from legacy is_active
UPDATE core.ads_engine
   SET status = CASE WHEN is_active THEN 'active' ELSE 'inactive' END
 WHERE status = 'active' AND is_active = false;

-- 6) Ensure master_audit_log has the columns used by logAudit()
CREATE TABLE IF NOT EXISTS core.master_audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action      text NOT NULL,
  user_id     uuid,
  entity_type text,
  entity_id   text,
  details     text,
  severity    text NOT NULL DEFAULT 'info',
  created_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE core.master_audit_log ADD COLUMN IF NOT EXISTS action      text;
ALTER TABLE core.master_audit_log ADD COLUMN IF NOT EXISTS user_id     uuid;
ALTER TABLE core.master_audit_log ADD COLUMN IF NOT EXISTS entity_type text;
ALTER TABLE core.master_audit_log ADD COLUMN IF NOT EXISTS entity_id   text;
ALTER TABLE core.master_audit_log ADD COLUMN IF NOT EXISTS details     text;
ALTER TABLE core.master_audit_log ADD COLUMN IF NOT EXISTS severity    text;
ALTER TABLE core.master_audit_log ADD COLUMN IF NOT EXISTS created_at  timestamptz DEFAULT now();

-- 7) GRANT permissions to the service roles (fixes 403s)
GRANT USAGE ON SCHEMA core TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA core TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA core TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- 8) Seed initial sectors
INSERT INTO core.sectors (id, name, slug, icon, is_active) VALUES
 ('edu-1','التعليم','education','GraduationCap',true),
 ('health-1','الصحة','health','HeartPulse',true),
 ('realestate-1','العقارات','realestate','Building2',true),
 ('commerce-1','التجارة','commerce','ShoppingCart',false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, icon = EXCLUDED.icon, is_active = EXCLUDED.is_active;

-- 9) IMPORTANT: force PostgREST to reload the schema cache
--    (Required if tables were created via a direct connection like DBeaver)
NOTIFY pgrst, 'reload schema';
