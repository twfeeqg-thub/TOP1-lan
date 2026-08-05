-- ============================================================
-- Migration: Multi-Tenancy (core schema) — Run in Supabase SQL Editor
-- OR via DBeaver connected to the SAME project.
-- Establishes relational tenants + user subscriptions.
-- ============================================================

-- 1) core.tenants — one row per organizational tenant
CREATE TABLE IF NOT EXISTS core.tenants (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  phone      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2) core.user_subscriptions — user -> project authorization
CREATE TABLE IF NOT EXISTS core.user_subscriptions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  tenant_id   UUID REFERENCES core.tenants(id) ON DELETE SET NULL,
  project_slug TEXT NOT NULL,
  plan        TEXT DEFAULT 'basic' NOT NULL CHECK (plan IN ('basic', 'pro', 'enterprise')),
  is_active   BOOLEAN DEFAULT true NOT NULL,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT uq_user_subscription UNIQUE (user_id, project_slug)
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user    ON core.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_project ON core.user_subscriptions(project_slug);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_tenant  ON core.user_subscriptions(tenant_id);

-- 3) Row Level Security — enabled with permissive policies so anon/authenticated
--    retain the same access model used across the platform (service_role bypasses RLS).
ALTER TABLE core.tenants            ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.user_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenants_all_access            ON core.tenants;
DROP POLICY IF EXISTS user_subscriptions_all_access ON core.user_subscriptions;

CREATE POLICY tenants_all_access
  ON core.tenants FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY user_subscriptions_all_access
  ON core.user_subscriptions FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

-- 4) GRANT privileges to the standard roles
GRANT USAGE ON SCHEMA core TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA core TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA core TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- 5) IMPORTANT: force PostgREST to reload the schema cache
--    (Required if tables were created via a direct connection like DBeaver)
NOTIFY pgrst, 'reload schema';
