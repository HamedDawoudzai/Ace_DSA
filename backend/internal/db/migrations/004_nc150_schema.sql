-- NC150 schema expansion: drills, attempts, user_progress, password reset

-- Expand drills table
ALTER TABLE drills ADD COLUMN IF NOT EXISTS difficulty TEXT NOT NULL DEFAULT 'medium';
ALTER TABLE drills ADD COLUMN IF NOT EXISTS hint TEXT NOT NULL DEFAULT '';
ALTER TABLE drills ADD COLUMN IF NOT EXISTS time_complexity TEXT NOT NULL DEFAULT '';
ALTER TABLE drills ADD COLUMN IF NOT EXISTS space_complexity TEXT NOT NULL DEFAULT '';
ALTER TABLE drills ADD COLUMN IF NOT EXISTS complexity_choices JSONB NOT NULL DEFAULT '[]';
ALTER TABLE drills ADD COLUMN IF NOT EXISTS correct_complexity_option INTEGER NOT NULL DEFAULT 0;
ALTER TABLE drills ADD COLUMN IF NOT EXISTS complexity_hint TEXT NOT NULL DEFAULT '';
ALTER TABLE drills ADD COLUMN IF NOT EXISTS problem_number INTEGER NOT NULL DEFAULT 0;

-- Expand attempts table
ALTER TABLE attempts ADD COLUMN IF NOT EXISTS is_correct BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE attempts ADD COLUMN IF NOT EXISTS complexity_chosen INTEGER;
ALTER TABLE attempts ADD COLUMN IF NOT EXISTS complexity_correct BOOLEAN;
ALTER TABLE attempts ADD COLUMN IF NOT EXISTS completed BOOLEAN NOT NULL DEFAULT false;

-- User progress (per-user, per-drill completion)
CREATE TABLE IF NOT EXISTS user_progress (
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    drill_id UUID NOT NULL REFERENCES drills (id) ON DELETE CASCADE,
    approach_correct BOOLEAN NOT NULL DEFAULT false,
    complexity_correct BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    UNIQUE (user_id, drill_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_drill ON user_progress (drill_id);

-- Password reset support
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMPTZ;
