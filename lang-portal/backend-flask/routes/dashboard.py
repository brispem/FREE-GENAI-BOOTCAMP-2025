from flask import jsonify
from flask_cors import cross_origin
from datetime import datetime, timedelta
import json

def load(app):
    @app.route('/dashboard/recent-session', methods=['GET'])
    @cross_origin()
    def get_recent_session():
        try:
            cursor = app.db.cursor()
            
            # Get the most recent study session with activity name and results
            cursor.execute('''
                SELECT 
                    ss.id,
                    ss.group_id,
                    sa.name as activity_name,
                    ss.created_at,
                    COUNT(CASE WHEN wri.correct = 1 THEN 1 END) as correct_count,
                    COUNT(CASE WHEN wri.correct = 0 THEN 1 END) as wrong_count
                FROM study_sessions ss
                JOIN study_activities sa ON ss.study_activity_id = sa.id
                LEFT JOIN word_review_items wri ON ss.id = wri.study_session_id
                GROUP BY ss.id
                ORDER BY ss.created_at DESC
                LIMIT 1
            ''')
            
            session = cursor.fetchone()
            
            if not session:
                return jsonify(None)
            
            return jsonify({
                "id": session["id"],
                "group_id": session["group_id"],
                "activity_name": session["activity_name"],
                "created_at": session["created_at"],
                "correct_count": session["correct_count"],
                "wrong_count": session["wrong_count"]
            })
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/dashboard/stats', methods=['GET'])
    @cross_origin()
    def get_study_stats():
        try:
            cursor = app.db.cursor()
            
            # Get total vocabulary count
            cursor.execute('SELECT COUNT(*) as total_vocabulary FROM words')
            total_vocabulary = cursor.fetchone()["total_vocabulary"]

            # Get total unique words studied
            cursor.execute('''
                SELECT COUNT(DISTINCT word_id) as total_words
                FROM word_review_items wri
                JOIN study_sessions ss ON wri.study_session_id = ss.id
            ''')
            total_words = cursor.fetchone()["total_words"]
            
            # Get mastered words (words with >80% success rate and at least 5 attempts)
            cursor.execute('''
                WITH word_stats AS (
                    SELECT 
                        word_id,
                        COUNT(*) as total_attempts,
                        SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) * 1.0 / COUNT(*) as success_rate
                    FROM word_review_items wri
                    JOIN study_sessions ss ON wri.study_session_id = ss.id
                    GROUP BY word_id
                    HAVING total_attempts >= 5
                )
                SELECT COUNT(*) as mastered_words
                FROM word_stats
                WHERE success_rate >= 0.8
            ''')
            mastered_words = cursor.fetchone()["mastered_words"]
            
            # Get overall success rate
            cursor.execute('''
                SELECT 
                    SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) * 1.0 / COUNT(*) as success_rate
                FROM word_review_items wri
                JOIN study_sessions ss ON wri.study_session_id = ss.id
            ''')
            success_rate = cursor.fetchone()["success_rate"] or 0
            
            # Get total number of study sessions
            cursor.execute('SELECT COUNT(*) as total_sessions FROM study_sessions')
            total_sessions = cursor.fetchone()["total_sessions"]
            
            # Get number of groups with activity in the last 30 days
            cursor.execute('''
                SELECT COUNT(DISTINCT group_id) as active_groups
                FROM study_sessions
                WHERE created_at >= date('now', '-30 days')
            ''')
            active_groups = cursor.fetchone()["active_groups"]
            
            # Calculate current streak (consecutive days with at least one study session)
            cursor.execute('''
                WITH daily_sessions AS (
                    SELECT 
                        date(created_at) as study_date,
                        COUNT(*) as session_count
                    FROM study_sessions
                    GROUP BY date(created_at)
                ),
                streak_calc AS (
                    SELECT 
                        study_date,
                        julianday(study_date) - julianday(lag(study_date, 1) over (order by study_date)) as days_diff
                    FROM daily_sessions
                )
                SELECT COUNT(*) as streak
                FROM (
                    SELECT study_date
                    FROM streak_calc
                    WHERE days_diff = 1 OR days_diff IS NULL
                    ORDER BY study_date DESC
                )
            ''')
            current_streak = cursor.fetchone()["streak"]
            
            return jsonify({
                "total_vocabulary": total_vocabulary,
                "total_words_studied": total_words,
                "mastered_words": mastered_words,
                "success_rate": success_rate,
                "total_sessions": total_sessions,
                "active_groups": active_groups,
                "current_streak": current_streak
            })
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/dashboard/stats', methods=['GET'])
    @cross_origin()
    def get_dashboard_stats():
        try:
            cursor = app.db.cursor()
            
            # Get total study sessions count
            cursor.execute("""
                SELECT COUNT(*) as count
                FROM study_sessions
            """)
            study_sessions = cursor.fetchone()['count']
            
            # Get total words learned (words that have been practiced at least once)
            cursor.execute("""
                SELECT COUNT(DISTINCT word_id) as count
                FROM word_review_items
            """)
            words_learned = cursor.fetchone()['count']
            
            # Get active groups (groups with activity in the last 30 days)
            cursor.execute("""
                SELECT COUNT(DISTINCT group_id) as count
                FROM study_sessions
                WHERE created_at >= datetime('now', '-30 days')
            """)
            active_groups = cursor.fetchone()['count']
            
            # Calculate overall success rate
            cursor.execute("""
                SELECT 
                    ROUND(
                        (CAST(SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) AS FLOAT) / 
                        CAST(COUNT(*) AS FLOAT)) * 100
                    ) as success_rate
                FROM word_review_items
            """)
            result = cursor.fetchone()
            success_rate = result['success_rate'] if result['success_rate'] is not None else 0
            
            return jsonify({
                'study_sessions': study_sessions,
                'words_learned': words_learned,
                'active_groups': active_groups,
                'success_rate': success_rate
            })
            
        except Exception as e:
            print(f"Dashboard stats error: {str(e)}")
            return jsonify({"error": str(e)}), 500

    @app.route('/api/progress', methods=['GET'])
    @cross_origin()
    def get_progress():
        try:
            cursor = app.db.cursor()
            
            # Get total words in curriculum
            cursor.execute('SELECT COUNT(*) as total FROM vocabulary')
            total_words = cursor.fetchone()['total']
            
            # Get words attempted at least once
            cursor.execute('''
                SELECT COUNT(DISTINCT word_id) as count
                FROM word_review_items
            ''')
            words_attempted = cursor.fetchone()['count']
            
            # Get mastery level distribution
            cursor.execute('''
                WITH word_stats AS (
                    SELECT 
                        word_id,
                        COUNT(*) as attempts,
                        AVG(CASE WHEN correct = 1 THEN 100.0 ELSE 0 END) as accuracy
                    FROM word_review_items
                    GROUP BY word_id
                    HAVING attempts >= 3
                )
                SELECT 
                    COUNT(CASE WHEN accuracy >= 80 THEN 1 END) as mastered,
                    COUNT(CASE WHEN accuracy >= 60 AND accuracy < 80 THEN 1 END) as proficient,
                    COUNT(CASE WHEN accuracy >= 40 AND accuracy < 60 THEN 1 END) as learning,
                    COUNT(CASE WHEN accuracy < 40 THEN 1 END) as needs_practice
                FROM word_stats
            ''')
            mastery = cursor.fetchone()
            
            # Get group progress
            cursor.execute('''
                WITH group_stats AS (
                    SELECT 
                        g.id,
                        g.name,
                        COUNT(DISTINCT v.id) as total_words,
                        COUNT(DISTINCT wri.word_id) as words_attempted,
                        COALESCE(AVG(CASE WHEN wri.correct = 1 THEN 100.0 ELSE 0 END), 0) as accuracy
                    FROM groups g
                    LEFT JOIN vocabulary v ON v.group_id = g.id
                    LEFT JOIN word_review_items wri ON v.id = wri.word_id
                    GROUP BY g.id, g.name
                )
                SELECT 
                    id,
                    name,
                    total_words,
                    words_attempted,
                    accuracy
                FROM group_stats
                ORDER BY name
            ''')
            groups = cursor.fetchall()
            
            # Get success rate trend (last 7 days)
            cursor.execute('''
                WITH RECURSIVE dates(date) AS (
                    SELECT date('now', '-6 days')
                    UNION ALL
                    SELECT date(date, '+1 day')
                    FROM dates
                    WHERE date < date('now')
                ),
                daily_stats AS (
                    SELECT 
                        date(wri.created_at) as day,
                        AVG(CASE WHEN wri.correct = 1 THEN 100.0 ELSE 0 END) as daily_accuracy
                    FROM word_review_items wri
                    WHERE wri.created_at >= date('now', '-6 days')
                    GROUP BY date(wri.created_at)
                )
                SELECT 
                    dates.date as day,
                    COALESCE(daily_stats.daily_accuracy, 0) as accuracy
                FROM dates
                LEFT JOIN daily_stats ON dates.date = daily_stats.day
                ORDER BY dates.date
            ''')
            trend = cursor.fetchall()
            
            return jsonify({
                'overview': {
                    'total_words': total_words,
                    'words_attempted': words_attempted,
                    'completion_rate': (words_attempted / total_words * 100) if total_words > 0 else 0
                },
                'mastery_levels': {
                    'mastered': mastery['mastered'],
                    'proficient': mastery['proficient'],
                    'learning': mastery['learning'],
                    'needs_practice': mastery['needs_practice']
                },
                'groups': [{
                    'id': group['id'],
                    'name': group['name'],
                    'total_words': group['total_words'],
                    'words_attempted': group['words_attempted'],
                    'completion_rate': (group['words_attempted'] / group['total_words'] * 100) if group['total_words'] > 0 else 0,
                    'accuracy': group['accuracy']
                } for group in groups],
                'trend': [{
                    'day': day['day'],
                    'accuracy': day['accuracy']
                } for day in trend]
            })
            
        except Exception as e:
            print(f"Error getting progress: {str(e)}")
            return jsonify({"error": str(e)}), 500
