import { Volume2 } from 'lucide-react';
import { useState } from 'react';

export default function TravelVocabulary() {
  const [groupStats, setGroupStats] = useState({
    name: "Travel Vocabulary",
    description: "Spanish vocabulary for travelers and tourists",
    totalWords: 0,
    averageAccuracy: 0,
    lastPractice: "Never"
  });

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
        
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Total Words</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{groupStats.totalWords}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Average Accuracy</p>
            <p className="text-3xl font-bold text-green-500">{groupStats.averageAccuracy}%</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Last Practice</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{groupStats.lastPractice}</p>
          </div>
        </div>
      </div>

      {/* Words Table */}
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
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Correct</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Wrong</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Audio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {/* Words will be populated here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 