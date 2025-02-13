@app.route('/api/sessions', methods=['GET'])
@cross_origin()
def get_sessions():
    try:
        cursor = app.db.cursor()
        cursor.execute("""
            SELECT 
                s.id,
                s.created_at,
                g.name as group_name,
                COUNT(wri.id) as words_reviewed,
                ROUND((SUM(CASE WHEN wri.correct THEN 1 ELSE 0 END) * 100.0) / COUNT(*), 2) as accuracy,
                ROUND((julianday('now') - julianday(s.created_at)) * 24 * 60) as minutes_ago
            FROM study_sessions s
            JOIN groups g ON s.group_id = g.id
            LEFT JOIN word_review_items wri ON wri.session_id = s.id
            GROUP BY s.id
            ORDER BY s.created_at DESC
        """)
        sessions = cursor.fetchall()
        return jsonify(sessions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sessions', methods=['POST'])
@cross_origin()
def create_session():
    try:
        data = request.get_json()
        cursor = app.db.cursor()
        
        # Get words for this group
        cursor.execute("""
            SELECT id FROM words WHERE group_id = ? 
            ORDER BY RANDOM() LIMIT 10
        """, (data['group_id'],))
        words = cursor.fetchall()
        
        # Create session
        cursor.execute("""
            INSERT INTO study_sessions 
            (group_id, activity_type, status, total_words) 
            VALUES (?, ?, 'in_progress', ?)
        """, (data['group_id'], data['activity_type'], len(words)))
        
        session_id = cursor.lastrowid
        
        # Add words to session
        for word in words:
            cursor.execute("""
                INSERT INTO session_words (session_id, word_id)
                VALUES (?, ?)
            """, (session_id, word['id']))
            
        app.db.commit()
        return jsonify({
            'session_id': session_id,
            'words': words,
            'message': 'Session started successfully'
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sessions/<int:session_id>/progress', methods=['POST'])
@cross_origin()
def update_session_progress():
    try:
        data = request.get_json()
        cursor = app.db.cursor()
        
        # Update word result
        cursor.execute("""
            UPDATE session_words 
            SET correct = ?, response_time_ms = ?
            WHERE session_id = ? AND word_id = ?
        """, (data['correct'], data['response_time'], session_id, data['word_id']))
        
        # Update session stats
        cursor.execute("""
            UPDATE study_sessions 
            SET correct_words = (
                SELECT COUNT(*) FROM session_words 
                WHERE session_id = ? AND correct = 1
            )
            WHERE id = ?
        """, (session_id, session_id))
        
        app.db.commit()
        return jsonify({'success': True})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sessions/<int:session_id>/complete', methods=['POST'])
@cross_origin()
def complete_session():
    try:
        cursor = app.db.cursor()
        cursor.execute("""
            UPDATE study_sessions 
            SET status = 'completed', 
                end_time = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (session_id,))
        
        app.db.commit()
        return jsonify({'success': True})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500 