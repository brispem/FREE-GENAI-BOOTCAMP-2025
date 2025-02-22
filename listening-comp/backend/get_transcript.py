from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
import re
import logging

logger = logging.getLogger(__name__)

class TranscriptFetcher:
    @staticmethod
    def get_video_id(url: str) -> str:
        """Extract video ID from YouTube URL"""
        # Handle different URL formats
        patterns = [
            r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',  # Regular URLs
            r'youtu.be\/([0-9A-Za-z_-]{11})',    # Short URLs
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        
        raise ValueError("Could not extract video ID from URL")

    @staticmethod
    def get_transcript(url: str, lang='es') -> str:
        """Get transcript from YouTube video"""
        try:
            # Extract video ID
            video_id = TranscriptFetcher.get_video_id(url)
            logger.info(f"Fetching transcript for video: {video_id}")

            # Get available transcripts
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            
            # Try to get Spanish transcript
            try:
                transcript = transcript_list.find_transcript([lang])
            except:
                # If Spanish not available, try to translate from another language
                logger.info("Spanish transcript not found, attempting translation")
                transcript = transcript_list.find_transcript(['en']).translate(lang)

            # Get the transcript text
            formatter = TextFormatter()
            transcript_text = formatter.format_transcript(transcript.fetch())

            logger.info("Successfully fetched transcript")
            return transcript_text

        except Exception as e:
            logger.error(f"Error fetching transcript: {str(e)}")
            raise Exception(f"Failed to get transcript: {str(e)}")

    def format_transcript(self, transcript: str) -> str:
        """Format transcript into structured text with timestamps and speakers"""
        if not transcript:
            return ""
        
        formatted_text = []
        current_speaker = None
        
        for line in transcript.splitlines():
            # Add timestamp
            if line.startswith("["):
                current_speaker = "Speaker B" if "Speaker A" in line else "Speaker A"
            
            text = f"{line}"
            formatted_text.append(text)
        
        return "\n".join(formatted_text)

def main(video_url, print_transcript=False):
    # Initialize downloader
    downloader = TranscriptFetcher()
    
    # Get transcript
    transcript = downloader.get_transcript(video_url)
    if transcript:
        # Save transcript
        video_id = downloader.get_video_id(video_url)
        if downloader.save_transcript(transcript, video_id):
            print(f"Transcript saved successfully to {video_id}.txt")
            #Print transcript if True
            if print_transcript:
                # Print transcript
                print(downloader.format_transcript(transcript))
        else:
            print("Failed to save transcript")
        
    else:
        print("Failed to get transcript")

if __name__ == "__main__":
    video_id = "https://www.youtube.com/watch?v=sY7L5cfCWno&list=PLkGU7DnOLgRMl-h4NxxrGbK-UdZHIXzKQ"  # Extract from URL: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    transcript = main(video_id, print_transcript=True)