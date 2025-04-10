import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, ArrowUpDown } from 'lucide-react';
import { API_CONFIG } from '@/config/api';

interface Session {
  id: number;
  group_name: string;
  activity_name: string;
  review_items_count: number;
  start_time: string;
}

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/study-sessions`);
        if (!response.ok) throw new Error('Failed to fetch sessions');
        const data = await response.json();
        setSessions(data.items);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center p-12 rounded-lg shadow-md bg-gradient-to-br from-white via-white to-yellow-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border-l-4 border-[#AA151B]">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent">
            Study Sessions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Track your learning progress and history
          </p>
        </div>

        {/* Sessions List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-[#AA151B]">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-[#AA151B] dark:hover:text-[#F1BF00] transition-colors"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort by Date {sortOrder === 'asc' ? '(Oldest)' : '(Newest)'}
            </button>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {sessions.map((session) => (
              <div 
                key={session.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {session.group_name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {session.activity_name}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(session.start_time).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {new Date(session.start_time).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {session.review_items_count} words reviewed
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}