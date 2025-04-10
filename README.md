# Spanish Language Learning Portal

A comprehensive Spanish language learning platform featuring multiple interactive applications and study tools.

## Business Scenario
You've been hired as an AI Engineer for a Spanish Language Learning School to extend the language offering and augment the learning experience for students between instructor-led classes. The school has an existing learning portal and learning record store, and you've been tasked to build a collection of learning apps using various AI technologies.

## Project Overview
This integrated suite of AI-powered learning applications extends the language offering and augments the learning experience for students between instructor-led classes. Our solution leverages multiple AI models and technologies to create an engaging, interactive learning environment.

## Main Portal (Lang Portal)

The main portal serves as the central hub for all learning activities:

- **Spanish History**: Learn about the rich history and evolution of the Spanish language
- **Word Groups**: Organise vocabulary into themed collections (Core Verbs, Common Phrases, Travel Vocabulary)
- **Flashcards**: Practise vocabulary with interactive flashcards featuring AI-generated images
- **Progress Tracking**: Monitor your learning journey with detailed statistics and visualisations
- **Study Sessions**: View your learning history and track time spent on activities

## Study Activities

### 1. Fluency FC (Port 8008)
A retro-style football game for learning Spanish. Travel through Spanish cities (Sevilla, Mallorca, Madrid, Barcelona) while completing language challenges and penalty shootouts. Built with Phaser 3 and Node.js.

### 2. Writing Practice (Port 8081)
An AI-powered writing feedback system that analyses handwritten Spanish translations. Features include:
- Handwriting analysis using OpenAI GPT-4o
- Detailed grammar, vocabulary, and style feedback
- Progress tracking for written exercises
- Built with Streamlit

### 3. Listening Comprehension (Port 8501)
Practise listening skills with authentic Spanish content:
- YouTube transcript extraction and processing
- Vector database storage for efficient retrieval
- AI-generated comprehension questions
- Progress tracking with SQLite
- Built with Streamlit

### 4. Song Vocabulary
An AI agent that autonomously searches for and processes Spanish song lyrics:
- SerpAPI & DuckDuckGoAPI integration for web search
- Vocabulary extraction and translation
- Cultural context for language learning
- Built with FastAPI

## Backend Integration

The Flask backend (Port 5174) provides:
- Centralised data storage and retrieval
- Study session management
- Progress tracking
- API endpoints for all frontend components

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Git

### Quick Start with Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/free-genai-bootcamp-2025.git
   cd free-genai-bootcamp-2025
   ```

2. Create a `.env` file in the root directory with:
   ```
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_key

   # SerpAPI Configuration (for Song Vocabulary)
   SERP_API_KEY=your_serp_api_key

3. Port Configuration
   ```
   WRITING_PRACTICE_PORT=8081
   FLUENCY_FC_PORT=8008
   LISTENING_COMP_PORT=8501
   MAIN_FRONTEND_PORT=5173
   MAIN_BACKEND_PORT=5174
   ```

4. Start all services with Docker Compose:
   ```bash
   docker-compose up
   ```

5. Access the main portal at `http://localhost:5173`

### Running Individual Components

If you prefer to run components individually, you can install all dependencies at once using the main requirements.txt file:

```bash
pip install -r requirements.txt
```

**Main Portal Frontend**:
```bash
cd lang-portal/frontend
npm install
npm run dev
```

**Main Portal Backend**:
```bash
cd lang-portal/backend-flask
python run_server.py
```

**Fluency FC**:
```bash
cd Fluency-FC
npm install
node server.js
```

**Writing Practice**:
```bash
cd writing-practice
streamlit run app.py
```

**Listening Comprehension**:
```bash
cd listening-comp
streamlit run frontend/main.py
```


## AI Integration

The platform was initially developed using Azure AI Foundry to provide models for chat completion and text-to-speech capabilities. We utilised Azure Playgrounds for model fine-tuning and prompt testing. For simplicity and to reduce configuration complexity, we've transitioned to OpenAI models, which allows users to run all components with a single API key:

- **GPT-4o**: For handwriting analysis and feedback generation
- **DALL-E**: For generating custom vocabulary images
- **GPT-4o-tts**: For text-to-speech capabilities (replaced the old tts-1 model)
- **Ada Embedding Model**: For vector embeddings with ChromaDB in the listening practice app

## Testing

The platform has been thoroughly tested:
- Backend tests: 7/7 passing (database integrity, API responses, CORS configuration)
- Frontend tests: 4/4 passing (core navigation, theme switching)
- Overall coverage: ~70% of implemented features

## Development Challenges

We faced several challenges during development:
- Integrating multiple apps with different frameworks into the main portal
- Containerising components with Docker
- CSS issues when converting Writing Practice to Streamlit from Gradio
- Backend Flask implementation issues (temporarily moved to Node.js before fixing Flask)
- Cursor creating a plethora of new files and folders outwith the original structure
- Lack of Developer knowledge

## Future Enhancements

1. **Sign to Speak**: ASL finger-spelling recognition via webcam
2. **Multi-language Support**: Extend beyond Spanish
3. **Mobile Application**: Companion app for on-the-go learning
4. **Advanced Analytics Dashboard**: Deeper insights into learning patterns
5. **Community Features**: Collaborative learning and peer review
6. **Offline Mode**: Learning without internet connectivity
7. **Advanced ASR Implementation**: Real-time conversation practice
8.  **Add more words**: Bulk out the vocabulary database

## Screenshots

Check the `/screenshots` directory for visual documentation of the project, including:
- Full site walkthrough demonstration
- Individual component demonstrations
- User interface screenshots
- Learning progress visualisations
- Evidence of opea chat qna implementation

