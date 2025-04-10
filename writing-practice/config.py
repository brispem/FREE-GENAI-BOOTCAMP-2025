import os
from dotenv import load_dotenv
from pathlib import Path

# Get the root directory (two levels up from config.py)
root_dir = Path(__file__).resolve().parent.parent

# Load environment variables from root .env file
load_dotenv(root_dir / '.env')

# Get OpenAI API key from root .env
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', 'not-configured')
PORT = int(os.getenv('PORT', 7860))

# Update backend URL to use Node.js port
BACKEND_URL = "http://localhost:5174" 