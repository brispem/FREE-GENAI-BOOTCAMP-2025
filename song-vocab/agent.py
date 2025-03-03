# import ollama  # Commented out for OpenAI usage
import openai  # Add OpenAI import
from typing import List, Dict, Any, Optional
import json
import logging
import re
import asyncio
from pathlib import Path
from functools import partial
from tools.search_web_serp import search_web_serp
from tools.get_page_content import get_page_content
from tools.extract_vocabulary import extract_vocabulary
from tools.generate_song_id import generate_song_id
from tools.save_results import save_results
import math
import os  # Add os import for environment variables
from dotenv import load_dotenv

# Load environment variables from the song-vocab directory
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

# Get the app's root logger
logger = logging.getLogger('song_vocab')

class ToolRegistry:
    def __init__(self, lyrics_path: Path, vocabulary_path: Path):
        self.lyrics_path = lyrics_path
        self.vocabulary_path = vocabulary_path
        self.tools = {
            'search_web_serp': search_web_serp,
            'get_page_content': get_page_content,
            'extract_vocabulary': extract_vocabulary,
            'generate_song_id': generate_song_id,
            'save_results': partial(save_results, lyrics_path=lyrics_path, vocabulary_path=vocabulary_path)
        }
    
    def get_tool(self, name: str):
        return self.tools.get(name)

def calculate_safe_context_window(available_ram_gb: float, safety_factor: float = 0.8) -> int:
    """
    Calculate a safe context window size based on available RAM.
    
    Args:
        available_ram_gb (float): Available RAM in gigabytes
        safety_factor (float): Factor to multiply by for safety margin (default 0.8)
        
    Returns:
        int: Recommended context window size in tokens
        
    Note:
        Based on observation that 128K tokens requires ~58GB RAM
        Ratio is approximately 0.45MB per token (58GB/131072 tokens)
    """
    # Known ratio from our testing
    GB_PER_128K_TOKENS = 58.0
    TOKENS_128K = 131072
    
    # Calculate tokens per GB
    tokens_per_gb = TOKENS_128K / GB_PER_128K_TOKENS
    
    # Calculate safe token count
    safe_tokens = math.floor(available_ram_gb * tokens_per_gb * safety_factor)
    
    # Round down to nearest power of 2 for good measure
    power_of_2 = 2 ** math.floor(math.log2(safe_tokens))
    
    # Cap at 128K tokens
    final_tokens = min(power_of_2, TOKENS_128K)
    
    logger.debug(f"Context window calculation:")
    logger.debug(f"  Available RAM: {available_ram_gb}GB")
    logger.debug(f"  Tokens per GB: {tokens_per_gb}")
    logger.debug(f"  Raw safe tokens: {safe_tokens}")
    logger.debug(f"  Power of 2: {power_of_2}")
    logger.debug(f"  Final tokens: {final_tokens}")
    
    return final_tokens

class SongLyricsAgent:
    def __init__(self, lyrics_path: Path, vocabulary_path: Path):
        self.lyrics_path = lyrics_path
        self.vocabulary_path = vocabulary_path
        self.tools = {
            'search_web_serp': search_web_serp,
            'get_page_content': get_page_content,
            'extract_vocabulary': extract_vocabulary,
            'generate_song_id': generate_song_id,
            'save_results': partial(save_results, lyrics_path=lyrics_path, vocabulary_path=vocabulary_path)
        }
        
        # Get API key from environment
        api_key = os.getenv("OPENAI_API_KEY")
        
        # Initialize OpenAI client with the API key
        self.client = openai.Client(api_key=api_key)
        
        # Load the agent prompt
        prompt_path = Path(__file__).parent / "prompts" / "Lyrics-Angent.md"
        with open(prompt_path, 'r', encoding='utf-8') as f:
            self.agent_prompt = f.read()
    
    async def execute_tool(self, tool_name: str, tool_args: Dict[str, Any]) -> Any:
        """Execute a tool with the given arguments."""
        if tool_name not in self.tools:
            raise ValueError(f"Unknown tool: {tool_name}")
        
        tool = self.tools[tool_name]
        
        # Call the tool without await
        result = tool(**tool_args)
        
        # If the result is a coroutine, await it
        if asyncio.iscoroutine(result):
            logger.warning(f"Tool {tool_name} returned a coroutine. This is unexpected.")
            result = await result
        
        return result
    
    def parse_tool_call(self, text: str) -> Optional[tuple]:
        """Parse a tool call from the text."""
        # More flexible pattern to handle multiline and incomplete tool calls
        tool_pattern = r'Tool:\s+(\w+)\s*\(\s*(.*?)(?:\)|$)'
        match = re.search(tool_pattern, text, re.DOTALL)
        if not match:
            return None
        
        tool_name = match.group(1)
        args_str = match.group(2)
        
        # Parse arguments more flexibly
        args = {}
        
        # Handle text argument specifically for extract_vocabulary
        if tool_name == "extract_vocabulary" and "text=" in args_str:
            text_match = re.search(r'text=\s*["\']?(.*?)(?:["\']?(?:,|\)|\Z)|\Z)', args_str, re.DOTALL)
            if text_match:
                args["text"] = text_match.group(1).strip()
                return (tool_name, args)
        
        # Handle save_results specifically to ensure vocabulary is provided
        if tool_name == "save_results":
            # Extract song_id
            song_id_match = re.search(r'song_id\s*=\s*["\']([^"\']+)["\']', args_str)
            if song_id_match:
                args["song_id"] = song_id_match.group(1)
            
            # Extract lyrics - use a more flexible pattern that can handle multiline text
            # First try to extract the entire lyrics content
            full_lyrics_match = re.search(r'lyrics\s*=\s*["\'](.*?)["\'](?:,|\)|\Z)', args_str, re.DOTALL)
            if full_lyrics_match:
                args["lyrics"] = full_lyrics_match.group(1)
            else:
                # If that fails, try to extract just the first part and assume it's truncated
                lyrics_start_match = re.search(r'lyrics\s*=\s*["\'](.*?)(?:\Z)', args_str, re.DOTALL)
                if lyrics_start_match:
                    args["lyrics"] = lyrics_start_match.group(1)
                    logger.warning("Lyrics appear to be truncated in the tool call")
                else:
                    # If no lyrics found, provide a default empty string
                    args["lyrics"] = ""
                    logger.warning("No lyrics found in the tool call")
            
            # Add empty vocabulary if missing
            if "vocabulary" not in args:
                args["vocabulary"] = []
            
            # Ensure all required parameters are present
            if "song_id" not in args:
                args["song_id"] = "unknown-song"
            
            return (tool_name, args)
        
        # For other tools, use the regular pattern
        arg_pattern = r'(\w+)\s*=\s*(?:"([^"]*)"|\{([^}]*)\}|\'([^\']*)\'|([^,)]+))'
        for arg_match in re.finditer(arg_pattern, args_str):
            arg_name = arg_match.group(1)
            # Try to get the value from one of the capture groups
            arg_value = next((g for g in arg_match.groups()[1:] if g is not None), "")
            
            # Try to parse as JSON if it looks like a dict or list
            if arg_value.startswith('{') or arg_value.startswith('['):
                try:
                    arg_value = json.loads(arg_value)
                except json.JSONDecodeError:
                    pass
            
            args[arg_name] = arg_value
        
        return (tool_name, args)
    
    async def process_request(self, message: str, max_turns: int = 15) -> Dict[str, Any]:
        """Process a request to find lyrics and extract vocabulary."""
        logger.info(f"Processing request: {message}")
        
        # Initialize conversation with system prompt and user message
        conversation = [
            {"role": "system", "content": self.agent_prompt},
            {"role": "user", "content": message}
        ]
        
        # Get the model name from environment or use default
        model_name = os.getenv("MODEL_NAME", "gpt-4o")
        
        current_turn = 0
        while current_turn < max_turns:
            try:
                logger.info(f"Turn {current_turn + 1}/{max_turns}")
                
                # Get response from OpenAI with explicit API key
                response = self.client.chat.completions.create(
                    model=model_name,  # Use the model from environment variable
                    messages=conversation,
                    temperature=0.2
                )
                
                # Extract the assistant's message
                assistant_message = response.choices[0].message.content
                logger.debug(f"Assistant response: {assistant_message}")
                
                # Check if the task is finished
                if "FINISHED" in assistant_message:
                    # Extract the song_id from the response - use a more flexible pattern
                    song_id_match = re.search(r'song[_\s]id["\']?:?\s*["\']?([^"\'}\s,\.]+)', assistant_message, re.IGNORECASE)
                    if not song_id_match:
                        # Try another pattern that looks for backticks - extract only what's inside
                        song_id_match = re.search(r'`([^`]+)`', assistant_message)
                    
                    if song_id_match:
                        song_id = song_id_match.group(1)
                        # Remove any backticks that might have been captured
                        song_id = song_id.replace('`', '')
                        logger.info(f"Task completed with song_id: {song_id}")
                        return {"song_id": song_id}
                    else:
                        # If we can't extract the song_id but we know it's finished,
                        # look for the song_id in the lyrics directory
                        try:
                            lyrics_files = list(self.lyrics_path.glob("*.txt"))
                            if lyrics_files:
                                # Get the most recently created file
                                latest_file = max(lyrics_files, key=lambda p: p.stat().st_mtime)
                                song_id = latest_file.stem
                                logger.info(f"Found song_id from latest file: {song_id}")
                                return {"song_id": song_id}
                        except Exception as e:
                            logger.error(f"Error finding song_id from files: {e}")
                        
                        logger.error("FINISHED found but no song_id in response")
                        raise ValueError("No song_id found in completed response")
                
                # Parse tool call
                action = self.parse_tool_call(assistant_message)
                if not action:
                    logger.warning("No tool call found in response")
                    conversation.append({"role": "assistant", "content": assistant_message})
                    conversation.append({
                        "role": "user", 
                        "content": "Please use one of the available tools to proceed. Format your response as Tool: tool_name(arg1=\"value1\", arg2=\"value2\")"
                    })
                    continue
                
                # Execute the tool
                tool_name, tool_args = action
                logger.info(f"Executing tool: {tool_name}")
                logger.info(f"Arguments: {tool_args}")
                result = await self.execute_tool(tool_name, tool_args)
                logger.info(f"Tool execution complete")
                
                # If this is get_page_content and we have lyrics, store them for later use
                if tool_name == "get_page_content" and result.get("success", False):
                    self.spanish_lyrics = result.get("spanish_lyrics", "")
                    logger.info(f"Stored Spanish lyrics: {len(self.spanish_lyrics)} chars")

                # If this is save_results and we have stored lyrics, use them
                if tool_name == "save_results" and hasattr(self, "spanish_lyrics") and self.spanish_lyrics:
                    if not tool_args.get("lyrics") or len(tool_args.get("lyrics", "")) < len(self.spanish_lyrics):
                        logger.info(f"Using stored lyrics instead of truncated ones")
                        tool_args["lyrics"] = self.spanish_lyrics
                        result = await self.execute_tool(tool_name, tool_args)
                
                # Add the interaction to conversation
                conversation.append({"role": "assistant", "content": assistant_message})
                conversation.append({"role": "user", "content": f"Tool {tool_name} result: {json.dumps(result)}"})
                
                current_turn += 1
                
            except Exception as e:
                logger.error(f"❌ Error in turn {current_turn + 1}: {e}")
                logger.error(f"Stack trace:", exc_info=True)
                
                # Provide more specific error message based on the exception
                error_message = str(e)
                if "No tool call found" in error_message:
                    error_message = "I couldn't understand your tool call. Please format it exactly as: Tool: tool_name(arg1=\"value1\", arg2=\"value2\")"
                elif "extract_vocabulary" in error_message:
                    error_message = "There was an error extracting vocabulary. Please try with a shorter text or different approach."
                
                conversation.append({"role": "user", "content": f"Error: {error_message}. Please try again."})
                current_turn += 1  # Increment turn count to avoid infinite loop
        
        raise Exception("Reached maximum number of turns without completing the task")

    def clean_lyrics(self, lyrics: str) -> str:
        """Clean and format the lyrics text."""
        # Remove metadata/header information
        if "Lyrics Translation Meaning" in lyrics:
            lyrics = lyrics.split("Lyrics Translation Meaning")[-1]
        
        # Remove all metadata sections
        patterns_to_remove = [
            r'lyrics views \d+[,\.]?\d*',
            r'\d+ Contributors.*?Lyrics',
            r'(Translations|English).*?Lyrics',
            r'\(part\. [^)]+\)',
            r'Translation Meaning.*?\n',
            r'\(Spanish Version\)',
            r'\(.*?ft\..*?\)',
            r'\([^)]*Remix[^)]*\)',
        ]
        
        for pattern in patterns_to_remove:
            lyrics = re.sub(pattern, '', lyrics, flags=re.DOTALL | re.IGNORECASE)
        
        # Split into verses and process each
        verses = re.split(r'\n\s*\n', lyrics)
        formatted_verses = []
        
        for verse in verses:
            lines = verse.split('\n')
            cleaned_lines = []
            
            for line in lines:
                # Clean up the line
                line = line.strip()
                
                # Skip empty or metadata lines
                if not line or line.startswith(('Contributors', 'Translations', '[English]')):
                    continue
                    
                # Format section headers
                if any(marker in line.lower() for marker in ['[verso', '[coro', '[puente', '[pre-coro', '[estribillo']):
                    header = line.strip('[]').title()
                    cleaned_lines.append(f"\n[{header}]")
                    continue
                
                # Remove repeated lines
                if cleaned_lines and line == cleaned_lines[-1]:
                    continue
                    
                # Clean up punctuation and spacing
                line = re.sub(r'\s+', ' ', line)
                line = re.sub(r'\(\s*([^)]+)\s*\)', r'(\1)', line)  # Fix spacing in parentheses
                
                cleaned_lines.append(line)
            
            if cleaned_lines:
                formatted_verses.append('\n'.join(cleaned_lines))
        
        # Join verses with double newlines
        formatted_lyrics = '\n\n'.join(verse for verse in formatted_verses if verse.strip())
        
        # Final cleanup
        formatted_lyrics = re.sub(r'\n{3,}', '\n\n', formatted_lyrics)
        formatted_lyrics = formatted_lyrics.strip()
        
        return formatted_lyrics

    def get_stored_lyrics(self) -> str:
        """Return the last stored lyrics."""
        if hasattr(self, 'spanish_lyrics'):
            return self.clean_lyrics(self.spanish_lyrics)
        return ""
