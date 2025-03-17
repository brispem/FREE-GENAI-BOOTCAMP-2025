# Frontend Documentation

## Overview

The Spanish Language Learning Portal frontend is built with React, TypeScript, and Tailwind CSS. It provides an interactive interface for language learners to practice Spanish through various activities, manage vocabulary, and track progress.

## Architecture

The frontend follows a component-based architecture with the following structure:

- **Pages**: Main views of the application
- **Components**: Reusable UI elements
- **Hooks**: Custom React hooks for shared functionality
- **Lib**: Utility functions and API clients
- **Types**: TypeScript type definitions
- **Styles**: Global CSS and Tailwind configuration

## Key Features

### Navigation

The main navigation component (`Navigation.tsx`) provides access to all sections of the application:
- Dashboard
- Spanish History
- Study Activities
- Words
- Word Groups
- Sessions
- Settings

### Study Activities

The portal includes several interactive study activities:

#### Listening Practice
- Integration with a Streamlit-based application
- Runs on port 8501
- Provides Spanish audio comprehension exercises
- Uses YouTube transcripts and Azure Text-to-Speech

#### Writing Practice
- Integration with a Gradio-based application
- Runs on port 8081
- Allows practice of Spanish writing with AI feedback
- Uses OpenAI for handwriting analysis

#### Flashcards
- Built directly into the React frontend
- Text-based mode for typing translations
- Image-based mode with AI-generated visuals from OpenAI
- Multiple-choice options and score tracking

### Vocabulary Management

The Words and Word Groups sections allow users to:
- View and manage Spanish vocabulary
- Create custom groups of related words
- Track learning progress for each word
- Practice with specific word sets

## Component Structure

### Pages

- `Dashboard.tsx`: Home page with overview and quick access
- `StudyActivities.tsx`: List of available learning activities
- `Words.tsx`: Vocabulary management
- `Groups.tsx`: Word group management
- `SpanishHistory.tsx`: Cultural and historical content
- `Settings.tsx`: User preferences
- `ListeningPractice.tsx`: Redirects to the Streamlit app
- `WritingPractice.tsx`: Redirects to the Gradio app
- `Flashcards.tsx`: Interactive flashcard interface

### Key Components

- `Navigation.tsx`: Main navigation bar
- `ActivityCard.tsx`: Card component for study activities
- `ActivityLauncher.tsx`: Handles launching external activities
- `PracticeTracker.tsx`: Tracks and displays learning progress
- `WordList.tsx`: Displays vocabulary items
- `Breadcrumbs.tsx`: Navigation breadcrumbs

## State Management

The application uses React's built-in state management with:
- `useState` for component-level state
- `useContext` for theme and user preferences
- Custom hooks for shared functionality

## API Integration

The frontend communicates with several backend services:
- Main Flask backend on port 5174
- Streamlit listening practice on port 8501
- Gradio writing practice on port 8081

API calls are made using the Fetch API with helper functions in `lib/api.ts`.

## External Integrations

- **OpenAI**: Used for image generation in flashcards
- **Azure Cognitive Services**: Used for translation and text-to-speech

## Styling

The application uses:
- Tailwind CSS for utility-based styling
- Custom components from shadcn/ui
- CSS variables for theming
- Dark/light mode support

## Getting Started for Developers

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

## Building for Production

## Project History

### Initial Generation
- Site initially generated using Bolt AI
- Core structure and basic pages created
- Basic Spanish learning portal functionality established

### Major Enhancements
1. **Theme System**
   - Implemented dark/light mode toggle
   - Added Spanish-themed color palette:
     - Primary Red: #AA151B
     - Primary Yellow: #F1BF00
   - Smooth theme transitions
   - Persistent theme choice

2. **Visual Redesign**
   - Added gradient backgrounds
   - Implemented Spanish flag colors throughout
   - Enhanced card designs with hover effects
   - Improved navigation visibility
   - Added progress indicators

3. **New Features**
   - Spanish History page with cultural insights
   - Interactive study sessions
   - Progress tracking
   - Word group management
   - Session history

## March 2024 Updates

### Backend Migration
- Moved from Flask to Node.js backend due to persistent CORS issues
- All frontend components now communicate with Node.js backend on port 3001
- Activity launching and dashboard stats now handled by Node.js

### Updated Study Activities
Current activities:
1. **Listening Practice** 🎧
   - Streamlit-based application (port 8501)
   - Spanish audio comprehension
   - YouTube transcript integration
   - Interactive exercises

2. **Writing Practice** ✍️
   - Gradio-based application (port 8081)
   - Handwriting practice
   - AI-powered feedback
   - Sentence generation

3. **Flashcards** 🎴 (Coming Soon)
   - Vocabulary practice
   - Spaced repetition
   - Progress tracking

### Technical Updates
- ActivityLauncher.tsx now handles Python app launching via Node.js
- Updated port configurations (3001 for backend)
- Removed Flask-specific error handling
- Simplified CORS handling through Node.js

## Setup & Installation

### Prerequisites
- Node.js (Latest LTS version)
- npm (comes with Node.js)

### Initial Setup
```bash
cd lang-portal/frontend
npm install
npm run dev
```

### Access Application
- Development server: http://localhost:5173
- Production build: Use `npm run build`

## Project Overview

### Tech Stack
- Vite + React with TypeScript
- Tailwind CSS
- shadcn/ui components
- React Router
- Lucide React icons

### Theme System
The application supports both light and dark modes:
- Theme toggle in navigation bar
- Persistent theme choice using localStorage
- Spanish-themed color palette:
  ```css
  --spanish-red: #AA151B
  --spanish-yellow: #F1BF00
  ```
- Dark mode optimized components

### Key Features & Pages

1. **Navigation (`/components/Navigation.tsx`)**
   - Responsive header with theme toggle
   - Dynamic route highlighting
   - Spanish branding

2. **Dashboard (`/pages/Dashboard.tsx`)**
   - Welcome message
   - Quick stats overview
   - Activity shortcuts
   - Learning progress

3. **Spanish History (`/components/SpanishHistory.tsx`)**
   - Language origins
   - Geographic distribution
   - Cultural insights
   - Interactive timeline
   - Spanish flag integration

4. **Study Activities (`/pages/StudyActivities.tsx`)**
   - Interactive learning modules
   - Activity previews
   - Launch interface

5. **Words Management (`/pages/Words.tsx`)**
   - Vocabulary list
   - Sorting functionality
   - Progress tracking

6. **Word Groups (`/pages/Groups.tsx`)**
   - Organized collections
   - Progress visualization
   - Quick access

7. **Sessions (`/pages/Sessions.tsx`)**
   - Study history
   - Time tracking
   - Performance metrics

### File Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── SpanishHistory.tsx
│   │   ├── theme-provider.tsx
│   │   └── ui/
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Groups.tsx
│   │   ├── Sessions.tsx
│   │   ├── Settings.tsx
│   │   ├── StudyActivities.tsx
│   │   └── Words.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .vscode/
│   ├── settings.json
│   └── extensions.json
├── public/
├── index.html
├── postcss.config.js
├── tailwind.config.js
└── package.json
```

### Configuration Files

1. **VSCode Settings**
```json
{
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false,
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact",
    "javascript": "javascript",
    "javascriptreact": "javascriptreact"
  },
  "editor.quickSuggestions": {
    "strings": true
  },
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit"
  }
}
```

2. **Prettier Configuration**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "endOfLine": "auto"
}
```

### Styling Guidelines
- Use Tailwind CSS classes
- Follow dark mode patterns with `dark:` prefix
- Use Spanish color scheme consistently
- Maintain responsive design
- Follow component structure:
  - Hero section
  - Content area
  - Action items

### Best Practices
- Use TypeScript for type safety
- Follow component-based architecture
- Maintain dark mode compatibility
- Use Lucide icons consistently
- Implement responsive design
- Test both themes when making changes

## Development Guidelines

### Running the Application
1. Start development server:
   ```bash
   npm run dev
   ```
2. Build for production:
   ```bash
   npm run build
   ```

### Making Changes
- Components in src/components
- Pages in src/pages
- Maintain dark mode support
- Test both themes when making changes

## Next Steps

### Planned Features
1. User authentication
2. Progress analytics
3. Advanced study tools
4. Mobile optimization
5. Offline support

### Future Improvements
1. Performance optimization
2. Accessibility enhancements
3. Additional study activities
4. Enhanced progress tracking

## Support

### Common Issues
1. Port conflicts: Change port in vite.config.ts
2. Module not found: Check dependencies
3. Type errors: Verify TypeScript definitions

### Useful Commands
```bash
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # Run linter
```

## Notes
- Keep Node.js updated
- Check console for errors
- Test across browsers
- Maintain responsive design 