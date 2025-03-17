# FREE-GENAI-BOOTCAMP-2025
ExamProCo Free Gen-AI Bootcamp - Spanish Language Learning Portal

## Business Scenario
You've been hired as an AI Engineer for a Spanish Language Learning School to extend the language offering and also augment the learning experience for students between instructor-led classes.

The school has an existing learning portal and learning record store. 
You've been tasked to:
- Build a collection of learning apps using various different use-cases of AI
- Maintain the learning experience the learning portal using AI developer tools
- Extend the platform to support various different languages

## Project Overview
As AI Engineers, we've successfully developed an integrated suite of AI-powered learning applications that extend the language offering and augment the learning experience for students between instructor-led classes.

Our solution leverages multiple AI models and technologies to create an engaging, interactive learning environment that addresses the key requirements outlined in the bootcamp brief.

## Implemented AI Solutions

### 1. Listening Practice Application
- **YouTube Transcript Integration**: Extracts and processes authentic Spanish content from YouTube videos
- **Vector Database Storage**: Stores transcripts in a vector database for efficient retrieval and contextual learning
- **Azure AI Text-to-Speech**: Converts text to natural-sounding Spanish audio with native accents
- **AI-Generated Comprehension Questions**: Automatically creates relevant practice questions based on content
- **Progress Tracking**: Uses SQLite to store user progress and adapt difficulty levels

### 2. Writing Practice Application
- **OpenAI GPT-4o Integration**: Analyzes handwritten Spanish translations
- **Computer Vision**: Processes uploaded images of handwritten text
- **Intelligent Feedback Generation**: Provides detailed grammar, vocabulary, and style feedback
- **Adaptive Learning**: Adjusts difficulty based on user performance
- **Sentence Generation**: Creates contextually relevant practice sentences

### 3. Flashcards Application
- **OpenAI DALL-E Integration**: Generates custom images for location-based vocabulary
- **Spaced Repetition Algorithm**: Optimizes learning retention through intelligent card sequencing
- **Multi-modal Learning**: Combines text and image-based learning approaches
- **Interactive Assessment**: Provides immediate feedback with visual reinforcement

### 4. Spanish Language Portal
- **Centralized Learning Hub**: Integrates all AI applications into a cohesive learning experience
- **Progress Analytics**: Tracks and visualizes learning progress across all activities
- **Vocabulary Management**: AI-assisted organization and categorization of Spanish vocabulary
- **Personalized Learning Paths**: Adapts content based on user performance and preferences

### 5. Azure AI Foundry Translation Service
- **Custom Translator Implementation**: Built using Azure AI Foundry's text-to-speech models
- **Model Fine-tuning**: Utilized Azure AI Studio playground to fine-tune translation models
- **Bilingual Capabilities**: Supports translation between English and Spanish with high accuracy
- **Natural Pronunciation**: Integrates with text-to-speech for authentic accent reproduction
- **Context-Aware Translation**: Maintains semantic meaning across language barriers

### 6. Song Vocabulary Agent
- **Agentic Implementation**: Created an AI agent that autonomously searches for and processes Spanish song lyrics
- **SerpAPI & DuckDuckGoAPI Integration**: Enables web search capabilities to find authentic Spanish songs and lyrics
- **Autonomous Decision Making**: Agent determines the most relevant content based on user queries
- **Structured Output Generation**: Produces formatted vocabulary lists with translations and context

## Technologies Used

### AI Models and Services
- **OpenAI GPT-4o**: For handwriting analysis, feedback generation, and content creation
- **OpenAI DALL-E**: For generating custom vocabulary images
- **Azure AI Foundry**: For translation services and text-to-speech capabilities
- **Azure Cognitive Services**: For comprehensive language understanding and processing
- **Azure AI Studio**: For model fine-tuning and playground experimentation
- **YouTube Transcript API**: For extracting authentic Spanish content
- **Vector Embeddings**: For semantic search and contextual learning
- **SerpAPI & DuckDuckGoAPI**: For web search capabilities in the Song Vocabulary Agent
- **HuggingFace Models**: Explored and implemented various open-source models

### Model Fine-Tuning and Optimization
- **Prompt Engineering**: Carefully crafted prompts in Azure AI Studio playground to ensure consistent outputs
- **Parameter Optimization**: Fine-tuned model parameters for optimal performance in language learning contexts
- **Output Formatting**: Standardized response formats for seamless integration with the learning platform
- **Context Window Management**: Optimized context handling for maintaining conversation history
- **Performance Benchmarking**: Tested various model configurations to achieve the best balance of accuracy and speed

### Development Stack
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui, Lucide icons, Sonner toast notifications
- **Backend**: Flask (Python), Node.js
- **AI Integration**: OpenAI API, Azure AI SDK
- **Data Storage**: SQLite, Vector databases
- **UI Frameworks**: Streamlit, Gradio
- **Deployment**: Docker, Azure VM (Ubuntu), Local development environment
- **Development Tools**: Cursor AI assistant for enhanced coding productivity

### Testing and Quality Assurance
- **Unit Testing**: Implemented comprehensive test suite for core functionality
- **Integration Testing**: Verified seamless interaction between different application components
- **User Acceptance Testing**: Conducted sessions to validate usability and learning effectiveness
- **Performance Testing**: Optimized response times and resource utilization
- **Cross-browser Testing**: Ensured compatibility across major web browsers

## How Our Implementation Meets the Brief

| Brief Requirement | Our Implementation |
|-------------------|-------------------|
| Spanish Text Adventure | Implemented as part of the Listening Practice app with interactive comprehension exercises |
| Spanish Sentence Constructor | Core functionality of the Writing Practice app with AI-guided translation assistance |
| Subtitles to Vocabulary | Integrated in Listening Practice with YouTube transcript extraction and vocabulary building |
| Speech to Learn | Implemented through Azure TTS in the Listening Practice application |
| Spanish Teaching Assistant | Implemented across all applications with AI-powered feedback and guidance |
| RAG Implementation | Utilized in the Listening Practice app to extract content and enable contextual questioning |
| Translation Services | Custom implementation using Azure AI Foundry with fine-tuned models |
| AI Agents | Implemented in Song Vocabulary tool with autonomous web search and content processing |

## Learning Journey
Throughout this 6-week bootcamp, we gained extensive AI engineering experience through:
- Over 40 hours of content from ExamProCo library provided by Andrew Brown and guests
- Hands-on experience with OpenAI models and Azure AI services
- Deployment of chat QnA on Ubuntu VM via Azure
- Exploration of HuggingFace models and integration techniques
- Frontend development skills with React, shadcn/ui, and modern UI components
- AI-assisted development using Cursor as a coding assistant
- Version control with Git and GitHub repositories for collaborative development and code management

## Future Enhancements

In future iterations, we plan to extend the platform with:

1. **Daily Life Visual Novel Generator**: Create immersive scenarios with consistent characters and dialogue
2. **Sign to Speak**: Implement ASL finger-spelling recognition via webcam
3. **Multi-language Support**: Extend beyond Spanish to other languages
4. **Mobile Application**: Develop a companion mobile app for on-the-go learning
5. **Advanced Analytics Dashboard**: Provide deeper insights into learning patterns and progress
6. **Community Features**: Add collaborative learning and peer review capabilities
7. **Offline Mode**: Enable learning without internet connectivity
8. **Advanced ASR Implementation**: Integrate optimized speech recognition for real-time conversation practice

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- OpenAI API key
- Azure Cognitive Services account
- Azure AI Foundry access

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/free-genai-bootcamp-2025.git
   cd free-genai-bootcamp-2025
   ```

2. Set up environment variables:
   - Create `.env` files in each application directory with the required API keys

3. Install dependencies:
   ```
   # For the main portal
   cd lang-portal
   npm install
   cd backend-flask
   pip install -r requirements.txt
   
   # For the listening practice app
   cd ../../listening-comp
   pip install -r requirements.txt
   
   # For the writing practice app
   cd ../writing-practice
   pip install -r requirements.txt
   ```

4. Start the application:
   ```
   cd ../lang-portal
   ./start-servers.bat
   ```

5. Access the portal at `http://localhost:5173`

## Conclusion

Our implementation demonstrates the effective use of various AI models and technologies to create an engaging, interactive Spanish language learning experience. By leveraging cutting-edge AI capabilities including natural language processing, computer vision, text-to-speech, and generative AI, we've successfully built a comprehensive solution that meets and exceeds the requirements of the bootcamp brief.

The extensive use of Azure AI Foundry and model fine-tuning in the Azure AI Studio playground has allowed us to create highly optimized, context-aware language learning tools that provide a personalized and effective learning experience. Our approach to model optimization ensures consistent outputs that are perfectly tailored to language learning scenarios.

The modular architecture allows for easy extension to support additional languages and features in the future, making this a scalable solution for the Spanish Language Learning School's needs.
