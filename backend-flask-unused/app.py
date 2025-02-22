from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
from pathlib import Path

# Basic Flask setup
app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return 'Flask server is running!'

@app.route('/api/launch-activity', methods=['OPTIONS', 'POST'])
def launch_activity():
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    try:
        activity_id = request.json.get('activityId')
        root_dir = Path(__file__).parent.parent
        
        if activity_id == '1':
            cwd = str(root_dir / 'listening-comp' / 'frontend')
            command = ['streamlit', 'run', 'main.py']
        elif activity_id == '2':
            cwd = str(root_dir / 'writing-practice')
            command = ['python', 'app.py']
        else:
            return jsonify({'error': 'Invalid activity ID'}), 400

        process = subprocess.Popen(
            command,
            cwd=cwd
        )
        
        return jsonify({'success': True})

    except Exception as e:
        print(f"Launch error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    try:
        # For now, return placeholder data
        stats = {
            'studySessionCount': 0,
            'wordsLearned': 0,
            'activeGroupCount': 0,
            'successRate': 0
        }
        return jsonify(stats)
    except Exception as e:
        print(f"Error getting dashboard stats: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000) 