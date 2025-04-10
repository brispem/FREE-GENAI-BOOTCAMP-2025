# Fluency FC 🎮⚽️

A retro-style Spanish language learning game where football meets education! Travel across Spain, learn the language, and become a champion through penalty shootouts and language challenges.

## Game Overview

Take on the role of a new signing for Fluency FC as you journey through Spain's most iconic cities. Master basic Spanish while competing against legendary teams in Sevilla, Mallorca, Madrid, and Barcelona. Each city presents unique language challenges and nerve-wracking penalty shootouts that will test both your Spanish skills and your football prowess.

## Features

- **City-Based Progression**: Journey through Sevilla, Mallorca, Madrid, and Barcelona
- **Language Challenges**: Spanish vocabulary and grammar questions
- **Penalty Shootouts**: Test your football skills
- **Cultural Learning**: Experience Spanish cities and landmarks
- **Retro Graphics**: 8-bit style visuals and animations

## Technology Stack

- **Engine**: Phaser 3
- **Server**: Node.js
- **Graphics**: Retro 8-bit pixel art
- **Audio**: Chiptune-style sound effects

## Setup

1. Install dependencies:
   ```bash
   cd Fluency-FC
   npm install
   ```

2. Start the server:
   ```bash
   node server.js
   ```

3. Access the game at `http://localhost:8008`

## Game Structure

### Cities and Progression
1. **Sevilla**
   - Welcome scene with La Giralda
   - Basic Spanish greetings
   - First penalty challenge

2. **Mallorca**
   - Beachfront and cathedral backdrop
   - Intermediate vocabulary
   - Second penalty challenge

3. **Madrid**
   - Royal Palace setting
   - Advanced language questions
   - Semi-final penalty shootout

4. **Barcelona**
   - Sagrada Familia background
   - Final language test
   - Championship penalty shootout

### Controls

- **Quiz Mode**:
  - Use A/B/C keys for multiple choice
  - Space to confirm selections
  - T to toggle translations

- **Penalty Mode**:
  - Arrow keys for direction
  - Space bar for power
  - Enter to confirm

## Integration with Language Portal

- Launched from the Study Activities section
- Progress syncs with main portal
- Accessible via `http://localhost:8008`
- Returns to portal after completion

## Development

### Project Structure
```
Fluency-FC/
├── public/
│   ├── js/
│   │   ├── scenes/
│   │   └── game.js
│   ├── images/
│   └── audio/
├── server.js
└── package.json
```

### Key Files
- `server.js`: Node.js game server
- `public/js/game.js`: Main game configuration
- `public/js/scenes/`: Game scene files
- `public/images/`: Game assets and sprites

## Troubleshooting

1. If the game doesn't load:
   - Check if Node.js server is running
   - Verify port 8008 is available
   - Clear browser cache

2. For graphics issues:
   - Update browser to latest version
   - Check console for asset loading errors
   - Verify all image files are present

3. If controls don't respond:
   - Check keyboard input settings
   - Ensure game window is in focus
   - Verify no browser extensions interfering

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.