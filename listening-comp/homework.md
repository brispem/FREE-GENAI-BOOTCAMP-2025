# Language Learning Application - Requirements Implementation

## Core Application Overview
Built a Spanish language learning application focused on listening comprehension, using Azure services and Streamlit for the frontend interface.

## Requirements Implementation

### 1. Language Listening App (Hard Requirement)
- Created an interactive web application using Streamlit
- Implemented a clean user interface with topic selection and question generation
- Added audio playback functionality for listening practice
- Included answer verification and feedback system

### 2. YouTube Transcript Integration
- Implemented functionality to accept Spanish YouTube URLs
- Built a transcript fetcher that extracts Spanish subtitles from videos
- Successfully processes and stores the transcribed content
- Located in `backend/get_transcript.py`

### 3. Vector Store Implementation
- Created a vector database system using ChromaDB
- Properly formats and structures YouTube transcript data
- Stores transcripts with metadata (video ID, URL, timestamp)
- Enables semantic search for relevant content
- Implementation in `backend/vector_store.py`

### 4. Topic-Based Question Generation
- Developed a system to generate questions based on user-selected topics
- Uses vector similarity search to find relevant content
- Integrates with Azure OpenAI for question generation
- Topics include: Shopping, Daily Conversation, Travel, Food, Work, Family
- Core logic in `backend/question_generator.py`

### 5. Frontend Question Display
- Clean presentation of generated questions
- Shows introduction, conversation context, and question
- Multiple choice answer selection
- Immediate feedback on answers
- Implementation in `frontend/main.py`

### 6. Audio Generation
- Integrated Azure Speech Service for text-to-speech
- Converts Spanish text to natural-sounding audio
- Uses high-quality Spanish voice (es-ES-ElviraNeural)
- Saves audio files for playback
- Implementation in `backend/audio_generator.py`

## Technical Implementation
- Used Azure OpenAI for AI capabilities
- Implemented Azure Speech Services for audio
- Built with Python and Streamlit
- Structured data storage with ChromaDB
- Environment configuration via .env file

## Additional Features
- Translation tool in sidebar
- Question feedback system
- Error handling and logging
- Structured data storage
- Clean and intuitive user interface 