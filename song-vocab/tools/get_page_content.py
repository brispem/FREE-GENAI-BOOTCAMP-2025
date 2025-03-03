import aiohttp
from bs4 import BeautifulSoup
from typing import Dict, Optional, Any
import re
import logging
import requests

# Configure logging
logger = logging.getLogger(__name__)

# Define headers for HTTP requests
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0'
}

def get_page_content(url: str) -> Dict[str, Any]:
    """
    Get the content of a web page and extract lyrics if possible.
    
    Args:
        url (str): URL of the web page to get content from
        
    Returns:
        Dict[str, Any]: Dictionary with page content and extracted lyrics
    """
    logger.info(f"Getting content from URL: {url}")
    
    try:
        # Make the request
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        
        # Get the HTML content
        html = response.text
        logger.debug(f"Got HTML content of length {len(html)}")
        
        # Extract the lyrics
        lyrics_data = extract_lyrics_from_html(html, url)
        
        # Log the results
        spanish_lyrics = lyrics_data.get("spanish_lyrics", "")
        english_lyrics = lyrics_data.get("english_lyrics", "")
        metadata = lyrics_data.get("metadata", "")
        
        logger.info(f"Extracted Spanish lyrics: {len(spanish_lyrics)} chars")
        logger.info(f"Extracted English lyrics: {len(english_lyrics)} chars")
        logger.info(f"Extracted metadata: {len(metadata)} chars")
        
        # Return the results
        return {
            "url": url,
            "spanish_lyrics": spanish_lyrics,
            "english_lyrics": english_lyrics,
            "metadata": metadata,
            "success": True
        }
        
    except Exception as e:
        logger.error(f"Error getting page content: {str(e)}", exc_info=True)
        return {
            "url": url,
            "error": str(e),
            "success": False
        }

def extract_lyrics_from_html(html: str, url: str) -> Dict[str, Optional[str]]:
    """
    Extract lyrics from HTML content based on common patterns in lyrics websites.
    """
    logger.info("Starting lyrics extraction from HTML")
    soup = BeautifulSoup(html, 'html.parser')
    
    # Remove script and style elements
    logger.debug("Cleaning HTML content...")
    for element in soup(['script', 'style', 'header', 'footer', 'nav']):
        element.decompose()
    
    # Common patterns for lyrics containers
    lyrics_patterns = [
        # Class patterns
        {"class_": re.compile(r"lyrics?|letra|original|español", re.I)},
        {"class_": re.compile(r"song-content|song-text|track-text", re.I)},
        # ID patterns
        {"id": re.compile(r"lyrics?|letra|original|español", re.I)},
        # Common Spanish lyrics sites patterns
        {"class_": "lyrics_box"},
        {"class_": "letra"},
        {"class_": "english"}
    ]
    
    spanish_lyrics = None
    english_lyrics = None
    metadata = ""
    
    # Try to find lyrics containers
    logger.debug("Searching for lyrics containers...")
    for pattern in lyrics_patterns:
        logger.debug(f"Trying pattern: {pattern}")
        elements = soup.find_all(**pattern)
        logger.debug(f"Found {len(elements)} matching elements")
        
        for element in elements:
            text = clean_text(element.get_text())
            logger.debug(f"Extracted text length: {len(text)} chars")
            
            # Detect if text is primarily Spanish or English
            if is_primarily_spanish(text) and not spanish_lyrics:
                logger.info("Found Spanish lyrics")
                spanish_lyrics = text
            elif not is_primarily_spanish(text) and not english_lyrics:
                logger.info("Found possible English lyrics")
                english_lyrics = text
    
    # If we didn't find lyrics in specific containers, try to find the largest text block
    if not spanish_lyrics:
        logger.debug("No lyrics found in specific containers, looking for largest text block")
        paragraphs = soup.find_all('p')
        paragraphs = sorted(paragraphs, key=lambda p: len(p.get_text()), reverse=True)
        
        for p in paragraphs[:5]:  # Check the 5 largest paragraphs
            text = clean_text(p.get_text())
            if len(text) > 100 and is_primarily_spanish(text):  # Minimum length for lyrics
                logger.info("Found Spanish lyrics in paragraph")
                spanish_lyrics = text
                break
    
    # Extract metadata (title, artist)
    logger.debug("Extracting metadata...")
    title_tags = soup.find_all(['h1', 'h2', 'title'])
    for tag in title_tags:
        tag_text = tag.get_text().strip()
        if tag_text and len(tag_text) < 100:  # Reasonable length for a title
            metadata += tag_text + "\n"
    
    logger.info(f"Extraction complete. Spanish lyrics: {'found' if spanish_lyrics else 'not found'}, "
                f"English lyrics: {'found' if english_lyrics else 'not found'}")
    
    return {
        "spanish_lyrics": spanish_lyrics,
        "english_lyrics": english_lyrics,
        "metadata": metadata.strip()
    }

def clean_text(text: str) -> str:
    """
    Clean extracted text by removing extra whitespace and unnecessary characters.
    """
    logger.debug(f"Cleaning text of length {len(text)}")
    # Remove HTML entities
    text = re.sub(r'&[a-zA-Z]+;', ' ', text)
    # Remove multiple spaces and newlines
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\n\s*\n', '\n', text)
    # Remove leading/trailing whitespace
    result = text.strip()
    logger.debug(f"Text cleaned, new length: {len(result)}")
    return result

def is_primarily_spanish(text: str) -> bool:
    """
    Check if text contains primarily Spanish characters and words.
    """
    # Common Spanish words to check for
    spanish_words = {'el', 'la', 'en', 'de', 'que', 'y', 'con', 'por', 'para'}
    words = set(text.lower().split())
    spanish_word_count = len(words.intersection(spanish_words))
    
    # Check for Spanish-specific characters
    spanish_chars = len(re.findall(r'[áéíóúñ¿¡]', text))
    
    return spanish_word_count > 0 or spanish_chars > 0

def is_primarily_english(text: str) -> bool:
    """
    Check if text contains primarily English words.
    """
    # Common English words to check for
    english_words = {'the', 'and', 'in', 'to', 'of', 'a', 'is', 'that', 'for', 'it'}
    words = set(text.lower().split())
    english_word_count = len(words.intersection(english_words))
    
    # No special characters to check for English
    return english_word_count > 0