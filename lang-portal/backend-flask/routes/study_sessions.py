from flask import request, jsonify, g
from flask_cors import cross_origin
from datetime import datetime
import math

def load(app):
  # todo /study_sessions POST

  @app.route('/api/study-sessions', methods=['GET'])
  @cross_origin()
  def get_study_sessions():
    try:
      cursor = app.db.cursor()
      
      # Get pagination parameters
      page = request.args.get('page', 1, type=int)
      per_page = request.args.get('per_page', 10, type=int)
      offset = (page - 1) * per_page

      # Get total count
      cursor.execute('''
        SELECT COUNT(*) as count 
        FROM study_sessions ss
        JOIN groups g ON g.id = ss.group_id
        JOIN study_activities sa ON sa.id = ss.study_activity_id
      ''')
      total_count = cursor.fetchone()['count']

      # Get paginated sessions
      cursor.execute('''
        SELECT 
          ss.id,
          ss.group_id,
          g.name as group_name,
          sa.id as activity_id,
          sa.name as activity_name,
          ss.created_at,
          COUNT(wri.id) as review_items_count
        FROM study_sessions ss
        JOIN groups g ON g.id = ss.group_id
        JOIN study_activities sa ON sa.id = ss.study_activity_id
        LEFT JOIN word_review_items wri ON wri.study_session_id = ss.id
        GROUP BY ss.id
        ORDER BY ss.created_at DESC
        LIMIT ? OFFSET ?
      ''', (per_page, offset))
      sessions = cursor.fetchall()

      return jsonify({
        'items': [{
          'id': session['id'],
          'group_id': session['group_id'],
          'group_name': session['group_name'],
          'activity_id': session['activity_id'],
          'activity_name': session['activity_name'],
          'start_time': session['created_at'],
          'end_time': session['created_at'],  # For now, just use the same time since we don't track end time
          'review_items_count': session['review_items_count']
        } for session in sessions],
        'total': total_count,
        'page': page,
        'per_page': per_page,
        'total_pages': math.ceil(total_count / per_page)
      })
    except Exception as e:
      return jsonify({"error": str(e)}), 500

  @app.route('/api/study-sessions/<id>', methods=['GET'])
  @cross_origin()
  def get_study_session(id):
    try:
      cursor = app.db.cursor()
      
      # Get session details
      cursor.execute('''
        SELECT 
          ss.id,
          ss.group_id,
          g.name as group_name,
          sa.id as activity_id,
          sa.name as activity_name,
          ss.created_at,
          COUNT(wri.id) as review_items_count
        FROM study_sessions ss
        JOIN groups g ON g.id = ss.group_id
        JOIN study_activities sa ON sa.id = ss.study_activity_id
        LEFT JOIN word_review_items wri ON wri.study_session_id = ss.id
        WHERE ss.id = ?
        GROUP BY ss.id
      ''', (id,))
      
      session = cursor.fetchone()
      if not session:
        return jsonify({"error": "Study session not found"}), 404

      # Get pagination parameters
      page = request.args.get('page', 1, type=int)
      per_page = request.args.get('per_page', 10, type=int)
      offset = (page - 1) * per_page

      # Get the words reviewed in this session with their review status
      cursor.execute('''
        SELECT 
          w.*,
          COALESCE(SUM(CASE WHEN wri.correct = 1 THEN 1 ELSE 0 END), 0) as session_correct_count,
          COALESCE(SUM(CASE WHEN wri.correct = 0 THEN 1 ELSE 0 END), 0) as session_wrong_count
        FROM words w
        JOIN word_review_items wri ON wri.word_id = w.id
        WHERE wri.study_session_id = ?
        GROUP BY w.id
        ORDER BY w.kanji
        LIMIT ? OFFSET ?
      ''', (id, per_page, offset))
      
      words = cursor.fetchall()

      # Get total count of words
      cursor.execute('''
        SELECT COUNT(DISTINCT w.id) as count
        FROM words w
        JOIN word_review_items wri ON wri.word_id = w.id
        WHERE wri.study_session_id = ?
      ''', (id,))
      
      total_count = cursor.fetchone()['count']

      return jsonify({
        'session': {
          'id': session['id'],
          'group_id': session['group_id'],
          'group_name': session['group_name'],
          'activity_id': session['activity_id'],
          'activity_name': session['activity_name'],
          'start_time': session['created_at'],
          'end_time': session['created_at'],  # For now, just use the same time
          'review_items_count': session['review_items_count']
        },
        'words': [{
          'id': word['id'],
          'kanji': word['kanji'],
          'romaji': word['romaji'],
          'english': word['english'],
          'correct_count': word['session_correct_count'],
          'wrong_count': word['session_wrong_count']
        } for word in words],
        'total': total_count,
        'page': page,
        'per_page': per_page,
        'total_pages': math.ceil(total_count / per_page)
      })
    except Exception as e:
      return jsonify({"error": str(e)}), 500

  @app.route('/api/study-sessions', methods=['POST'])
  @cross_origin()
  def create_session():
    try:
      data = request.get_json()
      if not data or 'group_id' not in data:
        return jsonify({
          'success': False,
          'error': 'Missing group_id in request'
        }), 400

      cursor = app.db.cursor()
      cursor.execute("""
          INSERT INTO study_sessions (group_id, study_activity_id, created_at)
          VALUES (?, 1, CURRENT_TIMESTAMP)
      """, (data['group_id'],))
      app.db.commit()
      session_id = cursor.lastrowid
      return jsonify({
        'success': True,
        'id': session_id,
        'group_id': data['group_id'],
        'study_activity_id': 1
      }), 201
    except Exception as e:
      print(f"Error creating session: {str(e)}")
      return jsonify({
        'success': False,
        'error': str(e)
      }), 500

  @app.route('/api/session-words', methods=['POST'])
  @cross_origin()
  def record_word_review():
    try:
      data = request.get_json()
      if not data or 'session_id' not in data or 'word_id' not in data or 'correct' not in data:
        return jsonify({
          'success': False,
          'error': 'Missing required fields: session_id, word_id, or correct'
        }), 400

      cursor = app.db.cursor()
      cursor.execute("""
          INSERT INTO word_review_items (word_id, study_session_id, correct, created_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      """, (data['word_id'], data['session_id'], 1 if data['correct'] else 0))
      app.db.commit()
      return jsonify({
        'success': True,
        'message': 'Answer recorded successfully'
      }), 201
    except Exception as e:
      print(f"Error recording word review: {str(e)}")
      return jsonify({
        'success': False,
        'error': str(e)
      }), 500

  # todo POST /study_sessions/:id/review

  @app.route('/api/study-sessions/reset', methods=['POST'])
  @cross_origin()
  def reset_study_sessions():
    try:
      cursor = app.db.cursor()
      
      # First delete all word review items since they have foreign key constraints
      cursor.execute('DELETE FROM word_review_items')
      
      # Then delete all study sessions
      cursor.execute('DELETE FROM study_sessions')
      
      app.db.commit()
      
      return jsonify({"message": "Study history cleared successfully"}), 200
    except Exception as e:
      print(f"Error in reset_study_sessions: {str(e)}")  # Add logging
      return jsonify({"error": str(e)}), 500

  @app.route('/api/study-sessions/<id>', methods=['PATCH'])
  @cross_origin()
  def update_study_session(id):
    try:
      data = request.get_json()
      cursor = app.db.cursor()
      
      # Update session fields based on request data
      update_fields = []
      params = []
      
      if 'status' in data:
        update_fields.append('status = ?')
        params.append(data['status'])
      
      if 'end_time' in data:
        update_fields.append('end_time = ?')
        params.append(data['end_time'])
      
      if not update_fields:
        return jsonify({
          'success': False,
          'error': 'No fields to update'
        }), 400
      
      # Add session id to params
      params.append(id)
      
      # Build and execute update query
      query = f"""
        UPDATE study_sessions 
        SET {', '.join(update_fields)}
        WHERE id = ?
      """
      cursor.execute(query, params)
      app.db.commit()
      
      return jsonify({
        'success': True,
        'message': 'Session updated successfully'
      })
      
    except Exception as e:
      print(f"Error updating session: {str(e)}")
      return jsonify({
        'success': False,
        'error': str(e)
      }), 500