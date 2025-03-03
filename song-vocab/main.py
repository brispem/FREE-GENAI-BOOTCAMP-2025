from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import json
import logging
from pathlib import Path
from agent import SongLyricsAgent
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,  # Set default level to INFO
    format='%(message)s'  # Simplified format for better readability
)

# Configure specific loggers
logger = logging.getLogger('song_vocab')  # Root logger for our app
logger.setLevel(logging.DEBUG)

# Silence noisy third-party loggers
for noisy_logger in ['httpcore', 'httpx', 'urllib3']:
    logging.getLogger(noisy_logger).setLevel(logging.WARNING)

# Create output directories if they don't exist
lyrics_path = Path("outputs/lyrics")
vocabulary_path = Path("outputs/vocabulary")
lyrics_path.mkdir(parents=True, exist_ok=True)
vocabulary_path.mkdir(parents=True, exist_ok=True)

app = FastAPI()

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LyricsRequest(BaseModel):
    message_request: str

@app.post("/api/agent")
async def get_lyrics(request: LyricsRequest) -> Dict[str, Any]:
    """Process a request to find lyrics and extract vocabulary."""
    try:
        logger.info(f"Received request: {request.message_request}")
        
        # Initialize agent
        agent = SongLyricsAgent(lyrics_path, vocabulary_path)
        
        # Process request
        result = await agent.process_request(request.message_request)
        logger.info(f"Got result: {result}")
        
        # Extract song_id and clean it
        song_id = result.get("song_id", "")
        
        # Clean up the song_id - remove any markdown formatting
        song_id = (song_id.replace('*', '')
                         .replace('`', '')
                         .replace('_', '')
                         .replace(':', '')
                         .replace('Song ID', '')
                         .strip())
        
        # If no valid song_id, try to extract from request
        if not song_id or song_id == "Song" or song_id == "for":
            request_text = request.message_request.lower()
            if "by" in request_text:
                parts = request_text.split("by")
                title = parts[0].replace("find spanish lyrics and vocabulary for the song", "").strip().strip('"')
                artist = parts[1].strip().strip('"')
                song_id = f"{artist.replace(' ', '-')}-{title.replace(' ', '-')}"
            else:
                raise HTTPException(
                    status_code=400,
                    detail="Could not determine song ID from the request"
                )
        
        logger.info(f"Using song_id: {song_id}")
        
        # Check if files exist
        lyrics_file = lyrics_path / f"{song_id}.txt"
        vocab_file = vocabulary_path / f"{song_id}.json"
        
        # If files don't exist, try to save them from the agent's response
        if not lyrics_file.exists() or not vocab_file.exists():
            # Get stored lyrics from agent
            stored_lyrics = agent.get_stored_lyrics()
            if stored_lyrics:
                # Save lyrics
                lyrics_file.write_text(stored_lyrics, encoding='utf-8')
                logger.info(f"Saved lyrics to {lyrics_file}")
                
                # Generate and save vocabulary
                from tools.extract_vocabulary import extract_vocabulary_from_text
                vocabulary = extract_vocabulary_from_text(stored_lyrics)
                with open(vocab_file, 'w', encoding='utf-8') as f:
                    json.dump(vocabulary, f, ensure_ascii=False, indent=2)
                logger.info(f"Saved vocabulary to {vocab_file}")
            else:
                raise HTTPException(
                    status_code=404,
                    detail=f"Could not find or generate lyrics for song: {song_id}"
                )
        
        # Read files
        lyrics = lyrics_file.read_text(encoding='utf-8')
        vocabulary = json.loads(vocab_file.read_text(encoding='utf-8'))
        
        return {
            "song_id": song_id,
            "lyrics": lyrics,
            "vocabulary": vocabulary
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        logger.error("Stack trace:", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )

# Add these endpoints to serve lyrics and vocabulary
@app.get("/api/lyrics/{song_id}")
async def get_lyrics(song_id: str):
    lyrics_path = Path("outputs/lyrics") / f"{song_id}.txt"
    if not lyrics_path.exists():
        raise HTTPException(status_code=404, detail="Lyrics not found")
    
    return FileResponse(lyrics_path)

@app.get("/api/vocabulary/{song_id}")
async def get_vocabulary(song_id: str):
    vocab_path = Path("outputs/vocabulary") / f"{song_id}.json"
    if not vocab_path.exists():
        raise HTTPException(status_code=404, detail="Vocabulary not found")
    
    with open(vocab_path, "r", encoding="utf-8") as f:
        vocabulary = json.load(f)
    
    return vocabulary

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
