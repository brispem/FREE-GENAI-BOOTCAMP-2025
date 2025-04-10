from flask import Flask, g, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from dotenv import load_dotenv
from openai import OpenAI
from pathlib import Path

from lib.db import Db

import routes.words
import routes.groups
import routes.study_sessions as study_sessions
import routes.dashboard
import routes.study_activities
import routes.song_vocabulary
from routes.activities import activities
from routes.audio import audio

# Load environment variables from root directory
root_dir = Path(__file__).resolve().parent.parent.parent
env_path = root_dir / '.env'
load_dotenv(dotenv_path=env_path)

# Get API key
openai_api_key = os.getenv('OPENAI_API_KEY')

def get_allowed_origins(app):
    try:
        cursor = app.db.cursor()
        cursor.execute('SELECT url FROM study_activities')
        urls = cursor.fetchall()
        # Convert URLs to origins (e.g., https://example.com/app -> https://example.com)
        origins = set()
        for url in urls:
            try:
                from urllib.parse import urlparse
                parsed = urlparse(url['url'])
                origin = f"{parsed.scheme}://{parsed.netloc}"
                origins.add(origin)
            except:
                continue
        return list(origins) if origins else ["*"]
    except:
        return ["*"]  # Fallback to allow all origins if there's an error

def create_app(test_config=None):
    app = Flask(__name__)
    
    if test_config is None:
        app.config.from_mapping(
            DATABASE='database.db'
        )
    else:
        app.config.update(test_config)
    
    # Initialize OpenAI client with explicit API key
    app.openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    # Initialize database first since we need it for CORS configuration
    app.db = Db(database=app.config['DATABASE'])
    
    # Get allowed origins from study_activities table
    allowed_origins = get_allowed_origins(app)
    
    # In development, add localhost to allowed origins
    if app.debug:
        allowed_origins.extend(["http://localhost:8080", "http://127.0.0.1:8080"])
    
    # Configure CORS with combined origins
    CORS(app, resources={
        r"/*": {  # Change from /api/* to /* to allow all routes
            "origins": ["http://localhost:5173", "http://localhost:5174"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })

    # Register the blueprints
    app.register_blueprint(activities)
    app.register_blueprint(audio)

    # Close database connection
    @app.teardown_appcontext
    def close_db(exception):
        app.db.close()

    # load routes
    routes.words.load(app)
    routes.groups.load(app)
    study_sessions.load(app)
    routes.dashboard.load(app)
    routes.study_activities.load(app)
    routes.song_vocabulary.load(app)

    @app.route('/api/test', methods=['GET'])
    def test():
        return jsonify({'status': 'ok', 'message': 'Flask server is running'})

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5174)