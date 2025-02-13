import sqlite3

def check_tables():
    conn = sqlite3.connect('word_bank.db')
    cursor = conn.cursor()
    
    # Check tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Tables in database:", tables)
    
    # Check groups data
    cursor.execute("SELECT * FROM groups;")
    groups = cursor.fetchall()
    print("\nGroups:", groups)
    
    # Check study_activities data
    cursor.execute("SELECT * FROM study_activities;")
    activities = cursor.fetchall()
    print("\nActivities:", activities)

if __name__ == '__main__':
    check_tables() 