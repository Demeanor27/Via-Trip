-- =====================================================
-- Migration: 001_auth_schema
-- Aligns users table with auth spec (status, token_version)
-- Creates password_reset_tokens table
-- =====================================================

-- Update users table: add status and token_version
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active'
    CONSTRAINT chk_user_status CHECK (status IN ('active', 'deactivated')),
  ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0;

-- Migrate existing is_active data to status
UPDATE users SET status = 'active' WHERE is_active = TRUE OR is_active IS NULL;
UPDATE users SET status = 'deactivated' WHERE is_active = FALSE;

-- Make is_active nullable first, then drop
ALTER TABLE users ALTER COLUMN is_active DROP NOT NULL;

-- Drop reset columns from users (they move to password_reset_tokens)
ALTER TABLE users DROP COLUMN IF EXISTS reset_token;
ALTER TABLE users DROP COLUMN IF EXISTS reset_token_expires_at;

-- password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64)  NOT NULL,
  expires_at TIMESTAMPTZ  NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user
  ON password_reset_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_hash
  ON password_reset_tokens(token_hash);
