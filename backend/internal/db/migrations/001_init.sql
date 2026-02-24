-- Ace DSA backend — initial schema (idempotent)

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE TABLE IF NOT EXISTS drills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_category TEXT NOT NULL,
    prompt TEXT NOT NULL,
    choices JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    drill_id UUID NOT NULL REFERENCES drills (id) ON DELETE CASCADE,
    chosen_option INTEGER NOT NULL,
    explanation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_attempts_user_id ON attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_drill_id ON attempts (drill_id);
