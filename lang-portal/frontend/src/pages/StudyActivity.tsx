import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Clock, Book } from 'lucide-react';
import { startSession } from '@/lib/api/sessions';

interface Word {
  id: number;
  spanish: string;
  english: string;
}

export default function StudyActivity() {
  const [session, setSession] = useState<number | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();
  const { groupId } = useParams();

  // This would come from your actual data
  const activity = {
    id: Number(groupId),
    title: "Adventure MUD",
    description: "An interactive text adventure game that helps you practice Spanish vocabulary in context. Navigate through various scenarios and complete challenges to improve your language skills.",
    thumbnail: "https://images.unsplash.com/photo-1546074177-31bfa593f731?w=500&q=80",
    sessions: [
      {
        id: 1,
        groupName: "Core Verbs",
        startTime: "2024-02-20 14:30",
        endTime: "2024-02-20 15:00",
        reviewItems: 25,
      },
      // Add more sessions as needed
    ],
  };

  const startNewSession = async () => {
    try {
      const response = await startSession(groupId!, 'flashcards');
      setSession(response.session_id);
      setWords(response.words);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const handleAnswer = async (correct: boolean) => {
    if (!session) return;

    const startTime = performance.now();
    
    try {
      await fetch(`http://localhost:5000/api/sessions/${session}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word_id: words[currentWordIndex].id,
          correct,
          response_time: performance.now() - startTime
        })
      });

      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setShowAnswer(false);
      } else {
        // Complete session
        await fetch(`http://localhost:5000/api/sessions/${session}/complete`, {
          method: 'POST'
        });
        navigate('/sessions');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center p-12 rounded-lg shadow-md bg-gradient-to-br from-white via-white to-yellow-50 border-l-4 border-[#AA151B]">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent">
            {activity.title}
          </h1>
          <p className="text-xl text-gray-600">{activity.description}</p>
        </div>

        {/* Activity Details */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-[#AA151B] p-6">
            <div className="aspect-video overflow-hidden rounded-lg mb-6">
              <img
                src={activity.thumbnail}
                alt={activity.title}
                className="h-full w-full object-cover"
              />
            </div>
            <Button 
              onClick={() => window.open(`http://localhost:8081?group_id=${activity.id}`, '_blank')}
              className="w-full bg-gradient-to-r from-[#AA151B] to-[#AA151B] hover:to-[#F1BF00] text-white rounded-lg transition-all duration-300 py-3"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Launch Activity
            </Button>
          </div>

          {/* Recent Sessions */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-[#F1BF00] p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Sessions</h2>
            <p className="text-gray-600 mb-6">Your practice history with this activity</p>
            
            <div className="space-y-4">
              {activity.sessions.map((session) => (
                <div 
                  key={session.id} 
                  className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-[#AA151B]">{session.groupName}</h3>
                    <span className="text-gray-600 text-sm">
                      {session.reviewItems} items
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{session.startTime} - {session.endTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!session ? (
          <div>
            <button 
              onClick={startNewSession}
              className="bg-[#AA151B] text-white px-4 py-2 rounded"
            >
              Begin Study
            </button>
          </div>
        ) : (
          <div className="max-w-xl mx-auto p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">
                Word {currentWordIndex + 1} of {words.length}
              </h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
              <h3 className="text-3xl mb-4 text-center">
                {words[currentWordIndex]?.spanish}
              </h3>
              
              {showAnswer ? (
                <>
                  <p className="text-xl text-center mb-8">
                    {words[currentWordIndex]?.english}
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => handleAnswer(false)}
                      className="bg-red-500 text-white px-6 py-2 rounded"
                    >
                      Incorrect
                    </button>
                    <button
                      onClick={() => handleAnswer(true)}
                      className="bg-green-500 text-white px-6 py-2 rounded"
                    >
                      Correct
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="w-full bg-[#AA151B] text-white px-6 py-2 rounded"
                >
                  Show Answer
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}