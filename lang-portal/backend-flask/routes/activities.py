from flask import Blueprint, jsonify, current_app, redirect
from flask_cors import cross_origin
import requests

activities = Blueprint('activities', __name__)

@activities.route('/api/flashcards', methods=['GET'])
@cross_origin()
def get_flashcards():
    try:
        cursor = current_app.db.cursor()
        cursor.execute("""
            SELECT w.id, w.spanish, w.english 
            FROM words w 
            ORDER BY RANDOM() 
            LIMIT 10
        """)
        words = cursor.fetchall()
        
        return jsonify({
            'cards': [
                {
                    'id': word[0],
                    'spanish': word[1],
                    'english': word[2]
                } for word in words
            ]
        })
    except Exception as e:
        print(f"Error in flashcards: {str(e)}")
        return jsonify({'error': str(e)}), 500

@activities.route('/api/writing-practice', methods=['GET'])
@cross_origin()
def writing_practice():
    try:
        # Proxy to the writing practice app running on its default port
        writing_app_url = 'http://localhost:7860'  # Default Gradio port
        return redirect(writing_app_url)
    except Exception as e:
        print(f"Error redirecting to writing practice: {str(e)}")
        return jsonify({'error': str(e)}), 500

@activities.route('/api/listening-practice', methods=['GET'])
@cross_origin()
def get_listening_exercises():
    try:
        cursor = current_app.db.cursor()
        # Get words with audio for listening practice
        cursor.execute("""
            SELECT id, spanish, english 
            FROM words 
            ORDER BY RANDOM() 
            LIMIT 5
        """)
        exercises = cursor.fetchall()
        
        return jsonify({
            'exercises': [
                {
                    'id': ex[0],
                    'spanish': ex[1],
                    'english': ex[2],
                    'audio_url': f'/audio/{ex[0]}.mp3'
                } for ex in exercises
            ]
        })
    except Exception as e:
        print(f"Error in listening practice: {str(e)}")
        return jsonify({'error': str(e)}), 500 