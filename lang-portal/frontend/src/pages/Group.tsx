import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Volume2, Loader2, Play, X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_CONFIG, fetchApi } from '@/config/api';

interface GroupStats {
  name: string;
  description: string;
  uniqueWords: number;
  totalAttempts: number;
  overallProgress: number;
  lastPractice: string;
}

interface WordResponse {
  id: number;
  spanish: string;
  english: string;
  correct: number;
  wrong: number;
}

interface WordStats {
  id: number;
  spanish: string;
  english: string;
  correct: number;
  wrong: number;
  totalAttempts: number;
  successRate: number;
}

interface Word {
  id: number;
  spanish: string;
  english: string;
  correct: number;
  wrong: number;
  totalAttempts?: number;
  successRate?: number;
}

interface Session {
  id: number;
  totalWords: number;
  correctWords: number;
  currentWordIndex: number;
  showAnswer: boolean;
  completed?: boolean;
  score?: number;
}

// Map string IDs to numeric IDs
const GROUP_ID_MAP: Record<string, number> = {
  'core-verbs': 1,
  'common-phrases': 2,
  'travel-vocabulary': 3
};

// Default group data
const DEFAULT_GROUPS: Record<string, { name: string; description: string }> = {
  'core-verbs': {
    name: "Core Verbs",
    description: "Essential Spanish verbs for everyday communication"
  },
  'common-phrases': {
    name: "Common Phrases",
    description: "Frequently used Spanish expressions and phrases"
  },
  'travel-vocabulary': {
    name: "Travel Vocabulary",
    description: "Essential words and phrases for travelers"
  }
};

export default function Group() {
  const { id } = useParams<{ id: string }>();
  const [groupStats, setGroupStats] = useState<GroupStats>(() => ({
    name: id ? DEFAULT_GROUPS[id]?.name || "Loading..." : "Loading...",
    description: id ? DEFAULT_GROUPS[id]?.description || "" : "",
    uniqueWords: 0,
    totalAttempts: 0,
    overallProgress: 0,
    lastPractice: "Never"
  }));
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showWords, setShowWords] = useState(true);

  const fetchGroupData = async () => {
    if (!id) return;
    
    try {
      const numericId = GROUP_ID_MAP[id];
      if (!numericId) {
        setError("Invalid group ID");
        return;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GROUPS}/${numericId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch group data');
      }
      
      const data = await response.json();
      
      // Calculate overall progress based on the words' statistics
      const wordsWithStats = (data.words || []).map((word: WordStats) => {
        const totalAttempts = (word.correct || 0) + (word.wrong || 0);
        const successRate = totalAttempts > 0 
          ? Math.round((word.correct / totalAttempts) * 100) 
          : 0;
        
        return {
          ...word,
          totalAttempts,
          successRate
        };
      });

      // Calculate overall progress as average success rate of attempted words
      const wordsWithAttempts = wordsWithStats.filter((word: WordStats) => word.totalAttempts > 0);
      const overallProgress = wordsWithAttempts.length > 0
        ? Math.round(
            wordsWithAttempts.reduce((sum: number, word: WordStats) => sum + (word.successRate || 0), 0) / 
            wordsWithAttempts.length
          )
        : 0;
      
      setGroupStats({
        name: DEFAULT_GROUPS[id].name,
        description: DEFAULT_GROUPS[id].description,
        uniqueWords: wordsWithStats.length,
        totalAttempts: wordsWithStats.reduce((sum: number, word: WordStats) => sum + word.totalAttempts, 0),
        overallProgress: overallProgress,
        lastPractice: data.group.last_practice || "Never"
      });

      setWords(wordsWithStats);
      setError(null);
    } catch (error) {
      console.error('Error fetching group data:', error);
      setError("Failed to load group data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [id]);

  const startPractice = async () => {
    if (!id) return;
    try {
      const numericId = GROUP_ID_MAP[id];
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/study-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_id: numericId })
      });

      if (!response.ok) {
        throw new Error('Failed to start practice session');
      }

      const data = await response.json();
      if (!data.id) {
        throw new Error('No session ID returned');
      }

      setSession({
        id: data.id,
        totalWords: words.length,
        correctWords: 0,
        currentWordIndex: 0,
        showAnswer: false
      });
    } catch (error) {
      console.error('Failed to start practice session:', error);
    }
  };

  const handleAnswer = async (correct: boolean) => {
    if (!session || !words[session.currentWordIndex]) return;
    
    try {
      const currentWord = words[session.currentWordIndex];
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/session-words`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.id,
          word_id: currentWord.id,
          correct
        })
      });

      if (!response.ok) {
        throw new Error('Failed to record answer');
      }

      const data = await response.json();
      if (data.success) {
        // Update the words array with new correct/wrong counts
        setWords(prevWords => {
          return prevWords.map(word => {
            if (word.id === currentWord.id) {
              const newCorrect = word.correct + (correct ? 1 : 0);
              const newWrong = word.wrong + (correct ? 0 : 1);
              const totalAttempts = newCorrect + newWrong;
              const successRate = Math.round((newCorrect / totalAttempts) * 100);
              
              return {
                ...word,
                correct: newCorrect,
                wrong: newWrong,
                totalAttempts,
                successRate
              };
            }
            return word;
          });
        });

        // Calculate new overall progress as average success rate
        setWords(prevWords => {
          const wordsWithAttempts = prevWords.filter(word => (word.totalAttempts || 0) > 0);
          const newOverallProgress = wordsWithAttempts.length > 0
            ? Math.round(
                wordsWithAttempts.reduce((sum, word) => sum + (word.successRate || 0), 0) / 
                wordsWithAttempts.length
              )
            : 0;

          // Update group stats with new progress
          setGroupStats(prev => ({
            ...prev,
            overallProgress: newOverallProgress,
            lastPractice: new Date().toLocaleDateString()
          }));

          return prevWords;
        });

        setSession(prev => {
          if (!prev) return null;
          const newCorrectWords = prev.correctWords + (correct ? 1 : 0);
          const newSession = {
            ...prev,
            correctWords: newCorrectWords,
            currentWordIndex: prev.currentWordIndex + 1,
            showAnswer: false
          };
          
          // If session is complete, end it but don't clear the session
          if (newSession.currentWordIndex >= prev.totalWords) {
            endSession();
            return {
              ...newSession,
              completed: true,
              score: Math.round((newCorrectWords / newSession.totalWords) * 100)
            };
          }
          
          return newSession;
        });
      } else {
        console.error('Failed to record answer:', data.error);
      }
    } catch (error) {
      console.error('Failed to record answer:', error);
    }
  };

  const endSession = async () => {
    if (!session?.id) return;
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/study-sessions/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'completed',
          end_time: new Date().toISOString(),
          correct_count: session.correctWords,
          total_words: session.totalWords
        })
      });

      if (!response.ok) {
        throw new Error('Failed to end session');
      }

      // Don't recalculate the score - it's already set in handleAnswer
      setSession(prev => prev ? {
        ...prev,
        completed: true
      } : null);

      // Don't immediately fetch group data - wait for user to click Continue
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  // Add a new function to handle continuing after session completion
  const handleContinue = async () => {
    setSession(null);
    await fetchGroupData(); // Fetch fresh data only after user clicks Continue
  };

  const playAudio = async (text: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      // Create a blob from the audio data
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Play the audio
      const audio = new Audio(audioUrl);
      await audio.play();
      
      // Clean up the URL after playing
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
          <p className="text-gray-600 dark:text-gray-400">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#AA151B] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading group data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="text-center p-12 rounded-lg shadow-md bg-gradient-to-br from-white via-white to-yellow-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border-l-4 border-[#AA151B] mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent">
          {groupStats.name}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {groupStats.description}
        </p>
      </div>

      {/* Group Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Group Statistics</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Overview of learning progress for this group</p>
        
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Words in Group</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{groupStats.uniqueWords}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Total Attempts</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{groupStats.totalAttempts}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Overall Progress</p>
            <p className="text-3xl font-bold text-green-500">{groupStats.overallProgress}%</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Last Practice</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{groupStats.lastPractice}</p>
          </div>
        </div>
      </div>

      {session?.completed ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Practice Complete!</h2>
            <div className="mb-6">
              <p className="text-4xl font-bold text-green-500 mb-2">{session.score}%</p>
              <p className="text-gray-600 dark:text-gray-300">
                You got {session.correctWords} out of {session.totalWords} words correct
              </p>
            </div>
            <Button onClick={handleContinue} className="bg-gradient-to-r from-[#AA151B] to-[#F1BF00]">
              Continue
            </Button>
          </div>
        </div>
      ) : session ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Practice Session</h2>
            <p className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">
              {session.showAnswer 
                ? words[session.currentWordIndex].english 
                : words[session.currentWordIndex].spanish}
            </p>
            {!session.showAnswer ? (
              <Button 
                onClick={() => setSession(prev => prev ? {...prev, showAnswer: true} : null)}
                className="mb-4"
              >
                Show Answer
              </Button>
            ) : (
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => handleAnswer(false)}
                  variant="destructive"
                >
                  <X className="mr-2 h-4 w-4" />
                  Incorrect
                </Button>
                <Button 
                  onClick={() => handleAnswer(true)}
                  variant="default"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Correct
                </Button>
              </div>
            )}
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Progress: {session.currentWordIndex + 1} / {session.totalWords}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mb-8">
          <div className="max-w-2xl text-center mb-6">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {id === 'core-verbs' && "Review the essential Spanish verbs below. When you're ready to test your knowledge, click 'Start Practice' to begin. You'll be shown each verb in Spanish and asked to recall its English meaning."}
              {id === 'common-phrases' && "Familiarize yourself with these everyday Spanish expressions. When you feel prepared, click 'Start Practice' to test your understanding. You'll see each phrase in Spanish and need to remember its English translation."}
              {id === 'travel-vocabulary' && "Study these important travel-related words and phrases. Once you're comfortable, click 'Start Practice' to challenge yourself. You'll be presented with each term in Spanish and need to recall its English equivalent."}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Tip: Use the button below to hide the words and test yourself before starting the official practice.
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <Button
              variant="outline"
              onClick={() => setShowWords(!showWords)}
              className="bg-white dark:bg-gray-700"
            >
              {showWords ? 'Hide Words' : 'Show Words'}
            </Button>
            <Button onClick={startPractice} className="bg-gradient-to-r from-[#AA151B] to-[#F1BF00]">
              <Play className="mr-2 h-4 w-4" />
              Start Practice
            </Button>
          </div>
        </div>
      )}

      {/* Words Table */}
      {!session && showWords && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Words in Group</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Practice and track your progress</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Spanish</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">English</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Success Rate</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Progress</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Audio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {words.map((word) => (
                  <tr key={word.spanish} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{word.spanish}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{word.english}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col">
                        <span className={`font-semibold ${word.successRate && word.successRate >= 70 ? 'text-green-500' : 'text-gray-500'}`}>
                          {word.successRate || 0}%
                        </span>
                        <span className="text-xs text-gray-400">
                          ({word.correct}/{word.totalAttempts || 0} attempts)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center">
                        <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ 
                              width: `${word.successRate || 0}%`,
                              backgroundColor: word.successRate && word.successRate >= 70 ? '#22c55e' : '#f59e0b'
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        onClick={() => playAudio(word.spanish)}
                      >
                        <Volume2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}