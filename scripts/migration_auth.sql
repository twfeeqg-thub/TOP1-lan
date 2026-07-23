-- ============================================================
-- Auth Migration: Users, Sessions, Push Tokens
-- Schema: core
-- Run this in Supabase SQL Editor before using the auth system
-- ============================================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS core.users (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone         TEXT UNIQUE NOT NULL,
  name          TEXT,
  password_hash TEXT NOT NULL,
  role          TEXT DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'master', 'super_admin')),
  is_active     BOOLEAN DEFAULT true NOT NULL,
  push_tokens   JSONB DEFAULT '[]'::jsonb,
  metadata      JSONB DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON core.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON core.users(role);

-- 2. Sessions table (refresh tokens)
CREATE TABLE IF NOT EXISTS core.sessions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  refresh_token TEXT UNIQUE NOT NULL,
  user_agent    TEXT,
  ip_address    TEXT,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  revoked_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON core.sessions(refresh_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON core.sessions(user_id);

-- 3. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION core.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON core.users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON core.users
  FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
