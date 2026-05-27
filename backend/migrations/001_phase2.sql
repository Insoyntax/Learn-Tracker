-- ============================================================================
-- Phase 2 Migration: Study Log Timer, Notes with Tags, Level Configs
-- ============================================================================

-- 1. StudyLog: Add timer fields
ALTER TABLE study_logs ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE study_logs ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ;
ALTER TABLE study_logs ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'completed';

-- 2. Notes: Create table with text array tags
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    tags TEXT[] NOT NULL DEFAULT '{}',
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. GIN index for fast tag-based searching
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN (tags);

-- 4. Full-text search support (optional, helps with ?search= queries)
CREATE INDEX IF NOT EXISTS idx_notes_title_content ON notes USING GIN (
    to_tsvector('english', title || ' ' || content)
);

-- 5. Level Configs: Lookup table for XP thresholds
CREATE TABLE IF NOT EXISTS level_configs (
    level INTEGER PRIMARY KEY,
    min_xp INTEGER NOT NULL,
    max_xp INTEGER NOT NULL,
    title_badge VARCHAR(100) NOT NULL DEFAULT ''
);

-- Seed default level configs
INSERT INTO level_configs (level, min_xp, max_xp, title_badge) VALUES
    (1,    0,   99,  'Novice'),
    (2,  100,  299,  'Apprentice'),
    (3,  300,  599,  'Scholar'),
    (4,  600,  999,  'Adept'),
    (5, 1000, 1499,  'Expert'),
    (6, 1500, 2099,  'Master'),
    (7, 2100, 2799,  'Grandmaster'),
    (8, 2800, 3599,  'Legend'),
    (9, 3600, 4499,  'Mythic'),
    (10, 4500, 99999, 'Transcendent')
ON CONFLICT (level) DO NOTHING;
