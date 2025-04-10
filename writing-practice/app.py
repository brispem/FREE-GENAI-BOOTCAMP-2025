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
import streamlit as st

# Load environment variables before anything else
load_dotenv()

# Setup logging
logger = logging.getLogger('spanish_app')
logger.setLevel(logging.DEBUG)
fh = logging.FileHandler('streamlit_app.log')
fh.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logger.addHandler(fh)

# Get backend port from environment
BACKEND_PORT = os.getenv('BACKEND_PORT', '5174')
API_BASE_URL = os.getenv('API_BASE_URL', 'http://localhost:5174')

st.set_page_config(
    page_title="Spanish Writing Practice",
    page_icon="📘",
    layout="wide"
)

# Custom CSS for light theme styling
st.markdown("""
<style>
body, .stApp {
    background-color: #f9fafb !important;
    color: #1a1a1a !important;
    font-family: 'Inter', sans-serif !important;
}

h1 {
    color: #AA151B !important;
    font-weight: 700 !important;
    text-align: center;
    margin-bottom: 0.5rem !important;
}

h2, h3 {
    color: #AA151B !important;
    font-weight: 700 !important;
    margin-bottom: 0.5rem !important;
    font-size: 1.25rem !important;
}

.card {
    background-color: #ffffff !important;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    margin: 0;
}

.stButton > button {
    background: linear-gradient(90deg, #D11A2A, #F1BF00) !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
    padding: 0.5rem 1rem !important;
    transition: all 0.2s ease;
    text-align: center;
}

.stButton > button:hover {
    opacity: 0.95;
    transform: translateY(-1px);
}

textarea, .stTextArea textarea {
    background-color: #f8f8f8 !important;
    color: #1a1a1a !important;
    border: 1px solid #ddd !important;
    border-radius: 8px !important;
    padding: 0.5rem;
}

div[data-testid="stFileUploader"] > section {
    background-color: #f8f8f8 !important;
    border: 1px solid #ddd !important;
    border-radius: 8px !important;
    padding: 1rem;
    color: #1a1a1a !important;
}

div[data-testid="stFileUploader"] label,
div[data-testid="stFileUploader"] span {
    color: #1a1a1a !important;
}

a.nav-button {
    background: linear-gradient(90deg, #AA151B, #F1BF00);
    color: white !important;
    font-weight: bold;
    padding: 8px 14px;
    border-radius: 6px;
    text-decoration: none;
    display: inline-block;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    position: fixed;
    top: 50px;
    left: 10px;
    z-index: 1000;
}

a.nav-button:hover {
    opacity: 0.95;
    transform: translateY(-1px);
}

.stTextArea, .stFileUploader, .stButton {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}
</style>
""", unsafe_allow_html=True)

def load_prompts():
    """Load prompts from a YAML file"""
    try:
        with open('prompts.yaml', 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        logger.error("prompts.yaml file not found.")
        return {}
    except Exception as e:
        logger.error(f"Error loading prompts: {str(e)}")
        return {}

def create_ui():
    # Navigation Bar
    st.markdown("""
        <a href="http://localhost:5173/study-activities" class="nav-button">← Return to Study Activities</a>
    """, unsafe_allow_html=True)

    st.title("Spanish Writing Practice")
    st.markdown("<p style='text-align: center;'>Practice writing Spanish sentences and get instant feedback</p>", unsafe_allow_html=True)

    # Layout with equal columns
    col1, col2 = st.columns(2)

    with col1:
        # Practice Section
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.markdown("### 1. Get Your Sentence")
        if 'english_sentence' not in st.session_state:
            st.session_state['english_sentence'] = None

        if st.button("Generate New Sentence"):
            st.session_state['english_sentence'], instruction = app.generate_sentence()
            st.text_area("English Sentence", st.session_state['english_sentence'], height=80)
            st.text_area("Instructions", instruction, height=80)
        st.markdown('</div>', unsafe_allow_html=True)

        # Write Your Translation
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.markdown("### 2. Write Your Translation")
        image_input = st.file_uploader("Upload your handwritten Spanish translation", type=["jpg", "jpeg", "png"])
        
        # Image Preview
        if image_input:
            st.markdown("#### Preview of Your Handwriting:")
            st.image(image_input, width=300)
        
        st.markdown('</div>', unsafe_allow_html=True)

    with col2:
        # Feedback Section
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.markdown("### 3. Get Feedback")
        if st.button("Submit for Review"):
            if st.session_state['english_sentence'] is not None:
                feedback = app.grade_handwriting(image_input, st.session_state['english_sentence'])
                st.markdown("### Teacher's Feedback")
                st.success(feedback)
                st.toast("✅ Attempt logged successfully!")  # Requires Streamlit v1.27+
            else:
                st.error("Please generate a sentence first.")
        st.markdown('</div>', unsafe_allow_html=True)

class SpanishTranslationApp:
    def __init__(self):
        if OPENAI_API_KEY == 'not-configured':
            raise ValueError("OpenAI API key not found in root .env file")
        self.client = OpenAI(api_key=OPENAI_API_KEY)
        self.vocabulary = None
        self.current_word = None
        self.current_sentence = None
        self.prompts = load_prompts()
        self.study_session_id = os.getenv('SESSION_ID')
        self.api_base_url = API_BASE_URL
        # Comment out the following line to stop fetching vocabulary
        # self.load_vocabulary()

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
                model="gpt-4o-2024-08-06",
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

    def grade_handwriting(self, uploaded_file, english_sentence):
        """Grade the handwritten Spanish translation and log the attempt"""
        try:
            if uploaded_file is None:
                return "Please upload an image of your handwritten translation."
            
            # Read the file content
            encoded_image = base64.b64encode(uploaded_file.read()).decode('utf-8')

            completion = self.client.chat.completions.create(
                model="gpt-4o-2024-08-06",
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

if __name__ == "__main__":
    app = SpanishTranslationApp()
    create_ui()
