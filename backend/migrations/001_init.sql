-- Ace DSA backend â€” initial schema

CREATE TABLE IF NOT EXISTS attempts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     TEXT    NOT NULL,
    drill_id    TEXT    NOT NULL,
    chosen_option TEXT  NOT NULL,
    explanation TEXT    NOT NULL DEFAULT '',
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
