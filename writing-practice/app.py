import gradio as gr
import requests
import json
import random
import logging
from openai import OpenAI
import os
import dotenv
import yaml
import base64
from config import PORT, OPENAI_API_KEY
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables before anything else
load_dotenv()

# Setup logging
logger = logging.getLogger('spanish_app')
logger.setLevel(logging.DEBUG)
fh = logging.FileHandler('gradio_app.log')
fh.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logger.addHandler(fh)

# Get backend port from environment
BACKEND_PORT = os.getenv('BACKEND_PORT', '5001')
API_BASE_URL = os.getenv('API_BASE_URL', 'http://localhost:5001')

def load_prompts():
    """Load prompts from YAML file"""
    with open('prompts.yaml', 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)

def get_shared_styles():
    return """
    <style>
        /* Custom fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        /* Root variables to match portal theme */
        :root {
            --spanish-red: #AA151B;
            --spanish-yellow: #F1BF00;
            --text-primary: #1a1a1a;
            --text-secondary: #666666;
            --bg-primary: #ffffff;
            --bg-secondary: #f9fafb;
        }

        /* Global Gradio Overrides */
        body {
            font-family: 'Inter', sans-serif !important;
            background: linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary)) !important;
        }

        /* Headers */
        h1 {
            font-size: 2.5rem !important;
            font-weight: 700 !important;
            background: linear-gradient(90deg, var(--spanish-red), var(--spanish-yellow)) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            text-align: center !important;
            padding: 1rem 0 !important;
        }

        /* Buttons */
        .primary-button {
            background: linear-gradient(90deg, var(--spanish-red), var(--spanish-yellow)) !important;
            color: white !important;
            border: none !important;
            border-radius: 0.5rem !important;
            padding: 0.75rem 1.5rem !important;
            font-weight: 500 !important;
            transition: all 0.3s ease !important;
        }

        .primary-button:hover {
            opacity: 0.9 !important;
            transform: translateY(-1px) !important;
        }

        /* Cards */
        .card {
            background: white !important;
            border-radius: 0.5rem !important;
            border: 1px solid rgba(170, 21, 27, 0.1) !important;
            padding: 2rem !important;
            margin: 1rem 0 !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }

        /* Text inputs */
        .input-box {
            border-radius: 0.5rem !important;
            border: 1px solid rgba(170, 21, 27, 0.2) !important;
        }

        /* Return button styling */
        .return-button {
            position: fixed !important;
            top: 1rem !important;
            left: 1rem !important;
            background: linear-gradient(90deg, #AA151B, #F1BF00) !important;
            color: white !important;
            padding: 0.5rem 1rem !important;
            border-radius: 0.5rem !important;
            text-decoration: none !important;
            font-weight: 500 !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            z-index: 1000 !important;
        }
        
        .return-button:hover {
            opacity: 0.9 !important;
            transform: translateY(-1px) !important;
        }
    </style>
    """

class SpanishTranslationApp:
    def __init__(self):
        self.client = OpenAI(api_key=OPENAI_API_KEY)
        self.vocabulary = None
        self.current_word = None
        self.current_sentence = None
        self.prompts = load_prompts()
        self.study_session_id = os.getenv('SESSION_ID')
        self.api_base_url = API_BASE_URL
        self.load_vocabulary()

    def load_vocabulary(self):
        """Fetch vocabulary from API using group_id"""
        try:
            group_id = os.getenv('GROUP_ID', '1')
            url = f"{self.api_base_url}/api/groups/{group_id}/words/raw"
            logger.debug(f"Fetching vocabulary from: {url}")
            
            response = requests.get(url)
            if response.status_code == 200:
                self.vocabulary = response.json()
                logger.info(f"Loaded {len(self.vocabulary.get('words', []))} words")
            else:
                logger.error(f"Failed to load vocabulary. Status code: {response.status_code}")
                self.vocabulary = {"words": []}
        except Exception as e:
            logger.error(f"Error loading vocabulary: {str(e)}")
            self.vocabulary = {"words": []}

    def generate_sentence(self):
        """Generate a new English sentence using GPT-4"""
        try:
            completion = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a language teacher creating simple English sentences for Spanish learners. Generate one simple sentence using basic vocabulary and simple present or past tense. The sentence should be suitable for beginner Spanish practice. Only respond with the sentence, nothing else."},
                    {"role": "user", "content": "Generate a simple English sentence."}
                ]
            )
            
            self.current_sentence = completion.choices[0].message.content
            return self.current_sentence, "Write this sentence in Spanish and upload your handwritten attempt."
            
        except Exception as e:
            logger.error(f"Error generating sentence: {str(e)}")
            return f"Error generating sentence: {str(e)}", str(e)

    def grade_handwriting(self, image_path, english_sentence):
        """Grade the handwritten Spanish translation and log the attempt"""
        try:
            if image_path is None:
                return "Please upload an image of your handwritten translation."
                
            # Get feedback from GPT-4
            with open(image_path, "rb") as image_file:
                encoded_image = base64.b64encode(image_file.read()).decode('utf-8')

            completion = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a Spanish language teacher grading handwritten Spanish translations."
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": f"Here is a handwritten Spanish translation of: '{english_sentence}'. Please grade it and provide feedback."
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{encoded_image}"
                                }
                            }
                        ]
                    }
                ]
            )
            
            feedback = completion.choices[0].message.content
            
            # Determine if the attempt was correct based on feedback
            is_correct = "correct" in feedback.lower() or "excellent" in feedback.lower()
            
            # Log the study session
            if self.study_session_id:
                try:
                    url = f"{self.api_base_url}/api/study-sessions/{self.study_session_id}/attempts"
                    data = {
                        'activity_type': 'writing',
                        'content': english_sentence,
                        'attempt': encoded_image,  # Store the image
                        'feedback': feedback,
                        'is_correct': is_correct,
                        'timestamp': datetime.now().isoformat()
                    }
                    
                    response = requests.post(url, json=data)
                    if response.status_code != 200:
                        logger.error(f"Failed to log study session. Status: {response.status_code}")
                        
                except Exception as e:
                    logger.error(f"Error logging study session: {str(e)}")
            
            return feedback
            
        except Exception as e:
            logger.error(f"Error in grade_handwriting: {str(e)}")
            return f"Error grading handwriting: {str(e)}"

    def submit_result(self, is_correct):
        """Submit the result to the backend"""
        try:
            if not self.study_session_id or not self.current_word:
                logger.error("Missing study session ID or current word")
                return

            url = f"{self.api_base_url}/study_sessions/{self.study_session_id}/review"
            data = {
                'word_id': self.current_word.get('id'),
                'correct': is_correct
            }
            
            response = requests.post(url, json=data)
            if response.status_code != 200:
                logger.error(f"Failed to submit result. Status code: {response.status_code}")
                
        except Exception as e:
            logger.error(f"Error submitting result: {str(e)}")

def create_ui():
    app = SpanishTranslationApp()
    
    theme = gr.themes.Soft()
    
    with gr.Blocks(
        title="Spanish Writing Practice",
        theme=theme,
        css="""
            /* Main container */
            .gradio-container {
                width: 100% !important;
                max-width: none !important;
                padding: 0 !important;
                margin: 0 !important;
                background: linear-gradient(to bottom, #ffffff, #f9fafb) !important;
            }

            /* Content wrapper */
            .content-wrapper {
                max-width: 1200px !important;
                margin: 0 auto !important;
                padding: 2rem !important;
            }

            /* Header styling */
            h1 {
                color: #AA151B !important;
                font-family: 'Inter', sans-serif !important;
                font-weight: 700 !important;
                font-size: 2.5rem !important;
                text-align: center !important;
                margin-bottom: 0.5rem !important;
                background: linear-gradient(90deg, #AA151B, #F1BF00) !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
            }

            /* Buttons */
            button.primary {
                background: linear-gradient(90deg, #AA151B, #F1BF00) !important;
                border: none !important;
                color: white !important;
                font-weight: 600 !important;
                padding: 1rem !important;
                width: 100% !important;
                border-radius: 0.5rem !important;
                font-size: 1.1rem !important;
                transition: all 0.2s ease !important;
            }

            button.primary:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(170, 21, 27, 0.15) !important;
            }

            /* Containers */
            .container {
                background: white !important;
                border-radius: 0.75rem !important;
                padding: 1.5rem !important;
                margin: 1rem 0 !important;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                border: 1px solid rgba(170, 21, 27, 0.1) !important;
            }

            /* Text styling */
            .subtitle {
                text-align: center !important;
                color: #666666 !important;
                margin-bottom: 3rem !important;
                font-size: 1.2rem !important;
            }

            /* Labels */
            label span {
                font-weight: 500 !important;
                font-size: 1rem !important;
                color: #374151 !important;
                margin-bottom: 0.5rem !important;
            }

            /* Input fields */
            .input-box {
                border: 1px solid rgba(170, 21, 27, 0.2) !important;
                border-radius: 0.5rem !important;
                padding: 0.75rem !important;
                background: #f9fafb !important;
                margin-bottom: 1.5rem !important;
            }

            /* Row layout */
            .gap {
                gap: 2rem !important;
            }

            /* Section headers */
            .section-title {
                font-size: 1.25rem !important;
                font-weight: 600 !important;
                color: #1a1a1a !important;
                margin-bottom: 1rem !important;
            }

            /* Image upload area */
            .upload-box {
                border: 2px dashed rgba(170, 21, 27, 0.2) !important;
                border-radius: 0.75rem !important;
                padding: 2rem !important;
                text-align: center !important;
                background: #f9fafb !important;
                margin: 1rem 0 !important;
            }

            /* Feedback box */
            .feedback-box {
                background: #f9fafb !important;
                border-radius: 0.5rem !important;
                padding: 1rem !important;
                margin-top: 1rem !important;
                font-size: 1rem !important;
                line-height: 1.5 !important;
            }

            /* Fixed navigation bar */
            .nav-bar {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                background: white !important;
                padding: 1rem !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                z-index: 1000 !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
            }

            .nav-links {
                display: flex !important;
                gap: 1rem !important;
            }

            .nav-link {
                display: inline-block !important;
                background: linear-gradient(90deg, #AA151B, #F1BF00) !important;
                color: white !important;
                padding: 0.5rem 1rem !important;
                border-radius: 0.5rem !important;
                text-decoration: none !important;
                font-weight: 500 !important;
                transition: all 0.2s ease !important;
            }

            .nav-link:hover {
                opacity: 0.9 !important;
                transform: translateY(-1px) !important;
            }

            /* Adjust content to account for fixed nav */
            .content-wrapper {
                margin-top: 5rem !important;
            }
        """
    ) as interface:
        # Add navigation bar at the top
        gr.HTML('''
            <div class="nav-bar">
                <div class="nav-links">
                    <a href="http://localhost:5173" class="nav-link">← Return to Fluency Portal</a>
                    <a href="http://localhost:5173/study-activities" class="nav-link">← Back to Study Activities</a>
                </div>
            </div>
        ''')
        
        with gr.Column(elem_classes="content-wrapper"):
            gr.HTML('<h1>Spanish Writing Practice</h1>')
            gr.HTML('<p class="subtitle">Practice writing Spanish sentences and get instant feedback</p>')
            
            with gr.Row(elem_classes="gap"):
                # Practice Section
                with gr.Column(elem_classes="container", scale=1):
                    gr.HTML('<h2 class="section-title">1. Get Your Sentence</h2>')
                    generate_btn = gr.Button("Generate New Sentence", variant="primary")
                    english_sentence = gr.Textbox(
                        label="English Sentence",
                        lines=2,
                        interactive=False,
                        elem_classes="input-box"
                    )
                    instruction_output = gr.Textbox(
                        label="Instructions",
                        interactive=False,
                        elem_classes="input-box"
                    )
                    gr.HTML('<h2 class="section-title">2. Write Your Translation</h2>')
                    image_input = gr.Image(
                        label="Upload your handwritten Spanish translation",
                        type="filepath",
                        sources="upload",
                        elem_classes="upload-box"
                    )
                
                # Feedback Section
                with gr.Column(elem_classes="container", scale=1):
                    gr.HTML('<h2 class="section-title">3. Get Feedback</h2>')
                    submit_btn = gr.Button("Submit for Review", variant="primary")
                    feedback_output = gr.Textbox(
                        label="Teacher's Feedback",
                        lines=6,
                        interactive=False,
                        elem_classes="feedback-box"
                    )

        # Event handlers
        generate_btn.click(
            app.generate_sentence,
            outputs=[english_sentence, instruction_output]
        )
        
        submit_btn.click(
            app.grade_handwriting,
            inputs=[image_input, english_sentence],
            outputs=feedback_output
        )

    return interface

if __name__ == "__main__":
    interface = create_ui()
    interface.launch(
        server_name="0.0.0.0",
        server_port=8081,
        share=False
    )
