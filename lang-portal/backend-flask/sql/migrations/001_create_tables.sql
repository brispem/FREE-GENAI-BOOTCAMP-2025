CREATE TABLE IF NOT EXISTS vocabulary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spanish TEXT NOT NULL,           -- Spanish word/phrase
    pronunciation TEXT,              -- Optional pronunciation guide
    english TEXT NOT NULL,           -- English translation
    type TEXT NOT NULL,             -- verb, noun, adjective, etc.
    gender TEXT,                    -- masculine/feminine for nouns
    conjugation_group TEXT,         -- ar/er/ir for verbs
    is_irregular BOOLEAN DEFAULT 0, -- For irregular verbs
    notes TEXT,                     -- Additional grammar notes
    group_id INTEGER NOT NULL,      -- The group this word belongs to
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    words_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS study_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,  -- Name of the activity (e.g., "Flashcards", "Quiz")
    url TEXT NOT NULL,  -- The full url of the study activity
    preview_url TEXT    -- The url to the preview image for the activity
);

-- We don't need word_groups table anymore since group_id is in vocabulary table
DROP TABLE IF EXISTS word_groups;

CREATE TABLE IF NOT EXISTS study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,  -- The group of words being studied
    study_activity_id INTEGER NOT NULL,  -- The activity performed
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of the session
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (study_activity_id) REFERENCES study_activities(id)
);

CREATE TABLE IF NOT EXISTS word_review_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL,
    study_session_id INTEGER NOT NULL,  -- Link to study session
    correct BOOLEAN NOT NULL,  -- Whether the answer was correct (true) or wrong (false)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of the review
    FOREIGN KEY (word_id) REFERENCES vocabulary(id),
    FOREIGN KEY (study_session_id) REFERENCES study_sessions(id)
);

-- Insert test data
INSERT OR IGNORE INTO groups (id, name) VALUES (1, 'Verbos Básicos');
INSERT OR IGNORE INTO study_activities (id, name, url, preview_url) 
VALUES (1, 'Practice', '/practice', NULL); 