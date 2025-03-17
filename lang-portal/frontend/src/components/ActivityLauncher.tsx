import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Activity {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
  command: string;
  port: number;
  disabled?: boolean;
}

const activities: Activity[] = [
  {
    id: '1',
    title: 'Listening Practice',
    description: 'Improve your Spanish listening comprehension with native audio',
    difficulty: 'Beginner',
    icon: '🎧',
    command: 'streamlit run frontend/main.py',
    port: 8501
  },
  {
    id: '2',
    title: 'Writing Practice',
    description: 'Practice writing Spanish sentences and paragraphs',
    difficulty: 'Intermediate',
    icon: '✍️',
    command: 'python app.py',
    port: 8081
  },
  {
    id: '3',
    title: 'Flashcards',
    description: 'Learn vocabulary with interactive flashcards (Coming Soon)',
    difficulty: 'Beginner',
    icon: '🎴',
    command: '',
    port: 0,
    disabled: true
  }
];

export function ActivityLauncher() {
  const launchActivity = async (activity: Activity) => {
    try {
      const response = await fetch('http://localhost:3001/api/launch-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          activityId: activity.id,
          command: activity.command
        })
      });

      if (!response.ok) {
        throw new Error('Failed to launch activity');
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const url = `http://localhost:${activity.port}`;
      window.open(url, '_blank');

    } catch (error) {
      console.error('Error:', error);
      alert('Error launching activity');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent">
          Study Activities
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Choose an activity to practice your Spanish</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => (
          <Card key={activity.id} className="border-spanish-red/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{activity.icon}</span>
                <h3 className="text-xl font-bold">{activity.title}</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600 dark:text-gray-400">{activity.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {activity.difficulty}
                </span>
                {!activity.disabled ? (
                  <Button 
                    onClick={() => launchActivity(activity)}
                    data-testid={`launch-button-${activity.id}`}
                    className="bg-gradient-to-r from-spanish-red to-spanish-yellow hover:from-spanish-red/90 hover:to-spanish-yellow/90"
                  >
                    Launch {activity.icon}
                  </Button>
                ) : (
                  <span className="text-sm text-gray-500 italic">Coming Soon</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 