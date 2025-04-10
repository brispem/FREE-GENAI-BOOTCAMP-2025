from flask import Blueprint, jsonify, current_app, redirect, request
from flask_cors import cross_origin
import requests
import base64

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

@activities.route('/api/generate-image', methods=['POST'])
@cross_origin()
def generate_image():
    try:
        data = request.get_json()
        if not data or 'location' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing location parameter'
            }), 400

        location = data['location'].strip()
        print(f"Generating image for location: {location}")  # Debug log

        # Get OpenAI client from app context
        client = current_app.openai_client

        # Generate image using DALL-E 3
        response = client.images.generate(
            model="dall-e-3",  # Using dall-e-3 for high-quality, recognisable images
            prompt=f"A clear, photorealistic image of {location}. The image should be easily recognizable as {location} and suitable for language learning. The scene should be well-lit, centered, and from a typical viewing angle that makes the location immediately identifiable.",
            n=1,
            size="1024x1024",
            quality="standard",
            response_format="b64_json"
        )

        # Get the base64 image data
        image_data = response.data[0].b64_json

        # Return the image data
        return jsonify({
            'success': True,
            'imageUrl': f"data:image/png;base64,{image_data}"
        })

    except Exception as e:
        error_msg = f"Error generating image for '{data.get('location', '')}': {str(e)}"
        print(error_msg)  # More detailed error logging
        return jsonify({
            'success': False,
            'error': error_msg
        }), 500 