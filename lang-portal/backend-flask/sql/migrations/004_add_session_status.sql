ALTER TABLE study_sessions ADD COLUMN status TEXT DEFAULT 'in_progress';
ALTER TABLE study_sessions ADD COLUMN end_time DATETIME; 