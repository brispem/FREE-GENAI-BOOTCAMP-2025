from flask import request, jsonify, g
from flask_cors import cross_origin
import json

def load(app):
  @app.route('/api/groups', methods=['GET'])
  @cross_origin()
  def get_groups():
    try:
      cursor = app.db.cursor()
      cursor.execute("""
        SELECT g.id, g.name,
               COUNT(w.id) as total_words,
               COUNT(CASE WHEN wri.correct THEN 1 END) as completed
        FROM groups g
        LEFT JOIN words w ON w.group_id = g.id
        LEFT JOIN word_review_items wri ON w.id = wri.word_id
        GROUP BY g.id
      """)
      groups = cursor.fetchall()
      return jsonify(groups)
    except Exception as e:
      print(f"Error getting groups: {str(e)}")
      return jsonify({"error": str(e)}), 500

  @app.route('/api/groups/<int:group_id>', methods=['GET'])
  @cross_origin()
  def get_group(group_id):
    cursor = app.db.cursor()
    try:
        # Get group details
        cursor.execute("""
            SELECT g.*, 
                   COUNT(w.id) as total_words,
                   COALESCE(AVG(CASE WHEN wri.correct THEN 100 ELSE 0 END), 0) as accuracy,
                   MAX(wri.created_at) as last_practice
            FROM groups g
            LEFT JOIN words w ON w.group_id = g.id
            LEFT JOIN word_review_items wri ON w.id = wri.word_id
            WHERE g.id = ?
            GROUP BY g.id
        """, (group_id,))
        group = cursor.fetchone()

        # Get words in group
        cursor.execute("""
            SELECT w.spanish, w.english,
                   COUNT(CASE WHEN wri.correct THEN 1 END) as correct,
                   COUNT(CASE WHEN NOT wri.correct THEN 1 END) as wrong
            FROM words w
            LEFT JOIN word_review_items wri ON w.id = wri.word_id
            WHERE w.group_id = ?
            GROUP BY w.id
        """, (group_id,))
        words = cursor.fetchall()

        return jsonify({
            "group": group,
            "words": words
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

  @app.route('/groups/<int:id>/words', methods=['GET'])
  @cross_origin()
  def get_group_words(id):
    try:
      cursor = app.db.cursor()
      
      # Get pagination parameters
      page = int(request.args.get('page', 1))
      words_per_page = 10
      offset = (page - 1) * words_per_page

      # Get sorting parameters
      sort_by = request.args.get('sort_by', 'kanji')
      order = request.args.get('order', 'asc')

      # Validate sort parameters
      valid_columns = ['kanji', 'romaji', 'english', 'correct_count', 'wrong_count']
      if sort_by not in valid_columns:
        sort_by = 'kanji'
      if order not in ['asc', 'desc']:
        order = 'asc'

      # First, check if the group exists
      cursor.execute('SELECT name FROM groups WHERE id = ?', (id,))
      group = cursor.fetchone()
      if not group:
        return jsonify({"error": "Group not found"}), 404

      # Query to fetch words with pagination and sorting
      cursor.execute(f'''
        SELECT w.*, 
               COALESCE(wr.correct_count, 0) as correct_count,
               COALESCE(wr.wrong_count, 0) as wrong_count
        FROM words w
        JOIN word_groups wg ON w.id = wg.word_id
        LEFT JOIN word_reviews wr ON w.id = wr.word_id
        WHERE wg.group_id = ?
        ORDER BY {sort_by} {order}
        LIMIT ? OFFSET ?
      ''', (id, words_per_page, offset))
      
      words = cursor.fetchall()

      # Get total words count for pagination
      cursor.execute('''
        SELECT COUNT(*) 
        FROM word_groups 
        WHERE group_id = ?
      ''', (id,))
      total_words = cursor.fetchone()[0]
      total_pages = (total_words + words_per_page - 1) // words_per_page

      # Format the response
      words_data = []
      for word in words:
        words_data.append({
          "id": word["id"],
          "kanji": word["kanji"],
          "romaji": word["romaji"],
          "english": word["english"],
          "correct_count": word["correct_count"],
          "wrong_count": word["wrong_count"]
        })

      return jsonify({
        'words': words_data,
        'total_pages': total_pages,
        'current_page': page
      })
    except Exception as e:
      return jsonify({"error": str(e)}), 500

  # todo GET /groups/:id/words/raw

  @app.route('/groups/<int:id>/study_sessions', methods=['GET'])
  @cross_origin()
  def get_group_study_sessions(id):
    try:
      cursor = app.db.cursor()
      
      # Get pagination parameters
      page = int(request.args.get('page', 1))
      sessions_per_page = 10
      offset = (page - 1) * sessions_per_page

      # Get sorting parameters
      sort_by = request.args.get('sort_by', 'created_at')
      order = request.args.get('order', 'desc')  # Default to newest first

      # Map frontend sort keys to database columns
      sort_mapping = {
        'startTime': 'created_at',
        'endTime': 'last_activity_time',
        'activityName': 'a.name',
        'groupName': 'g.name',
        'reviewItemsCount': 'review_count'
      }

      # Use mapped sort column or default to created_at
      sort_column = sort_mapping.get(sort_by, 'created_at')

      # Get total count for pagination
      cursor.execute('''
        SELECT COUNT(*)
        FROM study_sessions
        WHERE group_id = ?
      ''', (id,))
      total_sessions = cursor.fetchone()[0]
      total_pages = (total_sessions + sessions_per_page - 1) // sessions_per_page

      # Get study sessions for this group with dynamic calculations
      cursor.execute(f'''
        SELECT 
          s.id,
          s.group_id,
          s.study_activity_id,
          s.created_at as start_time,
          (
            SELECT MAX(created_at)
            FROM word_review_items
            WHERE study_session_id = s.id
          ) as last_activity_time,
          a.name as activity_name,
          g.name as group_name,
          (
            SELECT COUNT(*)
            FROM word_review_items
            WHERE study_session_id = s.id
          ) as review_count
        FROM study_sessions s
        JOIN study_activities a ON s.study_activity_id = a.id
        JOIN groups g ON s.group_id = g.id
        WHERE s.group_id = ?
        ORDER BY {sort_column} {order}
        LIMIT ? OFFSET ?
      ''', (id, sessions_per_page, offset))
      
      sessions = cursor.fetchall()
      sessions_data = []
      
      for session in sessions:
        # If there's no last_activity_time, use start_time + 30 minutes
        end_time = session["last_activity_time"]
        if not end_time:
            end_time = cursor.execute('SELECT datetime(?, "+30 minutes")', (session["start_time"],)).fetchone()[0]
        
        sessions_data.append({
          "id": session["id"],
          "group_id": session["group_id"],
          "group_name": session["group_name"],
          "study_activity_id": session["study_activity_id"],
          "activity_name": session["activity_name"],
          "start_time": session["start_time"],
          "end_time": end_time,
          "review_items_count": session["review_count"]
        })

      return jsonify({
        'study_sessions': sessions_data,
        'total_pages': total_pages,
        'current_page': page
      })
    except Exception as e:
      return jsonify({"error": str(e)}), 500