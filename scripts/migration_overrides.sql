-- ============================================================
-- Migration: Phase 1 — Database Consolidation & Overrides Schema
-- Schema: core | Target: Supabase pooler (port 6543, SSL)
-- Idempotent — safe to re-run. Executed programmatically via:
--   npm run db:migrate:overrides  (scripts/migrate-overrides.ts)
-- ============================================================

-- ------------------------------------------------------------
-- 0) DRIFT GUARD — core.project_definitions
--    Closes the out-of-band (DBeaver) creation gap forever.
--    Ensures the table exists with the exact columns the app queries.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.project_definitions (
  project_slug   TEXT PRIMARY KEY,
  sector_name    TEXT    NOT NULL DEFAULT '',
  is_active      BOOLEAN NOT NULL DEFAULT true,
  modules_config JSONB   NOT NULL DEFAULT '{}'::jsonb,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pre-existing table missing created_at? Repair it (idempotent).
ALTER TABLE core.project_definitions
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE core.project_definitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS project_definitions_all_access ON core.project_definitions;
CREATE POLICY project_definitions_all_access
  ON core.project_definitions FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

-- ------------------------------------------------------------
-- 0b) DRIFT GUARD — core.master_audit_log
--     Forensic sink consumed by the auditing triggers below.
-- ------------------------------------------------------------
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

-- ------------------------------------------------------------
-- 1) core.project_overrides — Delta (visual/layout) overrides
--    Stores ONLY the client-customized differences; the canonical
--    baseline lives in core.project_definitions.modules_config.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.project_overrides (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  project_slug    VARCHAR(255) NOT NULL REFERENCES core.project_definitions(project_slug) ON DELETE CASCADE,
  config_override JSONB NOT NULL DEFAULT '{}'::jsonb,
  version         INTEGER NOT NULL DEFAULT 1,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  updated_by      UUID REFERENCES core.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_tenant_project_override UNIQUE (tenant_id, project_slug)
);

-- ------------------------------------------------------------
-- 2) Indexes — GIN on JSONB for instant lookups on low-RAM
--    mobile devices (3GB class), plus the slug lookup path.
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_project_overrides_project
  ON core.project_overrides (project_slug);
CREATE INDEX IF NOT EXISTS idx_project_overrides_config_gin
  ON core.project_overrides USING GIN (config_override);

-- ------------------------------------------------------------
-- 3) Row Level Security — permissive for now (per approved plan);
--    strict tenant-scoped hardening is a later phase.
-- ------------------------------------------------------------
ALTER TABLE core.project_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS permissive_policy ON core.project_overrides;
CREATE POLICY permissive_policy
  ON core.project_overrides FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

-- ------------------------------------------------------------
-- 4) Grants — anon, authenticated, service_role (service bypasses RLS)
-- ------------------------------------------------------------
GRANT USAGE ON SCHEMA core TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE core.project_overrides TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE core.project_definitions TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE core.master_audit_log TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA core TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated, service_role;

-- ------------------------------------------------------------
-- 5) updated_at trigger (redefined defensively)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION core.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_project_overrides_updated_at ON core.project_overrides;
CREATE TRIGGER trg_project_overrides_updated_at
  BEFORE UPDATE ON core.project_overrides
  FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

-- ------------------------------------------------------------
-- 6) Forensic auditing — delta helper + trigger → core.master_audit_log
--    Every INSERT/UPDATE/DELETE is recorded with a structured diff,
--    actor (best-effort from JWT claims), and severity.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION core.override_diff(before_json jsonb, after_json jsonb)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE diff jsonb := '{}'::jsonb; k text; v jsonb;
BEGIN
  FOR k, v IN SELECT key, value FROM jsonb_each(COALESCE(after_json, '{}'::jsonb))
  LOOP
    IF before_json IS NULL OR NOT (before_json ? k) OR before_json->k IS DISTINCT FROM v THEN
      diff := jsonb_set(diff, ARRAY[k],
        jsonb_build_object('old', COALESCE(before_json->k, 'null'::jsonb), 'new', v));
    END IF;
  END LOOP;
  RETURN diff;
END; $$;

CREATE OR REPLACE FUNCTION core.log_project_override_audit()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_uid      uuid;
  v_action   text;
  v_details  text;
  v_severity text;
  v_entity   text;
BEGIN
  BEGIN
    v_uid := NULLIF(current_setting('request.jwt.claims', true)::jsonb->>'sub', '')::uuid;
  EXCEPTION WHEN others THEN v_uid := NULL;
  END;
  IF v_uid IS NULL THEN
    BEGIN
      v_uid := NULLIF(current_setting('request.jwt.claims', true)::jsonb->>'user_id', '')::uuid;
    EXCEPTION WHEN others THEN v_uid := NULL;
    END;
  END IF;

  IF TG_OP = 'INSERT' THEN
    v_action   := 'override.create';
    v_details  := jsonb_build_object('tenant_id', NEW.tenant_id, 'project_slug', NEW.project_slug,
                                     'config_override', NEW.config_override)::text;
    v_severity := 'info';
    v_entity   := NEW.id::text;
  ELSIF TG_OP = 'UPDATE' THEN
    v_action   := 'override.update';
    v_details  := jsonb_build_object('tenant_id', NEW.tenant_id, 'project_slug', NEW.project_slug,
                                     'version', OLD.version || ' -> ' || NEW.version,
                                     'diff', core.override_diff(OLD.config_override, NEW.config_override))::text;
    v_severity := CASE WHEN OLD.config_override = NEW.config_override THEN 'low' ELSE 'medium' END;
    v_entity   := NEW.id::text;
  ELSE
    v_action   := 'override.delete';
    v_details  := jsonb_build_object('tenant_id', OLD.tenant_id, 'project_slug', OLD.project_slug,
                                     'deleted_config', OLD.config_override)::text;
    v_severity := 'high';
    v_entity   := OLD.id::text;
  END IF;

  INSERT INTO core.master_audit_log (action, user_id, entity_type, entity_id, details, severity)
  VALUES (v_action, v_uid, 'project_override', v_entity, v_details, v_severity);
  RETURN COALESCE(NEW, OLD);
END; $$;

DROP TRIGGER IF EXISTS trg_project_overrides_audit ON core.project_overrides;
CREATE TRIGGER trg_project_overrides_audit
  AFTER INSERT OR UPDATE OR DELETE ON core.project_overrides
  FOR EACH ROW EXECUTE FUNCTION core.log_project_override_audit();

-- ------------------------------------------------------------
-- 7) Force PostgREST to reload the schema cache
-- ------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
