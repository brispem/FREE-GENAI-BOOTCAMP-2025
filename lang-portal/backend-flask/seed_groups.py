import sqlite3

def seed_groups():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Insert initial groups
    groups = [
        (1, 'Core Verbs'),
        (2, 'Common Phrases'),
        (3, 'Travel Vocabulary')
    ]
    
    try:
        # Delete existing groups
        cursor.execute('DELETE FROM groups')
        
        # Reset the autoincrement counter
        cursor.execute('DELETE FROM sqlite_sequence WHERE name="groups"')
        
        # Insert new groups
        cursor.executemany('INSERT INTO groups (id, name) VALUES (?, ?)', groups)
        conn.commit()
        print("Groups inserted successfully")
    except sqlite3.Error as e:
        print(f"Error inserting groups: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    seed_groups() 