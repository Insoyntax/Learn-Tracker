-- ============================================================================
-- Auth.js v5 Migration: Users alignment + accounts, sessions, verification_tokens
-- ============================================================================
-- This migration aligns the existing users table with Auth.js requirements
-- and creates the additional tables Auth.js needs for OAuth provider support.
-- ============================================================================

-- 1. Alter existing users table to add Auth.js required columns
-- Auth.js expects: id, name, email, emailVerified, image
-- We keep id as SERIAL (integer PK) to avoid breaking FK relationships.
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS image TEXT;

-- 2. Accounts table: stores OAuth provider links (Google, GitHub, etc.)
-- Each row links a user to one OAuth provider account.
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,               -- "oauth", "oidc", "email", etc.
    provider VARCHAR(255) NOT NULL,           -- "google", "github", etc.
    provider_account_id VARCHAR(255) NOT NULL, -- provider's unique user ID
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    token_type VARCHAR(255),
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    UNIQUE(provider, provider_account_id)
);

-- 3. Sessions table: Auth.js expects this table even with JWT strategy
-- (the adapter creates it; we keep it for compatibility)
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ NOT NULL
);

-- 4. Verification tokens: used for email verification flows
CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (identifier, token)
);

-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
