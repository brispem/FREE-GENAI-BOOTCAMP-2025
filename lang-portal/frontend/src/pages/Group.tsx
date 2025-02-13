import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Volume2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Group() {
  const { id } = useParams();
  const [groupStats, setGroupStats] = useState({
    name: "Core Verbs",
    description: "Essential Spanish verbs for everyday communication",
    totalWords: 0,
    averageAccuracy: 0,
    lastPractice: "Never"
  });
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/groups/${id}`);
        const data = await response.json();
        
        setGroupStats({
          name: data.group.name,
          description: data.group.description,
          totalWords: data.group.total_words,
          averageAccuracy: data.group.accuracy,
          lastPractice: data.group.last_practice || "Never"
        });
        setWords(data.words);
      } catch (error) {
        console.error('Error fetching group data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [id]);

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
              {words.map((word) => (
                <tr key={word.spanish} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{word.spanish}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{word.english}</td>
                  <td className="px-6 py-4 text-sm text-green-500">{word.correct}</td>
                  <td className="px-6 py-4 text-sm text-red-500">{word.wrong}</td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <Volume2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}