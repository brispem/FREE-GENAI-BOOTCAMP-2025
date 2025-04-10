# Spanish Song Vocabulary Tool

An AI-powered tool for extracting and learning vocabulary from Spanish songs, integrated with the main language learning portal.

## Features

- **Song Search**: Find Spanish songs and their lyrics
- **Vocabulary Extraction**: AI-powered identification of key vocabulary
- **Translation**: Automatic translation of lyrics and vocabulary
- **Cultural Context**: Learn language through music and culture
- **Progress Tracking**: Monitor vocabulary acquisition

## Technology Stack

- **Backend**: FastAPI
- **AI Integration**: OpenAI GPT-4
- **Database**: File-based JSON storage
- **APIs**: Lyrics and search integration

## Setup

1. Ensure you have installed the root requirements:
   ```bash
   # From project root
   pip install -r requirements.txt
   ```

2. Environment variables are configured in the root `.env` file.

3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

### Agent Endpoint
```bash
curl -X POST http://localhost:8000/api/agent \
    -H "Content-Type: application/json" \
    -d '{
        "message_request": "Find lyrics for [song name]"
    }'
```

## Project Structure

```
song-vocab/
├── tools/
│   ├── agent.py
│   ├── extract_vocabulary.py
│   └── save_results.py
├── outputs/
│   ├── lyrics/
│   └── vocabulary/
├── main.py
└── requirements.txt
```

## Integration with Language Portal

- Integrated directly into the main portal
- Accessible through the Study Activities section
- Vocabulary syncs with main word database
- Progress tracking through main portal

## Development

### Key Components

1. **Lyrics Search**
   - Song title and artist search
   - Lyrics retrieval and formatting
   - Error handling for missing content

2. **Vocabulary Extraction**
   - AI-powered word identification
   - Context-aware translations
   - Difficulty level assessment

3. **File Management**
   - Organized storage structure
   - Separate lyrics and vocabulary files
   - JSON format for easy access

## Usage

1. Enter a Spanish song name or artist
2. System searches for and retrieves lyrics
3. AI extracts key vocabulary
4. Results are saved in organized files
5. Access vocabulary through main portal

## Output Structure

### Lyrics Files
```
outputs/lyrics/[song-name].json
```

### Vocabulary Files
```
outputs/vocabulary/[song-name].json
```

## Troubleshooting

1. If lyrics search fails:
   - Check song name spelling
   - Try including artist name
   - Verify song has Spanish lyrics

2. If vocabulary extraction fails:
   - Check OpenAI API key
   - Verify lyrics were found
   - Check file permissions

3. For file saving issues:
   - Verify directory structure exists
   - Check write permissions
   - Ensure valid JSON format

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

### Testing the SERP tool

```sh
python -m tests.serp-tool-test
```

### Testing the DGG tool

```sh
python -m tests.dgg-tool-test
```

### Testing Ollama SDK

```sh
python -m tests.ollama-test
```