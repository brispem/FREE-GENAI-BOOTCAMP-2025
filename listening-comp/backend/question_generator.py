import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
from typing import Dict, List, Optional
from backend.vector_store import QuestionVectorStore
import time
from datetime import datetime, timedelta
import json

class QuestionGenerator:
    def __init__(self):
        """Initialize Azure AI Inference client"""
        self.client = ChatCompletionsClient(
            endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            credential=AzureKeyCredential(os.getenv("AZURE_OPENAI_API_KEY"))
        )
        self.model_name = "gpt-4o-mini"
        self.vector_store = QuestionVectorStore()
        
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

    def generate_similar_question(self, section_num: int, topic: str) -> Optional[Dict]:
        """Generate a Spanish language question for a specific topic"""
        try:
            print(f"\n=== Starting question generation for topic: {topic} ===")  # Debug log
            
            # Try to get context from vector store if available
            similar_content = self.vector_store.search_similar_content(topic, n_results=2)
            
            # If we have content in vector store, use it as context
            if similar_content and similar_content.get('documents'):
                context = "Based on these transcripts:\n\n"
                for doc in similar_content['documents'][0]:
                    context += f"{doc}\n\n"
                print("Using stored content for context")
            else:
                # No content in vector store, generate without context
                context = "Generate a natural conversation about this topic."
                print("No stored content found, generating new question")

            # Generate question with or without context
            prompt = f"""Generate a Spanish language learning question about {topic}.

{context}

Create a question that follows this exact format:
Introducción: [A brief context setting in Spanish]
Conversación: [A natural dialogue between 2-3 speakers in Spanish]
Pregunta: [A clear question in Spanish about the dialogue]
Opciones:
1. [Plausible answer in Spanish]
2. [Plausible answer in Spanish]
3. [Plausible answer in Spanish]
4. [Plausible answer in Spanish]

Requirements:
- The question should be appropriate for B1-B2 level Spanish learners
- The dialogue should be natural and contextual
- All content must be in Spanish
- One option must be clearly correct
- All options should be plausible
- The dialogue should relate to {topic}
- Use natural, contemporary Spanish
"""
            print("Preparing to send prompt to model...")  # Debug log
            response = self._invoke_azure_openai(prompt)
            print(f"Model response received: {response[:100]}...")  # Debug log

            if response:
                print("Parsing response...")  # Debug log
                parsed = self._parse_question_response(response)
                print(f"Parsed question: {parsed.keys() if parsed else 'None'}")  # Debug log
                return parsed
            print("No response from model")  # Debug log
            return None
        except Exception as e:
            print(f"Error generating question: {str(e)}")
            return None

    def _generate_without_context(self, topic: str) -> Optional[Dict]:
        """Fallback method to generate questions without vector store context"""
        try:
            prompt = f"""Generate a Spanish language learning question about {topic}...
            ...(rest of the prompt)..."""
            response = self._invoke_azure_openai(prompt)
            if response:
                return self._parse_question_response(response)
            return None
        except Exception as e:
            print(f"Error in fallback generation: {str(e)}")
            return None

    def _invoke_azure_openai(self, prompt: str) -> Optional[str]:
        """Invoke Azure AI Inference with the given prompt"""
        try:
            print("\n=== Starting model invocation ===")
            print(f"Model name: {self.model_name}")
            print(f"Endpoint: {os.getenv('AZURE_OPENAI_ENDPOINT')}")
            print("Request details:")
            print(f"- Temperature: 0.7")
            print(f"- Max tokens: 800")
            print(f"- Top P: 0.95")

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

            messages = [
                SystemMessage(content=system_message),
                UserMessage(content=prompt)
            ]

            print("\nSending request to Azure AI Inference...")
            start_time = time.time()
            
            response = self.client.complete(
                messages=messages,
                model=self.model_name,
                temperature=0.7,
                max_tokens=800,
                top_p=0.95,
                stop=None
            )
            
            elapsed_time = time.time() - start_time
            print(f"\nResponse received in {elapsed_time:.2f} seconds")
            print(f"Response status: {'Success' if response and response.choices else 'Failed'}")

            if response and response.choices:
                content = response.choices[0].message.content
                print(f"\nContent preview: {content[:200]}...")
                return content
            else:
                print(f"\nNo content in response. Full response object: {response}")
                return None
        except Exception as e:
            print(f"\nError invoking Azure AI Inference:")
            print(f"Error type: {type(e)}")
            print(f"Error message: {str(e)}")
            print(f"Error details: {e.__dict__ if hasattr(e, '__dict__') else 'No details available'}")
            return None

    def _parse_question_response(self, response: str) -> Dict:
        """Parse the generated question response into structured format"""
        try:
            lines = response.strip().split('\n')
            question = {}
            current_section = None
            current_content = []
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                if line.startswith('Introducción:'):
                    if current_section:
                        question[current_section] = '\n'.join(current_content)
                    current_section = 'Introducción'
                    current_content = []
                elif line.startswith('Conversación:'):
                    if current_section:
                        question[current_section] = '\n'.join(current_content)
                    current_section = 'Conversación'
                    current_content = []
                elif line.startswith('Pregunta:'):
                    if current_section:
                        question[current_section] = '\n'.join(current_content)
                    current_section = 'Pregunta'
                    current_content = []
                elif line.startswith('Opciones:'):
                    if current_section:
                        question[current_section] = '\n'.join(current_content)
                    current_section = 'Opciones'
                    current_content = []
                elif line[0].isdigit() and line[1] == '.' and current_section == 'Opciones':
                    current_content.append(line[2:].strip())
                elif current_section:
                    current_content.append(line)
            
            if current_section:
                if current_section == 'Opciones':
                    question[current_section] = current_content
                else:
                    question[current_section] = '\n'.join(current_content)
            
            return question
            
        except Exception as e:
            print(f"Error parsing question response: {str(e)}")
            return None

    def get_feedback(self, question: Dict, selected_answer: int) -> Dict:
        """Generate feedback for the selected answer"""
        if not question or 'Opciones' not in question:
            return None

        prompt = f"""Given this DELE listening question and the selected answer, provide feedback in Spanish explaining if it's correct 
        and why. Keep the explanation clear and concise.
        
        """
        if 'Introducción' in question:
            prompt += f"Introducción: {question['Introducción']}\n"
            prompt += f"Conversación: {question['Conversación']}\n"
        
        prompt += f"Pregunta: {question['Pregunta']}\n"
        prompt += "Opciones:\n"
        for i, opt in enumerate(question['Opciones'], 1):
            prompt += f"{i}. {opt}\n"
        
        prompt += f"\nRespuesta seleccionada: {selected_answer}\n"
        prompt += "\nProvide feedback in JSON format with these fields:\n"
        prompt += "- correct: true/false\n"
        prompt += "- explanation: brief explanation in Spanish\n"
        prompt += "- correct_answer: the number of the correct option (1-4)\n"

        response = self._invoke_azure_openai(prompt)
        if not response:
            return None

        try:
            return json.loads(response.strip())
        except:
            return {
                "correct": False,
                "explanation": "Lo siento, no se pudo generar la retroalimentación. Por favor, intente de nuevo.",
                "correct_answer": 1
            }
