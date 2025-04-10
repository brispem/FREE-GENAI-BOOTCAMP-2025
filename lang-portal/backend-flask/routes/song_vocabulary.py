from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import sys
import os
import time
from pathlib import Path
from openai import OpenAI

# Add song-vocab to Python path
song_vocab_path = Path(__file__).parent.parent.parent.parent / 'song-vocab'
sys.path.append(str(song_vocab_path))

from agent import SongLyricsAgent

song_vocabulary = Blueprint('song_vocabulary', __name__)

def wait_for_files(lyrics_path: Path, vocabulary_path: Path, song_id: str, max_wait: int = 30) -> bool:
    """Wait for both lyrics and vocabulary files to be created."""
    lyrics_file = lyrics_path / f"{song_id}.txt"
    vocabulary_file = vocabulary_path / f"{song_id}.json"
    
    start_time = time.time()
    while time.time() - start_time < max_wait:
        if lyrics_file.exists() and vocabulary_file.exists():
            return True
        time.sleep(1)
    return False

def load(app):
    @song_vocabulary.route('/api/song-vocabulary/search', methods=['POST'])
    @cross_origin()
    def search():
        try:
            data = request.get_json()
            message = data.get('message_request')
            if not message:
                return jsonify({'error': 'No message provided'}), 400

            # Initialize the agent with paths in the song-vocab directory
            lyrics_path = song_vocab_path / 'outputs' / 'lyrics'
            vocabulary_path = song_vocab_path / 'outputs' / 'vocabulary'
            
            # Create directories if they don't exist
            lyrics_path.mkdir(parents=True, exist_ok=True)
            vocabulary_path.mkdir(parents=True, exist_ok=True)
            
            # Initialize agent with app's OpenAI client
            agent = SongLyricsAgent(lyrics_path, vocabulary_path)
            agent.client = OpenAI(
                api_key=os.getenv('OPENAI_API_KEY'),
                base_url="https://api.openai.com/v1"
            )
            
            # Process the request
            import asyncio
            result = asyncio.run(agent.process_request(message))
            
            if not result.get('song_id'):
                return jsonify({'error': 'Failed to process song'}), 500
                
            # Wait for files to be created
            song_id = result['song_id']
            if not wait_for_files(lyrics_path, vocabulary_path, song_id):
                return jsonify({'error': 'Timeout waiting for files to be created'}), 500
                
            return jsonify({'song_id': song_id})

        except Exception as e:
            print(f"Error in song vocabulary search: {str(e)}")
            return jsonify({'error': str(e)}), 500

    @song_vocabulary.route('/api/song-vocabulary/lyrics/<song_id>', methods=['GET'])
    @cross_origin()
    def get_lyrics(song_id):
        try:
            lyrics_file = song_vocab_path / 'outputs' / 'lyrics' / f"{song_id}.txt"
            if not lyrics_file.exists():
                return jsonify({'error': 'Lyrics not found'}), 404
                
            with open(lyrics_file, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @song_vocabulary.route('/api/song-vocabulary/vocabulary/<song_id>', methods=['GET'])
    @cross_origin()
    def get_vocabulary(song_id):
        try:
            vocabulary_file = song_vocab_path / 'outputs' / 'vocabulary' / f"{song_id}.json"
            if not vocabulary_file.exists():
                return jsonify({'error': 'Vocabulary not found'}), 404
                
            with open(vocabulary_file, 'r', encoding='utf-8') as f:
                import json
                return jsonify(json.load(f))
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # Register the blueprint
    app.register_blueprint(song_vocabulary) 