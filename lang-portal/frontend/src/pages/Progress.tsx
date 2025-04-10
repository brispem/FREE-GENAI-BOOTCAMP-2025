import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { API_CONFIG } from '@/config/api';

interface ProgressStats {
  overview: {
    total_words: number;
    words_attempted: number;
    completion_rate: number;
  };
  mastery_levels: {
    mastered: number;
    proficient: number;
    learning: number;
    needs_practice: number;
  };
  groups: Array<{
    id: number;
    name: string;
    total_words: number;
    words_attempted: number;
    completion_rate: number;
    accuracy: number;
  }>;
  trend: Array<{
    day: string;
    accuracy: number;
  }>;
}

const ProgressPage = () => {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROGRESS}`);
        if (!response.ok) {
          throw new Error(`Failed to load progress: ${response.statusText}`);
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#AA151B]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
        {/* Overview Section */}
        <Card className="p-6 border-t-4 border-[#AA151B]">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Overall Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">Words Mastered</span>
                <span className="font-semibold">{stats.overview.words_attempted} / {stats.overview.total_words}</span>
              </div>
              <Progress value={stats.overview.completion_rate} className="bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </Card>

        {/* Mastery Levels */}
        <Card className="p-6 border-t-4 border-[#F1BF00]">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Mastery Levels</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Mastered', value: stats.mastery_levels.mastered, color: 'bg-green-500' },
              { label: 'Proficient', value: stats.mastery_levels.proficient, color: 'bg-blue-500' },
              { label: 'Learning', value: stats.mastery_levels.learning, color: 'bg-yellow-500' },
              { label: 'Needs Practice', value: stats.mastery_levels.needs_practice, color: 'bg-red-500' }
            ].map(level => (
              <div key={level.label} className="text-center">
                <div className={`text-2xl font-bold mb-2 ${level.color} bg-clip-text text-transparent`}>
                  {level.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{level.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Group Progress */}
        <Card className="p-6 border-t-4 border-[#AA151B]">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Group Progress</h2>
          <div className="space-y-4">
            {stats.groups.map(group => (
              <div key={group.id} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{group.name}</span>
                  <span className="font-semibold">{group.words_attempted} / {group.total_words}</span>
                </div>
                <Progress value={group.completion_rate} className="bg-gray-200 dark:bg-gray-700" />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Accuracy: {group.accuracy.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Trend Chart */}
        <Card className="p-6 border-t-4 border-[#F1BF00]">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Weekly Trend</h2>
          <div className="h-48 flex items-end justify-between">
            {stats.trend.map(day => (
              <div key={day.day} className="flex flex-col items-center">
                <div className="h-32 w-12 bg-gray-100 dark:bg-gray-700 rounded-t-lg relative">
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-[#AA151B] to-[#F1BF00] rounded-t-lg"
                    style={{ height: `${day.accuracy}%` }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {new Date(day.day).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage; 