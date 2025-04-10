from flask import Blueprint, request, jsonify, send_file, current_app
from flask_cors import cross_origin
import os
import io

audio = Blueprint('audio', __name__)

@audio.route('/api/tts', methods=['POST'])
@cross_origin()
def text_to_speech():
    try:
        from flask import current_app
        client = current_app.openai_client  # Get the OpenAI client from the Flask app context
        
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing text parameter'
            }), 400

        text = data['text'].strip()  # Remove any extra whitespace
        print(f"Generating speech for Spanish text: {text}")  # Debug log

        # Generate speech using OpenAI's TTS API with Spanish-specific settings
        response = client.audio.speech.create(
            model="gpt-4o-mini-tts",  # Using requested model
            voice="shimmer",  # Shimmer tends to have better Spanish pronunciation
            input=text,
            speed=0.9,  # Slightly slower for clearer pronunciation
            response_format="mp3"
        )

        # Create a BytesIO object from the response
        audio_data = io.BytesIO(response.content)
        audio_data.seek(0)

        print(f"Successfully generated speech for: {text}")  # Debug log

        # Return the audio file
        return send_file(
            audio_data,
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name='speech.mp3'
        )

    except Exception as e:
        error_msg = f"Error generating speech for '{data.get('text', '')}': {str(e)}"
        print(error_msg)  # More detailed error logging
        return jsonify({
            'success': False,
            'error': error_msg
        }), 500 