from typing import List, Optional
import instructor
# import ollama  # Commented out for OpenAI usage
import logging
from pydantic import BaseModel
from pathlib import Path
import os
import openai  # Add OpenAI import
import re
import json

# Configure logging
logger = logging.getLogger(__name__)



class VocabularyItem(BaseModel):
    spanish: str
    pronunciation: str
    english: str
    type: str
    conjugation_group: Optional[str] = None
    is_irregular: bool = False
    gender: Optional[str] = None
    notes: Optional[str] = None

class VocabularyResponse(BaseModel):
    vocabulary: List[VocabularyItem]

def extract_vocabulary(text: str) -> List[dict]:
    """
    Extract ALL vocabulary from Spanish text using OpenAI with structured output.
    
    Args:
        text (str): The text to extract vocabulary from
        
    Returns:
        List[dict]: Complete list of vocabulary items in Spanish format
    """
    logger.info("Starting vocabulary extraction")
    logger.debug(f"Input text length: {len(text)} characters")
    
    # Make sure we have enough text to work with
    if len(text) < 10:
        logger.warning(f"Text is too short ({len(text)} chars), returning empty vocabulary")
        return []
    
    try:
        # Initialize OpenAI client with instructor
        logger.debug("Initializing OpenAI client with instructor")
        openai.api_key = os.getenv("OPENAI_API_KEY")
        client = instructor.patch(openai.Client())
        
        # Split text into chunks if it's too long
        chunks = split_text_into_chunks(text, max_length=1000)
        logger.info(f"Split text into {len(chunks)} chunks")
        
        all_vocabulary = []
        
        # Process each chunk
        for i, chunk in enumerate(chunks):
            logger.info(f"Processing chunk {i+1}/{len(chunks)}")
            
            # Create a direct prompt for this chunk
            prompt = f"""
            Extract Spanish vocabulary from this song lyrics with English translations.
            
            For each word or phrase, provide:
            1. The Spanish word/phrase exactly as it appears in the text
            2. A pronunciation guide
            3. The English translation
            4. The type (noun, verb, adjective, etc.)
            5. For verbs: conjugation group (ar/er/ir) and whether it's irregular
            6. For nouns: gender (masculine/feminine)
            7. Notes about usage or context in the song
            
            Lyrics chunk:
            {chunk}
            
            Format each item as a JSON object with these fields:
            - spanish: the Spanish word or phrase
            - pronunciation: pronunciation guide
            - english: the English translation
            - type: the part of speech
            - conjugation_group: for verbs (null for non-verbs)
            - is_irregular: true/false for verbs
            - gender: for nouns (null for non-nouns)
            - notes: any additional information
            """
            
            try:
                # Use GPT-3.5 for faster processing
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.2,
                    response_format={"type": "json_object"}
                )
                
                # Parse the JSON response
                content = response.choices[0].message.content
                result = json.loads(content)
                
                # Extract the vocabulary items
                items = []
                if "vocabulary" in result:
                    items = result["vocabulary"]
                elif isinstance(result, list):
                    items = result
                else:
                    # Try to find any array in the response
                    for key, value in result.items():
                        if isinstance(value, list) and len(value) > 0:
                            items = value
                            break
                
                # Add to our collection
                all_vocabulary.extend(items)
                logger.info(f"Added {len(items)} items from chunk {i+1}")
                
            except Exception as e:
                logger.error(f"Error processing chunk {i+1}: {e}")
        
        # Deduplicate by Spanish word
        seen_words = set()
        unique_vocabulary = []
        
        for item in all_vocabulary:
            # Ensure all required fields are present
            if not isinstance(item, dict):
                continue
                
            spanish = item.get("spanish", "").lower()
            if spanish and spanish not in seen_words:
                seen_words.add(spanish)
                
                # Ensure all fields are present
                complete_item = {
                    "spanish": item.get("spanish", ""),
                    "pronunciation": item.get("pronunciation", ""),
                    "english": item.get("english", ""),
                    "type": item.get("type", "unknown"),
                    "conjugation_group": item.get("conjugation_group"),
                    "is_irregular": item.get("is_irregular", False),
                    "gender": item.get("gender"),
                    "notes": item.get("notes", "")
                }
                
                unique_vocabulary.append(complete_item)
        
        logger.info(f"Extracted {len(unique_vocabulary)} unique vocabulary items")
        return unique_vocabulary
        
    except Exception as e:
        logger.error(f"Failed to extract vocabulary: {str(e)}", exc_info=True)
        # Return an empty list instead of using fallbacks
        return []

def generate_fallback_vocabulary(text: str) -> List[dict]:
    """Generate a basic vocabulary list when the main extraction fails."""
    logger.info("Generating fallback vocabulary")
    
    # Split text into words and get unique ones
    words = re.findall(r'\b\w+\b', text.lower())
    unique_words = set(words)
    
    # Filter for Spanish words (containing Spanish characters or common words)
    spanish_chars = 'áéíóúñü'
    common_spanish_words = {'el', 'la', 'los', 'las', 'un', 'una', 'y', 'o', 'de', 'en', 'con', 'por', 'para'}
    
    spanish_words = []
    for word in unique_words:
        if any(char in word for char in spanish_chars) or word in common_spanish_words:
            if len(word) > 2:  # Skip very short words
                spanish_words.append(word)
    
    # Create basic vocabulary items
    vocabulary = []
    for word in spanish_words[:30]:  # Limit to 30 words
        item = {
            "spanish": word,
            "pronunciation": "",
            "english": "",
            "type": "unknown",
            "conjugation_group": None,
            "is_irregular": False,
            "gender": None,
            "notes": "Automatically extracted"
        }
        vocabulary.append(item)
    
    logger.info(f"Generated fallback vocabulary with {len(vocabulary)} items")
    return vocabulary

def generate_enhanced_fallback_vocabulary(text: str) -> List[dict]:
    """Generate a more comprehensive vocabulary list with translations."""
    logger.info("Generating enhanced fallback vocabulary")
    
    try:
        # Initialize OpenAI client
        openai.api_key = os.getenv("OPENAI_API_KEY")
        client = openai.Client()
        
        # Create a simpler prompt for direct translation
        prompt = f"""
        Extract important Spanish vocabulary from this text and provide English translations.
        For each word or phrase, provide:
        1. The Spanish word/phrase
        2. The English translation
        3. The type (noun, verb, adjective, etc.)
        
        Text: {text[:1000]}  # Limit to first 1000 chars to avoid token limits
        
        Format your response as a simple list of Spanish words with their translations.
        Example:
        - "sí" - "yes" - adverb
        - "sabes" - "you know" - verb
        - "mirándote" - "looking at you" - verb
        """
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",  # Use a cheaper model for fallback
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            
            # Parse the response manually
            content = response.choices[0].message.content
            vocabulary = []
            
            # Extract vocabulary items using regex
            pattern = r'[-•*]\s*["\'"]?([^"\']+)["\'"]?\s*[-–—]\s*["\'"]?([^"\']+)["\'"]?\s*[-–—]\s*([^\n]+)'
            matches = re.findall(pattern, content)
            
            for match in matches:
                spanish = match[0].strip()
                english = match[1].strip()
                word_type = match[2].strip()
                
                item = {
                    "spanish": spanish,
                    "pronunciation": "",
                    "english": english,
                    "type": word_type,
                    "conjugation_group": None,
                    "is_irregular": False,
                    "gender": None,
                    "notes": "Automatically extracted"
                }
                
                vocabulary.append(item)
            
            logger.info(f"Generated {len(vocabulary)} vocabulary items from simple extraction")
            
            # If we didn't get any items, try the basic fallback
            if not vocabulary:
                return generate_fallback_vocabulary(text)
                
            return vocabulary
            
        except Exception as e:
            logger.error(f"Error in simple extraction: {e}")
            return generate_fallback_vocabulary(text)
        
    except Exception as e:
        logger.error(f"Failed to generate enhanced vocabulary: {e}")
        # Fall back to the basic method
        return generate_fallback_vocabulary(text)

def split_text_into_chunks(text: str, max_length: int = 500) -> List[str]:
    """Split text into chunks of maximum length, trying to break at sentence boundaries."""
    if len(text) <= max_length:
        return [text]
    
    chunks = []
    current_chunk = ""
    
    # Try to split on sentence boundaries
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    for sentence in sentences:
        if len(current_chunk) + len(sentence) <= max_length:
            current_chunk += sentence + " "
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            
            # If the sentence itself is too long, split it further
            if len(sentence) > max_length:
                # Split on commas or other natural breaks
                parts = re.split(r'(?<=[:;,])\s+', sentence)
                current_chunk = ""
                
                for part in parts:
                    if len(current_chunk) + len(part) <= max_length:
                        current_chunk += part + " "
                    else:
                        if current_chunk:
                            chunks.append(current_chunk.strip())
                        
                        # If the part is still too long, just split it by length
                        if len(part) > max_length:
                            for i in range(0, len(part), max_length):
                                chunks.append(part[i:i+max_length])
                            current_chunk = ""
                        else:
                            current_chunk = part + " "
            else:
                current_chunk = sentence + " "
    
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks

# Original Ollama implementation (commented out)
"""
async def extract_vocabulary_ollama(text: str) -> List[dict]:
    logger.info("Starting vocabulary extraction")
    logger.debug(f"Input text length: {len(text)} characters")
    
    try:
        # Initialize Ollama client with instructor
        logger.debug("Initializing Ollama client with instructor")
        client = instructor.patch(ollama.Client())
        
        # Load the prompt from the prompts directory
        prompt_path = Path(__file__).parent.parent / "prompts" / "Extract-Vocabulary.md"
        logger.debug(f"Loading prompt from {prompt_path}")
        with open(prompt_path, 'r', encoding='utf-8') as f:
            prompt_template = f.read()
        
        # Construct the full prompt with the text to analyze
        prompt = f"{prompt_template}\n\nText to analyze:\n{text}"
        logger.debug(f"Constructed prompt of length {len(prompt)}")
        
        # We'll use multiple calls to ensure we get all vocabulary
        all_vocabulary = set()
        max_attempts = 3
        
        for attempt in range(max_attempts):
            logger.info(f"Making LLM call attempt {attempt + 1}/{max_attempts}")
            try:
                response = await client.chat(
                    model="mistral",
                    messages=[{"role": "user", "content": prompt}],
                    response_model=VocabularyResponse
                )
                
                # Add new vocabulary items to our set
                # Convert to tuple since dict is not hashable
                for item in response.vocabulary:
                    item_dict = item.dict()
                    item_tuple = tuple(sorted(item_dict.items()))
                    all_vocabulary.add(item_tuple)
                
                logger.info(f"Attempt {attempt + 1} added {len(response.vocabulary)} items")
                
            except Exception as e:
                logger.error(f"Error in attempt {attempt + 1}: {str(e)}")
                if attempt == max_attempts - 1:
                    raise  # Re-raise on last attempt
        
        # Convert back to list of dicts
        result = [dict(item) for item in all_vocabulary]
        logger.info(f"Extracted {len(result)} unique vocabulary items")
        return result
        
    except Exception as e:
        logger.error(f"Failed to extract vocabulary: {str(e)}", exc_info=True)
        raise
"""