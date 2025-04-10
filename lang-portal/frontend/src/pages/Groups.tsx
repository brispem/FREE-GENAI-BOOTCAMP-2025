import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, ArrowRight, ChevronRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { API_CONFIG } from '@/config/api';

interface GroupStats {
  id: string;
  name: string;
  icon: string;
  totalAttempts: number;
  overallProgress: number;
  lastPractice: string;
}

interface WordStats {
  correct: number;
  wrong: number;
}

interface WordWithStats {
  totalAttempts: number;
  successRate: number;
}

export default function Groups() {
  const [groups, setGroups] = useState<GroupStats[]>([
    {
      id: "core-verbs",
      name: "Core Verbs",
      icon: "🎯",
      totalAttempts: 0,
      overallProgress: 0,
      lastPractice: "Never"
    },
    {
      id: "common-phrases",
      name: "Common Phrases",
      icon: "💬",
      totalAttempts: 0,
      overallProgress: 0,
      lastPractice: "Never"
    },
    {
      id: "travel-vocabulary",
      name: "Travel Vocabulary",
      icon: "✈️",
      totalAttempts: 0,
      overallProgress: 0,
      lastPractice: "Never"
    }
  ]);
  const [loading, setLoading] = useState(true);

  // Map string IDs to numeric IDs
  const GROUP_ID_MAP: Record<string, number> = {
    'core-verbs': 1,
    'common-phrases': 2,
    'travel-vocabulary': 3
  };

  useEffect(() => {
    const fetchGroupsStats = async () => {
      try {
        const updatedGroups = await Promise.all(
          groups.map(async (group) => {
            const numericId = GROUP_ID_MAP[group.id];
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GROUPS}/${numericId}`);
            if (!response.ok) return group;

            const data = await response.json();
            const wordsWithStats = (data.words || []).map((word: WordStats) => {
              const totalAttempts = (word.correct || 0) + (word.wrong || 0);
              const successRate = totalAttempts > 0 
                ? Math.round((word.correct / totalAttempts) * 100) 
                : 0;
              return { totalAttempts, successRate };
            });

            const wordsWithAttempts = wordsWithStats.filter((word: WordWithStats) => word.totalAttempts > 0);
            const overallProgress = wordsWithAttempts.length > 0
              ? Math.round(
                  wordsWithAttempts.reduce((sum: number, word: WordWithStats) => sum + word.successRate, 0) / 
                  wordsWithAttempts.length
                )
              : 0;

            return {
              ...group,
              totalAttempts: wordsWithStats.reduce((sum: number, word: WordWithStats) => sum + word.totalAttempts, 0),
              overallProgress,
              lastPractice: data.group.last_practice || "Never"
            };
          })
        );

        setGroups(updatedGroups);
      } catch (error) {
        console.error('Error fetching groups stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupsStats();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center p-12 rounded-lg shadow-md bg-gradient-to-br from-white via-white to-yellow-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border-l-4 border-[#AA151B]">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent">
            Word Groups
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Organized collections of Spanish vocabulary
          </p>
        </div>

        {/* Groups Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{group.name}</h2>
                  <span className="text-2xl">{group.icon}</span>
                </div>
                <div className="space-y-2">
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-[#AA151B]" />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Total Attempts:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{group.totalAttempts}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Overall Progress:</span>
                        <span className="font-medium text-green-500">{group.overallProgress}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Last Practice:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{group.lastPractice}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                        <div 
                          className="bg-gradient-to-r from-[#AA151B] to-[#F1BF00] h-2.5 rounded-full" 
                          style={{ width: `${group.overallProgress}%` }}
                        ></div>
                      </div>
                    </>
                  )}
                </div>
                <Link
                  to={`/groups/${group.id}`}
                  className="mt-6 inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-[#AA151B] to-[#AA151B] hover:to-[#F1BF00] text-white rounded-lg transition-all duration-300"
                >
                  View Group <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-[#F1BF00] p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Learning Tips</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Focus on Themes", desc: "Study related words together for better retention" },
              { title: "Regular Practice", desc: "Review each group at least once a week" },
              { title: "Track Progress", desc: "Monitor your completion rate for motivation" }
            ].map((tip) => (
              <div key={tip.title} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{tip.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}