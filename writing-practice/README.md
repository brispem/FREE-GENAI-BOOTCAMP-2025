# Spanish Writing Practice Application

An AI-powered application for practicing Spanish writing skills with instant feedback and analysis.

## Features

- **AI-Powered Analysis**: Uses OpenAI GPT-4o for handwriting analysis and feedback
- **Interactive Practice**: Generate English sentences for Spanish translation practice
- **Instant Feedback**: Detailed grammar, vocabulary, and style feedback
- **Progress Tracking**: Monitor improvement over time
- **Handwriting Recognition**: Upload and analyze handwritten Spanish translations

## Technology Stack

- **Framework**: Gradio
- **Backend**: Python
- **AI Integration**: OpenAI GPT-4o
- **Image Processing**: Built-in Gradio image handling

## Setup

1. Ensure you have installed the root requirements:
   ```bash
   # From project root
   pip install -r requirements.txt
   ```

2. Environment variables are configured in the root `.env` file.

3. Run the application:
   ```bash
   python app.py
   ```

4. Access the application at `http://localhost:8081`

## Usage

1. Click "Generate Sentence" to get an English sentence
2. Write the Spanish translation by hand
3. Take a photo or scan of your handwritten translation
4. Upload the image to receive AI feedback on:
   - Transcription accuracy
   - Translation correctness
   - Grammar and vocabulary usage
   - Handwriting clarity

## Integration with Language Portal

This application integrates with the main Spanish Language Learning Portal:
- Launched from the Study Activities section
- Includes navigation back to the main portal
- Shares progress data with the main system

## Project Structure

- `app.py`: Main application logic and Gradio interface
- `config.py`: Configuration management
- `prompts.yaml`: System prompts for GPT-4o
- `.env`: Environment variables

## Development

### Key Components

1. **Sentence Generation**
   - Uses GPT-4o for contextual sentence creation
   - Difficulty levels from beginner to advanced
   - Topic-based sentence generation

2. **Image Analysis**
   - Handwriting recognition using GPT-4o Vision
   - Multi-aspect feedback generation
   - Clear error identification

3. **Progress Tracking**
   - Session history
   - Error pattern identification
   - Improvement metrics

## Troubleshooting

1. If OpenAI API issues occur:
   - Verify your API key in the `.env` file
   - Check your API usage limits
   - Ensure proper network connectivity

2. If image upload fails:
   - Check image format (JPG/PNG supported)
   - Verify image size is within limits
   - Ensure good image quality and lighting

3. For interface issues:
   - Clear browser cache
   - Try a different browser
   - Check console for error messages

## Future Enhancements

1. Additional practice modes
2. Enhanced error analytics
3. Collaborative practice sessions
4. Mobile-optimized interface

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 