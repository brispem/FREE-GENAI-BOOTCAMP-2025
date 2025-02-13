import sqlite3
import os

def create_migrations_table(conn):
    conn.execute("""
        CREATE TABLE IF NOT EXISTS migrations (
            id INTEGER PRIMARY KEY,
            migration_name TEXT NOT NULL,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()

def has_migration_run(conn, migration_name):
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM migrations WHERE migration_name = ?", (migration_name,))
    return cursor.fetchone() is not None

def run_migrations():
    try:
        # Remove existing database
        if os.path.exists('word_bank.db'):
            os.remove('word_bank.db')
            
        conn = sqlite3.connect('word_bank.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # Enable foreign keys
        cursor.execute('PRAGMA foreign_keys = ON')

        # Run migrations in order
        migrations = [
            '001_create_tables.sql',
            '002_create_study_sessions.sql',
            '003_create_word_review_items.sql'
        ]

        for migration in migrations:
            with open(f'sql/migrations/{migration}', 'r') as f:
                cursor.executescript(f.read())
                print(f"Executed migration: {migration}")

        # Insert test data
        cursor.execute("INSERT OR IGNORE INTO groups (id, name) VALUES (1, 'Test Group')")
        cursor.execute("INSERT OR IGNORE INTO study_activities (id, name, url) VALUES (1, 'Flashcards', 'http://localhost:8080')")
        
        conn.commit()
        print("Migrations completed successfully")
        
    except Exception as e:
        print(f"Error running migrations: {str(e)}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == '__main__':
    run_migrations()
