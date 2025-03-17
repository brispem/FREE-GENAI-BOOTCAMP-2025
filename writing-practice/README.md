# Spanish Writing Practice

An AI-powered application for practicing Spanish writing skills with immediate feedback and analysis.

## Features

- **Sentence Generation**: Provides English sentences to translate to Spanish
- **Handwriting Recognition**: Upload handwritten Spanish translations
- **AI Feedback**: Receive detailed feedback on grammar, vocabulary, and style
- **Progress Tracking**: Monitor improvement over time
- **Difficulty Levels**: Practice at various skill levels

## Technology Stack

- **Frontend**: Gradio
- **Backend**: Python
- **AI**: OpenAI GPT-4o for handwriting analysis and feedback
- **Database**: SQLite for progress tracking

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Create a `.env` file with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   PORT=8081
   ```

3. Run the application:
   ```
   python app.py
   ```

4. Access the application at `http://localhost:8081`

## Usage

1. Click "Generate New Sentence" to get an English sentence
2. Write the Spanish translation by hand on paper
3. Take a photo or scan your handwritten translation
4. Upload the image to receive AI feedback
5. Review your progress in the history section

## Integration with Language Portal

This application integrates with the main Spanish Language Learning Portal:
- Can be launched from the Study Activities section
- Includes navigation buttons to return to the main portal
- Shares styling elements for consistent user experience

## Project Structure

- `app.py`: Main application file with Gradio interface
- `config.py`: Configuration and environment variables
- `utils/`: Utility functions for image processing and API calls
- `data/`: Database and data files
- `shared_styles/`: CSS for consistent styling with the main portal

## Development

The application uses Gradio for the interface, which makes it easy to modify:
1. The main interface is defined in the `create_ui()` function in `app.py`
2. OpenAI integration is in the `grade_handwriting()` method
3. Sentence generation logic is in the `generate_sentence()` method 