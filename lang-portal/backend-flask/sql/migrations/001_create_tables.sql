CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spanish TEXT NOT NULL,           -- Spanish word/phrase
    pronunciation TEXT,              -- Optional pronunciation guide
    english TEXT NOT NULL,           -- English translation
    type TEXT NOT NULL,             -- verb, noun, adjective, etc.
    gender TEXT,                    -- masculine/feminine for nouns
    conjugation_group TEXT,         -- ar/er/ir for verbs
    is_irregular BOOLEAN DEFAULT 0, -- For irregular verbs
    notes TEXT                      -- Additional grammar notes
);

CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    words_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS study_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    preview_url TEXT
);

CREATE TABLE IF NOT EXISTS word_groups (
    word_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    FOREIGN KEY (word_id) REFERENCES words(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE IF NOT EXISTS study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    study_activity_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (study_activity_id) REFERENCES study_activities(id)
);

-- Insert test data
INSERT OR IGNORE INTO groups (id, name) VALUES (1, 'Verbos Básicos');
INSERT OR IGNORE INTO study_activities (id, name, url, preview_url) 
VALUES (1, 'Tarjetas de Memoria', 'http://localhost:8080', '/assets/study_activities/flashcards.png'); 