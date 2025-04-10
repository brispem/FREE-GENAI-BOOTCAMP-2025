import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Music2, Headphones, PenLine, Layers } from 'lucide-react';
import { Card } from '@/components/ui/card';

const activities = [
  {
    id: 'fluency-fc',
    title: 'Fluency FC',
    description: 'Master Spanish through an exciting football journey across Spain',
    icon: Gamepad2,
    level: 'All Levels',
    path: 'http://localhost:8008',
    isExternal: true,
    color: 'from-[#AA151B]'
  },
  {
    id: 'song-vocabulary',
    title: 'Song Vocabulary',
    description: 'Learn Spanish through popular songs with lyrics and translations',
    icon: Music2,
    level: 'All Levels',
    path: '/song-vocabulary',
    color: 'from-[#F1BF00]'
  },
  {
    id: 'listening-practice',
    title: 'Listening Practice',
    description: 'Improve your Spanish listening comprehension with native audio',
    icon: Headphones,
    level: 'Beginner',
    path: 'http://localhost:8501',
    isExternal: true,
    color: 'from-[#AA151B]'
  },
  {
    id: 'writing-practice',
    title: 'Writing Practice',
    description: 'Practice writing Spanish sentences and paragraphs',
    icon: PenLine,
    level: 'Intermediate',
    path: 'http://localhost:8081',
    isExternal: true,
    color: 'from-[#F1BF00]'
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Learn vocabulary with interactive flashcards',
    icon: Layers,
    level: 'Beginner',
    path: '/flashcards',
    color: 'from-[#AA151B]'
  }
];

export default function StudyActivities() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent mb-4">
            Study Activities
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Choose an activity to practice your Spanish
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            activity.isExternal ? (
              <a key={activity.id} href={activity.path} target="_blank" rel="noopener noreferrer">
                <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 border-t-4 border-[#AA151B] dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <activity.icon className={`h-10 w-10 bg-gradient-to-r ${activity.color} to-[#F1BF00] text-white rounded-lg p-2`} />
                    <span className={`text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r ${activity.color} to-[#F1BF00] text-white`}>
                      {activity.level}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {activity.description}
                  </p>
                </Card>
              </a>
            ) : (
              <Link key={activity.id} to={activity.path}>
                <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 border-t-4 border-[#AA151B] dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <activity.icon className={`h-10 w-10 bg-gradient-to-r ${activity.color} to-[#F1BF00] text-white rounded-lg p-2`} />
                    <span className={`text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r ${activity.color} to-[#F1BF00] text-white`}>
                      {activity.level}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {activity.description}
                  </p>
                </Card>
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
}