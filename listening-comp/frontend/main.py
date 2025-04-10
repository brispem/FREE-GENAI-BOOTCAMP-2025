from dotenv import load_dotenv
import streamlit as st
import sys
import os
import json
from datetime import datetime
from pathlib import Path

# Get the root .env file path and load it
root_dir = Path(__file__).resolve().parent.parent
root_env_path = root_dir / '.env'
load_dotenv(root_env_path)

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import backend components
from backend.get_transcript import TranscriptFetcher
from backend.question_generator import QuestionGenerator
from backend.audio_generator import AudioGenerator
from backend.vector_store import QuestionVectorStore
from backend.translation_service import TranslationService

# Add the lang-portal directory to Python path
sys.path.append(str(root_dir / 'lang-portal'))

try:
    from shared_styles import get_shared_styles
except ImportError as e:
    st.error(f"Could not load shared styles: {e}")
    st.write(f"Looking in: {root_dir / 'lang-portal' / 'shared_styles'}")
    get_shared_styles = lambda: ""

# Configure page
st.set_page_config(
    page_title="Spanish Listening Practice",
    page_icon="🎧",
    layout="wide",
    initial_sidebar_state="collapsed",
    menu_items=None
)

# Then update the navigation code with proper positioning
st.markdown('''
    <div style="
        position: relative;
        text-align: left; 
        padding: 0.5rem;
        padding-left: 1rem;
        background-color: white;
        margin-top: 0;
        margin-bottom: 1rem;
    ">
        <a href="http://localhost:5173" 
           style="
               display: inline-block;
               background: linear-gradient(90deg, #AA151B, #F1BF00);
               color: white;
               padding: 0.3rem 0.75rem;
               border-radius: 0.25rem;
               text-decoration: none;
               font-weight: 500;
               margin-right: 0.5rem;
               font-size: 0.85rem;
           ">
            ← Return to Fluency Portal
        </a>
        <a href="http://localhost:5173/study-activities" 
           style="
               display: inline-block;
               background: linear-gradient(90deg, #AA151B, #F1BF00);
               color: white;
               padding: 0.3rem 0.75rem;
               border-radius: 0.25rem;
               text-decoration: none;
               font-weight: 500;
               font-size: 0.85rem;
           ">
            ← Back to Study Activities
        </a>
    </div>
''', unsafe_allow_html=True)

# Add this CSS to remove any extra padding at the top
st.markdown('''
    <style>
        .block-container {
            padding-top: 0 !important;
        }
        header {
            visibility: hidden;
        }
    </style>
''', unsafe_allow_html=True)

# Embed styles directly
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    /* Main container */
    .main .block-container {
        max-width: 1200px;
        padding-top: 2rem;
        padding-bottom: 3rem;
        background: linear-gradient(to bottom, #ffffff, #f9fafb);
    }

    /* Header styling */
    h1 {
        color: #AA151B;
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        font-size: 2.5rem;
        text-align: center;
        margin-bottom: 1rem;
        background: linear-gradient(90deg, #AA151B, #F1BF00);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* Subheader */
    .subheader {
        color: #666666;
        font-family: 'Inter', sans-serif;
        font-size: 1.2rem;
        text-align: center;
        margin-bottom: 2rem;
    }

    /* Button styling */
    .stButton button {
        background: linear-gradient(90deg, #AA151B, #F1BF00) !important;
        color: white !important;
        font-family: 'Inter', sans-serif !important;
        font-weight: 500 !important;
        padding: 0.75rem 1.5rem !important;
        border-radius: 0.5rem !important;
        border: none !important;
        transition: all 0.3s ease !important;
    }

    .stButton button:hover {
        opacity: 0.9 !important;
        transform: translateY(-1px) !important;
    }

    /* Input fields */
    .stTextInput input {
        border-radius: 0.5rem !important;
        border: 1px solid rgba(170, 21, 27, 0.2) !important;
        padding: 0.75rem !important;
        font-family: 'Inter', sans-serif !important;
    }

    /* Card styling */
    .css-1r6slb0 {  /* Streamlit's default container class */
        background: white !important;
        border-radius: 0.5rem !important;
        padding: 2rem !important;
        margin: 1rem 0 !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        border: 1px solid rgba(170, 21, 27, 0.1) !important;
    }

    /* Section headers */
    h2 {
        color: #1a1a1a;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown("<h1>Spanish Listening Practice</h1>", unsafe_allow_html=True)
st.markdown("<p class='subheader'>Improve your Spanish listening comprehension with native audio</p>", unsafe_allow_html=True)

# URL Input Section
st.markdown("## Add Learning Content")
url = st.text_input("Enter Spanish YouTube URL:")

if url:
    try:
        transcript_fetcher = TranscriptFetcher()
        transcript = transcript_fetcher.get_transcript(url)
        
        # Save transcript
        transcript_path = os.path.join('backend', 'data', 'transcripts', f'{transcript_fetcher.get_video_id(url)}.txt')
        os.makedirs(os.path.dirname(transcript_path), exist_ok=True)
        
        with open(transcript_path, 'w', encoding='utf-8') as f:
            f.write(transcript)
            
        st.success("Successfully downloaded transcript!")
        st.text_area("Transcript:", transcript, height=200)
        
    except Exception as e:
        st.error(f"Error getting transcript: {str(e)}")

# Initialize session state if not already done
if 'current_question' not in st.session_state:
    st.session_state.current_question = None
if 'show_feedback' not in st.session_state:
    st.session_state.show_feedback = False
if 'feedback' not in st.session_state:
    st.session_state.feedback = None

# Practice Section
st.markdown("## Generate Practice Questions")
topic = st.selectbox("Select Topic:", ["Shopping", "Travel", "Food", "Culture"])

def generate_new_question():
    st.session_state.show_feedback = False
    st.session_state.feedback = None
    return True

if st.button("Generate Question", on_click=generate_new_question):
    try:
        with st.spinner("Generating question..."):
            generator = QuestionGenerator()
            question = generator.generate_similar_question(2, topic)
            
            if question:
                # Store the question in session state
                st.session_state.current_question = question
            else:
                st.error("Failed to generate question. Please try again.")
    except Exception as e:
        st.error(f"Error: {str(e)}")
        print(f"Detailed error: {str(e)}")  # For debugging

# Display question if available
if st.session_state.current_question:
    question = st.session_state.current_question
    
    # Create a container for the question
    question_container = st.container()
    
    with question_container:
        # Introduction section with audio
        st.subheader("Introducción")
        st.write(question['Introducción'])
        if 'audio_files' in question and 'Introducción' in question['audio_files']:
            st.audio(question['audio_files']['Introducción'])
        
        # Conversation section with audio
        st.subheader("Conversación")
        st.write(question['Conversación'])
        if 'audio_files' in question and 'Conversación' in question['audio_files']:
            st.audio(question['audio_files']['Conversación'])
        
        # Question section with audio
        st.subheader("Pregunta")
        st.write(question['Pregunta'])
        if 'audio_files' in question and 'Pregunta' in question['audio_files']:
            st.audio(question['audio_files']['Pregunta'])
        
        # Options section
        st.subheader("Opciones")
        options = [(i, opt) for i, opt in enumerate(question['Opciones'], 1)]
        selected_option = st.radio(
            "Select your answer:",
            options,
            format_func=lambda x: f"{x[0]}. {x[1]}",
            key="answer_options"
        )

        def submit_answer():
            st.session_state.show_feedback = True
            generator = QuestionGenerator()
            st.session_state.feedback = generator.get_feedback(question, selected_option[0])

        # Submit button
        st.button("Submit Answer", on_click=submit_answer, key="submit_btn")

        # Show feedback if available
        if st.session_state.show_feedback and st.session_state.feedback:
            feedback = st.session_state.feedback
            
            # Create a feedback container with appropriate styling
            feedback_container = st.container()
            
            with feedback_container:
                if feedback['correct']:
                    st.success("¡Correcto! 🎉")
                else:
                    st.error("Incorrecto 😕")
                
                # Show explanation
                st.markdown(f"**Explicación:** {feedback['explanation']}")
                
                # Show correct answer if incorrect
                if not feedback['correct']:
                    correct_answer = question['Opciones'][feedback['correct_answer'] - 1]
                    st.markdown(f"**Respuesta correcta:** {feedback['correct_answer']}. {correct_answer}")
                
                def continue_practice():
                    st.session_state.current_question = None
                    st.session_state.show_feedback = False
                    st.session_state.feedback = None
                
                # Add a continue button
                st.button("Continue", on_click=continue_practice, key="continue_btn")

# ... rest of your backend initialization and functionality ...

# Get backend configuration from environment
BACKEND_PORT = os.getenv('BACKEND_PORT', '5001')
API_BASE_URL = os.getenv('API_BASE_URL', 'http://localhost:5001')
