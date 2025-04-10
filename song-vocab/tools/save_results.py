from typing import List, Dict, Any, Union
import json
import logging
from pathlib import Path
import re

logger = logging.getLogger('song_vocab')

def save_results(song_id: str, lyrics: Union[str, Dict[str, str]], vocabulary: List[Dict[str, Any]], lyrics_path: Path, vocabulary_path: Path) -> Dict[str, Any]:
    """
    Save lyrics and vocabulary to their respective files.
    
    Args:
        song_id (str): ID of the song
        lyrics (Union[str, Dict[str, str]]): Lyrics text or dictionary with lyrics
        vocabulary (List[Dict[str, Any]]): List of vocabulary items
        lyrics_path (Path): Directory to save lyrics files
        vocabulary_path (Path): Directory to save vocabulary files
    
    Returns:
        Dict[str, Any]: The song_id that was used to save the files
    """
    # Create directories if they don't exist
    lyrics_path.mkdir(parents=True, exist_ok=True)
    vocabulary_path.mkdir(parents=True, exist_ok=True)
    
    # Save lyrics
    lyrics_file = lyrics_path / f"{song_id}.txt"
    
    # Handle both string and dictionary formats for lyrics
    if isinstance(lyrics, dict):
        # If lyrics is a dictionary, extract the Spanish lyrics
        lyrics_text = lyrics.get("spanish_lyrics", "")
    else:
        # If lyrics is already a string, use it directly
        lyrics_text = lyrics
    
    # Print debug information
    print(f"Saving lyrics to {lyrics_file}")
    print(f"Lyrics type: {type(lyrics)}")
    print(f"Lyrics content (first 500 chars): {str(lyrics)[:500]}...")
    
    # Handle empty lyrics
    if not lyrics_text or lyrics_text.strip() == "":
        lyrics_text = "No lyrics found for this song."
    
    # Decode escape sequences in the lyrics
    try:
        # Try to decode JSON-style escape sequences
        if '\\u' in lyrics_text:
            lyrics_text = json.loads(f'"{lyrics_text}"')
    except Exception as e:
        logger.warning(f"Failed to decode escape sequences in lyrics: {e}")
    
    lyrics_file.write_text(lyrics_text)
    logger.info(f"Saved lyrics to {lyrics_file}")
    
    # Save vocabulary
    vocab_file = vocabulary_path / f"{song_id}.json"
    
    # Print debug information
    print(f"Saving vocabulary to {vocab_file}")
    print(f"Vocabulary type: {type(vocabulary)}")
    print(f"Vocabulary content: {vocabulary}")
    
    # Handle empty vocabulary
    if not vocabulary:
        vocabulary = [
            {
                "spanish": "No vocabulary found",
                "pronunciation": "",
                "english": "No vocabulary found",
                "type": "unknown",
                "notes": "Vocabulary extraction failed"
            }
        ]
    
    # If we have lyrics but no vocabulary, extract vocabulary from the lyrics
    if lyrics_text and lyrics_text != "No lyrics found for this song." and (not vocabulary or len(vocabulary) < 5 or vocabulary[0]["spanish"] == "No vocabulary found"):
        try:
            # Try to use the enhanced vocabulary extraction
            from .extract_vocabulary import generate_enhanced_fallback_vocabulary
            vocabulary = generate_enhanced_fallback_vocabulary(lyrics_text)
            logger.info(f"Generated enhanced vocabulary from lyrics: {len(vocabulary)} items")
        except Exception as e:
            logger.error(f"Failed to generate enhanced vocabulary from lyrics: {e}")
            try:
                # Fall back to basic extraction
                from .extract_vocabulary import generate_fallback_vocabulary
                vocabulary = generate_fallback_vocabulary(lyrics_text)
                logger.info(f"Generated basic vocabulary from lyrics: {len(vocabulary)} items")
            except Exception as e2:
                logger.error(f"Failed to generate basic vocabulary from lyrics: {e2}")
    
    # Ensure all vocabulary items have the required fields
    for item in vocabulary:
        if not isinstance(item, dict):
            continue
            
        # Ensure all required fields are present
        for field in ["spanish", "pronunciation", "english", "type", "notes"]:
            if field not in item:
                item[field] = ""
        
        # Optional fields
        if "conjugation_group" not in item:
            item["conjugation_group"] = None
        if "is_irregular" not in item:
            item["is_irregular"] = False
        if "gender" not in item:
            item["gender"] = None
    
    vocab_file.write_text(json.dumps(vocabulary, ensure_ascii=False, indent=2))
    logger.info(f"Saved vocabulary to {vocab_file}")
    
    return {"song_id": song_id}

def clean_lyrics(lyrics: str) -> str:
    """Clean lyrics text before saving."""
    # Remove metadata and translations
    patterns_to_remove = [
        r'lyrics views \d+[,\.]?\d*',
        r'\d+ Contributors.*?Lyrics',
        r'(Translations|English).*?Lyrics',  # Removed Deutsch
        r'Translation Meaning.*?\n',
    ]
    
    for pattern in patterns_to_remove:
        lyrics = re.sub(pattern, '', lyrics, flags=re.DOTALL)
    
    return lyrics.strip()
