import { Link } from "react-router-dom";
import { BookOpen, Users, ChartBar, History, Globe, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardStats, DashboardStatsSchema } from '@/lib/validations/dashboard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const Dashboard = () => {
  const [stats, setStats] = useState({
    study_sessions: 0,
    words_learned: 0,
    active_groups: 0,
    success_rate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardStats = async (retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Add proper headers and error handling
        const response = await fetch('/api/dashboard/stats', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response not OK:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError("Response was not JSON");
        }

        const data = await response.json();
        return data;

      } catch (error) {
        console.error(`Attempt ${attempt}/${retries}: ${error}`);
        if (attempt === retries) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/dashboard/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Error fetching dashboard data');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
        {/* Hero Section */}
        <div className="flex justify-between items-center">
          <div className="text-center p-12 rounded-lg shadow-md bg-gradient-to-br from-white via-white to-yellow-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border-l-4 border-[#AA151B] flex-1">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent">
              ¡Bienvenidos! 👋
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Whether you're starting from scratch or refining your skills, we're here to make learning Spanish engaging, effective, and fun.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="mt-2">
              {error}
              {retryCount < MAX_RETRIES && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchStats()}
                  className="ml-4"
                >
                  Retry Now
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: "Study Sessions", value: stats.study_sessions, icon: History, color: "from-[#AA151B]" },
            { label: "Words Learned", value: stats.words_learned, icon: BookOpen, color: "from-[#F1BF00]" },
            { label: "Active Groups", value: stats.active_groups, icon: Users, color: "from-[#AA151B]" },
            { label: "Success Rate", value: `${stats.success_rate}%`, icon: ChartBar, color: "from-[#F1BF00]" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all duration-300">
              {loading ? (
                <Loader2 className="h-8 w-8 mx-auto animate-spin text-[#AA151B]" />
              ) : (
                <>
                  <Icon className="h-8 w-8 mx-auto mb-4 text-[#AA151B]" />
                  <div className={`text-2xl font-bold bg-gradient-to-r ${color} to-transparent bg-clip-text text-transparent`}>
                    {value}
                  </div>
                </>
              )}
              <p className="text-gray-600 dark:text-gray-300">{label}</p>
            </div>
          ))}
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Study Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-[#AA151B] p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Study Activities 📚</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Interactive exercises and lessons to improve your Spanish skills.
            </p>
            <Link 
              to="/study-activities"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-[#AA151B] to-[#AA151B] hover:to-[#F1BF00] text-white rounded-lg transition-all duration-300"
            >
              Start Learning
            </Link>
          </div>

          {/* Word Groups */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-[#F1BF00] p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Word Groups 🎯</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Organized collections of vocabulary to help you learn effectively.
            </p>
            <Link 
              to="/groups"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-[#AA151B] to-[#AA151B] hover:to-[#F1BF00] text-white rounded-lg transition-all duration-300"
            >
              View Groups
            </Link>
          </div>

          {/* Progress Tracker */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-[#AA151B] p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Progress Tracker 📈</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Monitor your learning journey and track your improvements.
            </p>
            <Link 
              to="/sessions"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-[#AA151B] to-[#AA151B] hover:to-[#F1BF00] text-white rounded-lg transition-all duration-300"
            >
              Check Progress
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-[#F1BF00] p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Quick Links</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link 
              to="/history"
              className="group p-4 bg-gradient-to-br from-[#AA151B]/5 to-[#F1BF00]/5 dark:from-gray-700 dark:to-gray-700 rounded-lg hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-2">
                <Globe className="h-5 w-5 text-[#AA151B] mr-2" />
                <h3 className="font-semibold text-gray-800 dark:text-white">Spanish History</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">Learn about the rich history of the Spanish language</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;