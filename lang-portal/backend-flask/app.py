from flask import Flask, g, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from dotenv import load_dotenv
from openai import OpenAI  # Updated import

from lib.db import Db

import routes.words
import routes.groups
import routes.study_sessions as study_sessions
import routes.dashboard
import routes.study_activities
from routes.activities import activities  # Add this import

load_dotenv()
openai_api_key = os.getenv('OPENAI_API_KEY')
if not openai_api_key:
    print("WARNING: OpenAI API key not found in environment variables")
else:
    print("OpenAI API key loaded successfully")

# Initialize the client
client = OpenAI(api_key=openai_api_key)  # New way to initialize

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
            DATABASE='word_bank.db'
        )
    else:
        app.config.update(test_config)
    
    # Initialize database first since we need it for CORS configuration
    app.db = Db(database=app.config['DATABASE'])
    
    # Get allowed origins from study_activities table
    allowed_origins = get_allowed_origins(app)
    
    # In development, add localhost to allowed origins
    if app.debug:
        allowed_origins.extend(["http://localhost:8080", "http://127.0.0.1:8080"])
    
    # Configure CORS with combined origins
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://localhost:5174"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })

    # Register the activities blueprint
    app.register_blueprint(activities)

    # Close database connection
    @app.teardown_appcontext
    def close_db(exception):
        app.db.close()

    # load routes -----------
    routes.words.load(app)
    routes.groups.load(app)
    study_sessions.load(app)
    routes.dashboard.load(app)
    routes.study_activities.load(app)
    
    @app.route('/api/generate-image', methods=['POST'])
    def generate_image():
        if not openai_api_key:
            return jsonify({
                'success': False,
                'error': 'OpenAI API key not configured'
            }), 500
        
        try:
            data = request.json
            location = data.get('location')
            print(f"Generating image for location: {location}")
            
            prompt = f"A simple, clear illustration of a typical Spanish {location} with Spanish signage and architecture, minimalist style"
            
            # Updated API call format
            response = client.images.generate(
                model="dall-e-2",  # or "dall-e-3" for higher quality
                prompt=prompt,
                n=1,
                size="512x512"
            )
            
            image_url = response.data[0].url
            print(f"Image generated successfully: {image_url[:30]}...")
            
            return jsonify({
                'success': True,
                'imageUrl': image_url
            })
        except Exception as e:
            print(f"Error generating image: {str(e)}")
            return jsonify({
                'success': False,
                'error': str(e)
            }), 500

    # Add a simple test route
    @app.route('/api/test', methods=['GET'])
    def test():
        return jsonify({'status': 'ok', 'message': 'Flask server is running'})

    return app

app = create_app()

if __name__ == '__main__':
    app.run(port=5174, debug=True)