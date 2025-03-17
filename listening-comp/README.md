# Spanish Listening Comprehension Practice

An interactive tool for improving Spanish listening comprehension skills through authentic content and AI-powered exercises.

## Features

- **YouTube Integration**: Extract transcripts from Spanish YouTube videos
- **Text-to-Speech**: Convert text to natural-sounding Spanish audio using Azure AI
- **Interactive Exercises**: Practice comprehension with various exercise types
- **Progress Tracking**: Store and monitor learning progress
- **Vocabulary Building**: Learn new words in context

## Technology Stack

- **Frontend**: Streamlit
- **Backend**: Python
- **Database**: SQLite3
- **AI Services**: Azure Cognitive Services for text-to-speech
- **APIs**: YouTube Transcript API

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Create a `.env` file with the following variables:
   ```
   TRANSLATOR_TEXT_RESOURCE_KEY=your_azure_translator_key
   TRANSLATOR_TEXT_REGION=your_azure_region
   AZURE_COGNITIVE_SERVICES_ENDPOINT=your_azure_endpoint
   ```

3. Run the application:
   ```
   streamlit run frontend/main.py
   ```

4. Access the application at `http://localhost:8501`

## Usage

1. Enter a Spanish YouTube URL in the input field
2. The application will extract the transcript and generate audio
3. Listen to the audio and complete the comprehension exercises
4. Track your progress over time

## Integration with Language Portal

This application integrates with the main Spanish Language Learning Portal:
- Can be launched from the Study Activities section
- Includes navigation buttons to return to the main portal
- Shares styling elements for consistent user experience

## Project Structure

- `frontend/`: Streamlit interface and user interaction
- `backend/`: Core functionality and API integrations
- `static/`: Static assets and cached audio files
- `data/`: SQLite database and data files

## Development

To modify or extend the application:
1. The main Streamlit interface is in `frontend/main.py`
2. Azure TTS integration is in `backend/tts_service.py`
3. YouTube transcript handling is in `backend/transcript_service.py`
4. Database operations are in `backend/db_service.py`

## How to run frontend

```sh
streamlit run frontend/main.py
```

## How to run backend

```sh
cd backend
pip install -r requirements.txt
cd ..
python backend/main.py
```