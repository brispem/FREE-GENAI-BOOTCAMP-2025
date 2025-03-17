import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Make OPENAI_API_KEY optional
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', 'not-configured')
PORT = int(os.getenv('PORT', 7860))

# Update backend URL to use Node.js port
BACKEND_URL = "http://localhost:3001" 