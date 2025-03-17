# Spanish Language Learning Portal

A comprehensive language learning platform for Spanish learners, featuring interactive study activities, vocabulary management, and AI-powered learning tools.

## Features

- **Dashboard**: Track your learning progress and access all features
- **Study Activities**: Interactive learning experiences
  - **Listening Practice**: Improve comprehension with native Spanish audio
  - **Writing Practice**: Practice writing Spanish sentences with AI feedback
  - **Flashcards**: Learn vocabulary with text and image-based flashcards
- **Vocabulary Management**: Track and organize Spanish words and phrases
- **Word Groups**: Create custom collections of vocabulary
- **Spanish History**: Learn about Spanish language and culture

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Flask (Python)
- **AI Integration**: OpenAI API for image generation and writing feedback
- **External Services**: Azure Cognitive Services for translation and text-to-speech

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- OpenAI API key
- Azure Cognitive Services account (for translation and TTS)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/spanish-language-portal.git
   cd spanish-language-portal
   ```

2. Set up the frontend:
   ```
   cd frontend
   npm install
   ```

3. Set up the backend:
   ```
   cd ../backend-flask
   pip install -r requirements.txt
   ```

4. Create environment files:
   - Create `.env` in the `backend-flask` directory:
     ```
     OPENAI_API_KEY=your_openai_api_key
     TRANSLATOR_TEXT_RESOURCE_KEY=your_azure_translator_key
     TRANSLATOR_TEXT_REGION=your_azure_region
     AZURE_COGNITIVE_SERVICES_ENDPOINT=your_azure_endpoint
     ```

   - Create `.env` in the `listening-comp` directory:
     ```
     TRANSLATOR_TEXT_RESOURCE_KEY=your_azure_translator_key
     TRANSLATOR_TEXT_REGION=your_azure_region
     AZURE_COGNITIVE_SERVICES_ENDPOINT=your_azure_endpoint
     ```

   - Create `.env` in the `writing-practice` directory:
     ```
     OPENAI_API_KEY=your_openai_api_key
     PORT=8081
     ```

### Running the Application

1. Start the main application:
   ```
   ./start-servers.bat
   ```
   This will start both the frontend and backend servers.

2. Access the application at `http://localhost:5173`

3. To run individual activities:
   - Navigate to Study Activities in the portal
   - Click on the activity you want to launch
   - The activity will open in a new tab

## Study Activities

### Listening Practice

An interactive tool for improving Spanish listening comprehension:
- Uses YouTube transcripts for authentic Spanish content
- Azure Text-to-Speech for pronunciation
- Interactive exercises to test comprehension
- Progress tracking with SQLite database

### Writing Practice

Practice writing Spanish sentences with AI feedback:
- Handwriting recognition and analysis
- Immediate feedback on grammar and vocabulary
- Progress tracking
- Difficulty levels from beginner to advanced

### Flashcards

Learn Spanish vocabulary with interactive flashcards:
- Text-based mode for typing translations
- Image-based mode with AI-generated visuals
- Multiple-choice options
- Score tracking
- Shuffle and reset functionality

## Development

### Project Structure

- `frontend/`: React frontend application
- `backend-flask/`: Flask backend API
- `listening-comp/`: Listening practice activity
- `writing-practice/`: Writing practice activity
- `shared_styles/`: Common styling components
- `shared/`: Shared utilities and components

### API Endpoints

- `/api/words`: Vocabulary management
- `/api/groups`: Word group management
- `/api/practice`: Practice session tracking
- `/api/generate-image`: OpenAI image generation for flashcards
- `/api/launch-activity`: Activity launcher

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 