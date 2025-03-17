import React from 'react';
import { Link } from 'react-router-dom';
// Replace react-icons with icons from your UI library
import { Headphones, PenTool, Music, Layers } from 'lucide-react';
import { ActivityCard } from '@/components/ActivityCard';
import { MusicIcon } from 'lucide-react';

const StudyActivities: React.FC = () => {
  const fetchFlashcards = async () => {
    const response = await fetch('http://localhost:5174/api/flashcards');
    // ... rest of the function
  };

  const fetchWritingPractice = async () => {
    const response = await fetch('http://localhost:5174/api/writing-practice');
    // ... rest of the function
  };

  const fetchListeningPractice = async () => {
    const response = await fetch('http://localhost:5174/api/listening-practice');
    // ... rest of the function
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">Study Activities</h1>
      <p className="text-center text-muted-foreground mb-8">Choose an activity to practice your Spanish</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ActivityCard
          title="Song Vocabulary"
          description="Learn Spanish through popular songs with lyrics and translations"
          icon={<Music className="h-8 w-8" />}
          href="/song-vocabulary"
          level="All Levels"
        />
        
        <ActivityCard
          title="Listening Practice"
          description="Improve your Spanish listening comprehension with native audio"
          icon={<Headphones className="h-8 w-8" />}
          href="/listening-practice"
          level="Beginner"
        />
        
        <ActivityCard
          title="Writing Practice"
          description="Practice writing Spanish sentences and paragraphs"
          icon={<PenTool className="h-8 w-8" />}
          href="/writing-practice"
          level="Intermediate"
        />
        
        <ActivityCard
          title="Flashcards"
          description="Learn vocabulary with interactive flashcards"
          icon={<Layers className="h-8 w-8" />}
          href="/flashcards"
          level="Beginner"
        />
      </div>
    </div>
  );
};

export default StudyActivities;