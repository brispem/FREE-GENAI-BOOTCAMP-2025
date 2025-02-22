import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is not set. Please set it in your .env file.")

# Update backend URL to use Node.js port
BACKEND_URL = "http://localhost:3001" 