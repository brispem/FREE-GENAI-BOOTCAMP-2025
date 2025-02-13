import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye } from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Adventure MUD",
    description: "Interactive text adventure to practice Spanish vocabulary",
    thumbnail: "https://images.unsplash.com/photo-1546074177-31bfa593f731?w=500&q=80",
  },
  {
    id: 2,
    title: "Typing Tutor",
    description: "Practice typing Spanish words and phrases",
    thumbnail: "https://images.unsplash.com/photo-1555532538-dcdbd01d373d?w=500&q=80",
  },
  // Add more activities as needed
];

export default function StudyActivities() {
  const handleLaunch = (id: number) => {
    window.open(`http://localhost:8081?group_id=${id}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center p-12 rounded-lg shadow-md bg-gradient-to-br from-white via-white to-yellow-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border-l-4 border-[#AA151B]">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent">
            Study Activities
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose an activity to practice your Spanish
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-[#AA151B] overflow-hidden"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={activity.thumbnail}
                  alt={activity.title}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {activity.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {activity.description}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleLaunch(activity.id)}
                    className="px-4 py-2 bg-gradient-to-r from-[#AA151B] to-[#AA151B] hover:to-[#F1BF00] text-white rounded-lg transition-all duration-300"
                  >
                    <ExternalLink className="mr-2 h-4 w-4 inline" />
                    Launch
                  </button>
                  <button
                    onClick={() => window.location.href = `/study-activities/${activity.id}`}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-[#AA151B] dark:hover:text-[#F1BF00] transition-colors"
                  >
                    <Eye className="mr-2 h-4 w-4 inline" />
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start Guide */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-[#F1BF00] p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Getting Started
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Choose an activity above to begin practicing. Each activity is designed to help you master different aspects of Spanish language learning.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Interactive Learning", desc: "Engage with dynamic exercises" },
              { title: "Progress Tracking", desc: "Monitor your improvement" },
              { title: "Instant Feedback", desc: "Learn from your mistakes" }
            ].map((item) => (
              <div key={item.title} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}