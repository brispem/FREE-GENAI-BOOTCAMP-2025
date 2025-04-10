import os
from openai import OpenAI
from typing import Optional
from pathlib import Path
import json
from dotenv import load_dotenv

class AudioGenerator:
    def __init__(self):
        """Initialize OpenAI client for TTS"""
        # Get the root .env file path and load it
        root_env_path = Path(__file__).resolve().parent.parent.parent / '.env'
        load_dotenv(root_env_path)
        
        # Initialize OpenAI client with API key from environment
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
            
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.openai.com/v1"  # Explicitly set base URL
        )
        
        # Create audio directory in the static folder of the frontend
        frontend_dir = Path(__file__).resolve().parent.parent / 'frontend'
        self.audio_dir = frontend_dir / 'static' / 'audio'
        self.audio_dir.mkdir(parents=True, exist_ok=True)

    def generate_audio(self, text: str, filename: str) -> Optional[str]:
        """Generate audio for text using OpenAI TTS"""
        try:
            # Create full path for audio file
            audio_file = self.audio_dir / filename
            print(f"Generating audio for text: {text[:100]}...")  # Debug log
            
            # Generate audio using OpenAI TTS
            response = self.client.audio.speech.create(
                model="gpt-4o-mini-tts",  # Using the latest GPT TTS model
                voice="nova",  # Using Nova voice for Spanish
                input=text,
                speed=0.9  # Slightly slower for better comprehension
            )
            
            # Save the audio file
            response.stream_to_file(str(audio_file))
            print(f"Audio saved to: {audio_file}")
            return str(audio_file)
                
        except Exception as e:
            print(f"Error generating audio: {str(e)}")
            print(f"Error type: {type(e)}")
            return None
