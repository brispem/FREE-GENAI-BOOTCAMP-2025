import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Activity {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
  launchUrl: string;
}

const activities: Activity[] = [
  {
    id: '1',
    title: 'Flashcards',
    description: 'Practice vocabulary with interactive flashcards',
    difficulty: 'Beginner',
    icon: '🎴',
    launchUrl: '/activities/flashcards'
  },
  {
    id: '2',
    title: 'Word Match',
    description: 'Match Spanish words with their English translations',
    difficulty: 'Beginner',
    icon: '🔤',
    launchUrl: '/activities/word-match'
  },
  {
    id: '3',
    title: 'Sentence Builder',
    description: 'Create sentences using learned vocabulary',
    difficulty: 'Intermediate',
    icon: '📝',
    launchUrl: '/activities/sentence-builder'
  }
];

export function ActivityLauncher() {
  const launchActivity = (activity: Activity) => {
    // Here we'll handle launching the activity
    window.location.href = activity.launchUrl;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{activity.icon}</span>
              <h3 className="text-xl font-bold">{activity.title}</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{activity.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {activity.difficulty}
              </span>
              <Button 
                data-testid={`launch-button-${activity.id}`}
                onClick={() => launchActivity(activity)}
              >
                Launch {activity.icon}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 