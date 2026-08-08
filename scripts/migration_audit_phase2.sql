-- ============================================================
-- Migration: Phase 2 — Forensic Logging & Upward Sync Engine
-- Schema: core | Target: Supabase pooler (port 6543, SSL)
-- Idempotent — safe to re-run. Executed programmatically via:
--   npm run db:migrate:audit2  (scripts/migrate-audit-phase2.ts)
-- ============================================================

-- ------------------------------------------------------------
-- 1) core.master_audit_log — forensic columns
--    performed_at    : exact moment the mutation was committed
--    actor_role      : role of the acting user (denormalized snapshot)
--    client_mutation_id : idempotency key for offline upward sync
-- ------------------------------------------------------------
ALTER TABLE core.master_audit_log
  ADD COLUMN IF NOT EXISTS performed_at timestamptz,
  ADD COLUMN IF NOT EXISTS actor_role text,
  ADD COLUMN IF NOT EXISTS client_mutation_id text;

-- Backfill performed_at from created_at for pre-existing rows.
UPDATE core.master_audit_log SET performed_at = created_at WHERE performed_at IS NULL;

-- ------------------------------------------------------------
-- 2) Severity standardization → info / medium / high
--    Legacy values (low, warn, warning, success, error) collapse
--    onto the canonical three-level scale.
-- ------------------------------------------------------------
UPDATE core.master_audit_log SET severity = 'medium'
  WHERE severity IN ('low', 'warn', 'warning');
UPDATE core.master_audit_log SET severity = 'high'
  WHERE severity IN ('error', 'critical');
UPDATE core.master_audit_log SET severity = 'info'
  WHERE severity NOT IN ('info', 'medium', 'high');

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_audit_severity' AND conrelid = 'core.master_audit_log'::regclass
  ) THEN
    ALTER TABLE core.master_audit_log
      ADD CONSTRAINT chk_audit_severity CHECK (severity IN ('info', 'medium', 'high'));
  END IF;
END $$;

-- ------------------------------------------------------------
-- 3) Indexes — entity lookups, timeline ordering, actor, dedupe
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_audit_entity ON core.master_audit_log (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON core.master_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user ON core.master_audit_log (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_audit_client_mutation
  ON core.master_audit_log (client_mutation_id) WHERE client_mutation_id IS NOT NULL;

-- ------------------------------------------------------------
-- 4) core.master_outbox — upward sync engine sink
--    Offline mutations are replayed against this table and
--    committed transactionally with the matching audit row.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.master_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_mutation_id text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  last_error text,
  performed_by uuid REFERENCES core.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  performed_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_outbox_client_mutation ON core.master_outbox (client_mutation_id);
CREATE INDEX IF NOT EXISTS idx_outbox_status ON core.master_outbox (status, created_at);

ALTER TABLE core.master_outbox ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS permissive_outbox_policy ON core.master_outbox;
CREATE POLICY permissive_outbox_policy
  ON core.master_outbox FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE core.master_outbox TO anon, authenticated, service_role;

-- ------------------------------------------------------------
-- 5) Re-standardize the override audit trigger so future writes
--    honor the info/medium/high scale (was low/medium/high).
-- ------------------------------------------------------------
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
    v_severity := CASE WHEN OLD.config_override = NEW.config_override THEN 'info' ELSE 'medium' END;
    v_entity   := NEW.id::text;
  ELSE
    v_action   := 'override.delete';
    v_details  := jsonb_build_object('tenant_id', OLD.tenant_id, 'project_slug', OLD.project_slug,
                                     'deleted_config', OLD.config_override)::text;
    v_severity := 'high';
    v_entity   := OLD.id::text;
  END IF;

  INSERT INTO core.master_audit_log (action, user_id, entity_type, entity_id, details, severity, performed_at)
  VALUES (v_action, v_uid, 'project_override', v_entity, v_details, v_severity, now());
  RETURN COALESCE(NEW, OLD);
END; $$;

-- ------------------------------------------------------------
-- 6) Force PostgREST to reload the schema cache
-- ------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
