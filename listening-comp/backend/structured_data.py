from typing import Optional, Dict, List
from openai import AzureOpenAI
import os

# Model ID
#MODEL_ID = "amazon.nova-micro-v1:0"
MODEL_ID = "amazon.nova-lite-v1:0"

class TranscriptStructurer:
    def __init__(self):
        """Initialize Azure OpenAI client"""
        self.client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_KEY"),
            api_version="2024-02-15-preview",
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )
        self.deployment_name = "gpt-35-turbo"
        
        # Define prompts for different sections
        self.prompts = {
            1: """Extract questions from section 'Comprensión Auditiva' of this DELE transcript...""",
            2: """Extract questions from section 'Interpretación' of this DELE transcript...""",
            3: """Extract questions from section 'Expresión Oral' of this DELE transcript..."""
        }

    def _invoke_azure_openai(self, prompt: str) -> Optional[str]:
        """Make a single call to Azure OpenAI with the given prompt"""
        try:
            response = self.client.chat.completions.create(
                model=self.deployment_name,
                messages=[{"role": "user", "content": prompt}],
                temperature=0
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error invoking Azure OpenAI: {str(e)}")
            return None

    def structure_transcript(self, transcript: str) -> Dict[int, str]:
        """Structure the transcript into three sections using separate prompts"""
        results = {}
        # Skipping section 1 for now
        for section_num in range(2, 4):
            result = self._invoke_azure_openai(self.prompts[section_num])
            if result:
                results[section_num] = result
        return results

    def save_questions(self, structured_sections: Dict[int, str], base_filename: str) -> bool:
        """Save each section to a separate file"""
        try:
            # Create questions directory if it doesn't exist
            os.makedirs(os.path.dirname(base_filename), exist_ok=True)
            
            # Save each section
            for section_num, content in structured_sections.items():
                filename = f"{os.path.splitext(base_filename)[0]}_section{section_num}.txt"
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content)
            return True
        except Exception as e:
            print(f"Error saving questions: {str(e)}")
            return False

    def load_transcript(self, filename: str) -> Optional[str]:
        """Load transcript from a file"""
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            print(f"Error loading transcript: {str(e)}")
            return None

if __name__ == "__main__":
    structurer = TranscriptStructurer()
    transcript = structurer.load_transcript("backend/data/transcripts/sY7L5cfCWno.txt")
    if transcript:
        structured_sections = structurer.structure_transcript(transcript)
        structurer.save_questions(structured_sections, "backend/data/questions/sY7L5cfCWno.txt")