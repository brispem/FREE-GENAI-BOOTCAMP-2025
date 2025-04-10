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
        conn = sqlite3.connect('database.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # Enable foreign keys
        cursor.execute('PRAGMA foreign_keys = ON')
        
        # Create migrations table
        create_migrations_table(conn)

        # Run migrations in order
        migrations = [
            '001_create_tables.sql',
            '002_create_study_sessions.sql',
            '003_create_word_review_items.sql',
            '004_add_session_status.sql'
        ]

        for migration in migrations:
            if not has_migration_run(conn, migration):
                print(f"Running migration: {migration}")
                with open(f'sql/migrations/{migration}', 'r') as f:
                    cursor.executescript(f.read())
                cursor.execute("INSERT INTO migrations (migration_name) VALUES (?)", (migration,))
                conn.commit()
                print(f"Completed migration: {migration}")
            else:
                print(f"Skipping already applied migration: {migration}")

        print("All migrations completed successfully")
        
    except Exception as e:
        print(f"Error running migrations: {str(e)}")
        if conn:
            conn.rollback()
        raise
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    run_migrations()
