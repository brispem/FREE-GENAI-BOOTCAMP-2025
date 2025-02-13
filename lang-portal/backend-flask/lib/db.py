import sqlite3
import json
from flask import g

class Db:
  def __init__(self, database='words.db'):
    self.database = database
    self.connection = None

  def get(self):
    if 'db' not in g:
      g.db = sqlite3.connect(self.database)
      g.db.row_factory = sqlite3.Row  # Return rows as dictionaries
    return g.db

  def commit(self):
    self.get().commit()

  def cursor(self):
    # Ensure the connection is valid before getting a cursor
    connection = self.get()
    return connection.cursor()

  def close(self):
    db = g.pop('db', None)
    if db is not None:
      db.close()

  # Function to load SQL from a file
  def sql(self, filepath):
    with open('sql/' + filepath, 'r') as file:
      return file.read()

  # Function to load the words from a JSON file
  def load_json(self, filepath):
    with open(filepath, 'r') as file:
      return json.load(file)

  def setup_tables(self,cursor):
    # Create the necessary tables
    cursor.execute(self.sql('setup/create_table_words.sql'))
    self.get().commit()

    cursor.execute(self.sql('setup/create_table_word_reviews.sql'))
    self.get().commit()

    cursor.execute(self.sql('setup/create_table_word_review_items.sql'))
    self.get().commit()

    cursor.execute(self.sql('setup/create_table_groups.sql'))
    self.get().commit()

    cursor.execute(self.sql('setup/create_table_word_groups.sql'))
    self.get().commit()

    cursor.execute(self.sql('setup/create_table_study_activities.sql'))
    self.get().commit()

    cursor.execute(self.sql('setup/create_table_study_sessions.sql'))
    self.get().commit()

  def import_study_activities_json(self,cursor,data_json_path):
    study_actvities = self.load_json(data_json_path)
    for activity in study_actvities:
      cursor.execute('''
      INSERT INTO study_activities (name,url,preview_url) VALUES (?,?,?)
      ''', (activity['name'],activity['url'],activity['preview_url'],))
    self.get().commit()

  def import_word_json(self, cursor, group_name, data_json_path):
    # Insert a new group
    cursor.execute('INSERT INTO groups (name) VALUES (?)', (group_name,))
    self.get().commit()

    # Get the group ID
    cursor.execute('SELECT id FROM groups WHERE name = ?', (group_name,))
    group_id = cursor.fetchone()[0]

    # Insert words from JSON file
    words = self.load_json(data_json_path)

    for word in words:
        cursor.execute('''
            INSERT INTO words (
                spanish, pronunciation, english, type,
                gender, conjugation_group, is_irregular, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            word['spanish'],
            word.get('pronunciation'),
            word['english'],
            word['type'],
            word.get('gender'),
            word.get('conjugation_group'),
            word.get('is_irregular', False),
            word.get('notes')
        ))
        
        word_id = cursor.lastrowid
        
        # Link word to group
        cursor.execute('''
            INSERT INTO word_groups (word_id, group_id) 
            VALUES (?, ?)
        ''', (word_id, group_id))
    
    self.get().commit()

  # Initialize the database with sample data
  def init(self, app):
    with app.app_context():
      cursor = self.cursor()
      self.setup_tables(cursor)
      self.import_word_json(
        cursor=cursor,
        group_name='Core Verbs',
        data_json_path='seed/data_verbs.json'
      )
      self.import_word_json(
        cursor=cursor,
        group_name='Core Adjectives',
        data_json_path='seed/data_adjectives.json'
      )

      self.import_study_activities_json(
        cursor=cursor,
        data_json_path='seed/study_activities.json'
      )

# Create an instance of the Db class
db = Db()
