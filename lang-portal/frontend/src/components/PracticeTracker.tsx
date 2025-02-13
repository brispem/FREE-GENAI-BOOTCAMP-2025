import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PracticeScore {
  date: string;
  correct: number;
  wrong: number;
  total: number;
}

export function PracticeTracker() {
  const [scores, setScores] = useState<PracticeScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPracticeHistory();
  }, []);

  const loadPracticeHistory = async () => {
    try {
      const history = await api.practice.getHistory();
      setScores(history);
    } catch (error) {
      console.error('Failed to load practice history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Practice Progress 📊</h2>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-4">
            {scores.map((score, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span>{score.date}</span>
                  <span>{score.correct}/{score.total} correct</span>
                </div>
                <Progress value={(score.correct / score.total) * 100} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 