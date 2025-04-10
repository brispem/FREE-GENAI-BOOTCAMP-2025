import os
from openai import OpenAI
from typing import Dict, List, Optional
from backend.vector_store import QuestionVectorStore
import time
from datetime import datetime, timedelta
import json
from pathlib import Path
from backend.audio_generator import AudioGenerator
from dotenv import load_dotenv

class QuestionGenerator:
    def __init__(self):
        """Initialize OpenAI client"""
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
        self.model_name = "gpt-4o-2024-08-06"  # Using the specified GPT-4 model
        self.vector_store = QuestionVectorStore()
        
        # Initialize audio generator
        self.audio_generator = AudioGenerator()
        
        # Rate limiting
        self.last_request_time = None
        self.requests_this_minute = 0
        self.tokens_this_minute = 0
        self.reset_time = None

    def _check_rate_limits(self, estimated_tokens: int = 500):
        """Check and enforce rate limits"""
        current_time = datetime.now()
        
        # Reset counters if it's been more than a minute
        if self.reset_time and current_time > self.reset_time:
            self.requests_this_minute = 0
            self.tokens_this_minute = 0
            self.reset_time = None
        
        # Initialize reset time if not set
        if not self.reset_time:
            self.reset_time = current_time + timedelta(minutes=1)
        
        # Check limits
        if self.requests_this_minute >= 6:
            sleep_time = (self.reset_time - current_time).total_seconds()
            print(f"Rate limit reached. Sleeping for {sleep_time} seconds")
            time.sleep(sleep_time)
            self.requests_this_minute = 0
            self.tokens_this_minute = 0
            self.reset_time = datetime.now() + timedelta(minutes=1)
        
        if self.tokens_this_minute + estimated_tokens > 1000:
            sleep_time = (self.reset_time - current_time).total_seconds()
            print(f"Token limit reached. Sleeping for {sleep_time} seconds")
            time.sleep(sleep_time)
            self.requests_this_minute = 0
            self.tokens_this_minute = 0
            self.reset_time = datetime.now() + timedelta(minutes=1)

    def _invoke_openai(self, prompt: str) -> Optional[str]:
        """Invoke OpenAI with the given prompt"""
        try:
            print("\n=== Starting model invocation ===")
            print(f"Model name: {self.model_name}")
            print("Request details:")
            print(f"- Temperature: 0.7")
            print(f"- Max tokens: 800")

            system_message = """You are a Spanish language education expert specializing in creating listening comprehension exercises. 

Your role is to:
1. Generate natural, conversational Spanish dialogues and questions
2. Focus on practical, everyday situations that language learners might encounter
3. Create clear, unambiguous multiple-choice questions
4. Ensure all content is culturally appropriate and relevant
5. Use a mix of formal and informal Spanish when appropriate
6. Generate content at approximately B1-B2 CEFR level

Format your responses exactly as follows:
Introducción: [Brief context setting in Spanish]
Conversación: [Natural dialogue between 2-3 speakers]
Pregunta: [Clear question about the dialogue]
Opciones:
1. [Plausible option]
2. [Plausible option]
3. [Plausible option]
4. [Plausible option]"""

            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )
            
            if response.choices:
                content = response.choices[0].message.content
                print(f"\nContent preview: {content[:200]}...")
                return content
            else:
                print(f"\nNo content in response. Full response object: {response}")
                return None
        except Exception as e:
            print(f"\nError invoking OpenAI:")
            print(f"Error type: {type(e)}")
            print(f"Error message: {str(e)}")
            return None

    def _parse_question_response(self, response: str) -> Optional[Dict]:
        """Parse the model's response into structured question data"""
        try:
            lines = response.strip().split('\n')
            result = {}
            current_key = None
            current_content = []
            options = []
            correct_answer = 1  # Default to first option

            for line in lines:
                line = line.strip()
                if not line:
                    continue

                if line.startswith('Introducción:'):
                    if current_key:
                        result[current_key] = '\n'.join(current_content)
                    current_key = 'Introducción'
                    current_content = [line.replace('Introducción:', '').strip()]
                elif line.startswith('Conversación:'):
                    if current_key:
                        result[current_key] = '\n'.join(current_content)
                    current_key = 'Conversación'
                    current_content = [line.replace('Conversación:', '').strip()]
                elif line.startswith('Pregunta:'):
                    if current_key:
                        result[current_key] = '\n'.join(current_content)
                    current_key = 'Pregunta'
                    current_content = [line.replace('Pregunta:', '').strip()]
                elif line.startswith('Opciones:'):
                    if current_key:
                        result[current_key] = '\n'.join(current_content)
                    current_key = 'Opciones'
                    current_content = []
                elif line.startswith('Respuesta correcta:'):
                    correct_answer = int(line.replace('Respuesta correcta:', '').strip())
                elif line[0].isdigit() and line[1] == '.':
                    options.append(line[2:].strip())
                else:
                    current_content.append(line)

            if current_key:
                if current_key == 'Opciones':
                    result[current_key] = options
                else:
                    result[current_key] = '\n'.join(current_content)

            # Store the correct answer
            result['correct_answer'] = correct_answer
            return result
        except Exception as e:
            print(f"Error parsing question response: {str(e)}")
            return None

    def generate_similar_question(self, section_num: int, topic: str) -> Optional[Dict]:
        """Generate a Spanish language question with audio for a specific topic"""
        try:
            print(f"\n=== Starting question generation for topic: {topic} ===")
            
            # Generate a natural conversation about the topic without vector store context
            prompt = f"""Generate a Spanish language learning question about {topic}.

Create a question that follows this exact format:
Introducción: [A brief context setting in Spanish]
Conversación: [A natural dialogue between 2-3 speakers in Spanish]
Pregunta: [A clear question in Spanish about the dialogue]
Opciones:
1. [Plausible answer in Spanish]
2. [Plausible answer in Spanish]
3. [Plausible answer in Spanish]
4. [Plausible answer in Spanish]
Respuesta correcta: [Number of the correct option (1-4)]

Requirements:
- The question should be appropriate for B1-B2 level Spanish learners
- The dialogue should be natural and contextual
- All content must be in Spanish
- One option must be clearly correct (indicate with Respuesta correcta)
- All options should be plausible
- The dialogue should relate to {topic}
- Use natural, contemporary Spanish
"""
            print("Preparing to send prompt to model...")
            response = self._invoke_openai(prompt)
            print(f"Model response received: {response[:100] if response else 'None'}...")

            if response:
                print("Parsing response...")
                parsed = self._parse_question_response(response)
                
                # Generate audio for each component
                if parsed:
                    audio_files = {}
                    for key in ['Introducción', 'Conversación', 'Pregunta']:
                        if key in parsed:
                            filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{key.lower()}.mp3"
                            audio_path = self.audio_generator.generate_audio(
                                parsed[key],
                                filename
                            )
                            if audio_path:
                                audio_files[key] = audio_path
                    
                    # Add audio paths to the parsed question
                    parsed['audio_files'] = audio_files
                
                print(f"Parsed question with audio: {parsed.keys() if parsed else 'None'}")
                return parsed
            print("No response from model")
            return None
        except Exception as e:
            print(f"Error generating question: {str(e)}")
            return None

    def _generate_without_context(self, topic: str) -> Optional[Dict]:
        """Fallback method to generate questions without vector store context"""
        try:
            prompt = f"""Generate a Spanish language learning question about {topic}...
            ...(rest of the prompt)..."""
            response = self._invoke_openai(prompt)
            if response:
                return self._parse_question_response(response)
            return None
        except Exception as e:
            print(f"Error in fallback generation: {str(e)}")
            return None

    def get_feedback(self, question: Dict, selected_answer: int) -> Dict:
        """Generate feedback for the selected answer"""
        if not question or 'Opciones' not in question or 'correct_answer' not in question:
            return None

        correct_answer = question['correct_answer']
        is_correct = selected_answer == correct_answer

        # Generate feedback based on the answer
        prompt = f"""Given this Spanish listening comprehension question and the selected answer, provide feedback in Spanish.

Conversación: {question['Conversación']}

Pregunta: {question['Pregunta']}

Opciones:
{chr(10).join(f"{i+1}. {opt}" for i, opt in enumerate(question['Opciones']))}

Respuesta seleccionada: {selected_answer}
Respuesta correcta: {correct_answer}

Provide feedback in JSON format with these fields:
- correct: {str(is_correct).lower()}
- explanation: brief explanation in Spanish (2-3 sentences max)
- correct_answer: {correct_answer}
"""

        response = self._invoke_openai(prompt)
        if not response:
            # Fallback feedback if OpenAI call fails
            return {
                "correct": is_correct,
                "explanation": "¡Correcto! Has entendido bien el diálogo." if is_correct else f"Incorrecto. La respuesta correcta es la opción {correct_answer}.",
                "correct_answer": correct_answer
            }

        try:
            feedback = json.loads(response.strip())
            # Ensure the feedback matches our stored correct answer
            feedback['correct'] = is_correct
            feedback['correct_answer'] = correct_answer
            return feedback
        except:
            # Fallback feedback if JSON parsing fails
            return {
                "correct": is_correct,
                "explanation": "¡Correcto! Has entendido bien el diálogo." if is_correct else f"Incorrecto. La respuesta correcta es la opción {correct_answer}.",
                "correct_answer": correct_answer
            }
