import React, { useEffect, useState } from 'react';

interface DashboardStats {
  studySessions: number;
  wordsLearned: number;
  activeGroups: number;
  successRate: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    studySessions: 0,
    wordsLearned: 0,
    activeGroups: 0,
    successRate: 0
  });

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5174/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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
          <div className="text-center p-12 rounded-lg shadow-md">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-1">¡Bienvenidos! 👋</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Whether you're starting from scratch or refining your skills, we're here to
              make learning Spanish engaging, effective, and fun.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card">
            <span>{stats.studySessions}</span>
            <p>Study Sessions</p>
          </div>
          <div className="stat-card">
            <span>{stats.wordsLearned}</span>
            <p>Words Learned</p>
          </div>
          <div className="stat-card">
            <span>{stats.activeGroups}</span>
            <p>Active Groups</p>
          </div>
          <div className="stat-card">
            <span>{stats.successRate}%</span>
            <p>Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
} 