import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, ArrowRight, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Groups() {
  // Initial groups with zero values
  const groups = [
    {
      id: "core-verbs",
      name: "Core Verbs",
      totalWords: 0,
      completed: 0,
      icon: "🎯"
    },
    {
      id: "common-phrases",
      name: "Common Phrases",
      totalWords: 0,
      completed: 0,
      icon: "💬"
    },
    {
      id: "travel-vocabulary",
      name: "Travel Vocabulary",
      totalWords: 0,
      completed: 0,
      icon: "✈️"
    }
  ];

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
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Words:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{group.totalWords}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                    <span className="font-medium text-green-500">{group.completed}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-gradient-to-r from-[#AA151B] to-[#F1BF00] h-2.5 rounded-full" 
                      style={{ width: `${(group.completed / group.totalWords) * 100}%` }}
                    ></div>
                  </div>
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