import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Volume2, ChevronLeft, ChevronRight, ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

type SortDirection = 'asc' | 'desc';
type SortField = 'spanish' | 'english' | 'correct' | 'wrong';

export default function Words() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('spanish');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const words = [
    { spanish: "empezar", english: "to begin", correct: 0, wrong: 0 },
    { spanish: "hablar", english: "to speak", correct: 0, wrong: 0 },
    { spanish: "comer", english: "to eat", correct: 0, wrong: 0 }
  ];

  const totalPages = 3; // This would be calculated based on your actual data

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ArrowDown className="ml-1 h-4 w-4" />
    ) : (
      <ArrowUp className="ml-1 h-4 w-4" />
    );
  };

  const importWords = async (wordData: WordImport[]) => {
    try {
      const response = await fetch('http://localhost:5000/api/import/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ words: wordData })
      });
      if (!response.ok) throw new Error('Import failed');
      
      // Refresh the words list
      fetchWords();
    } catch (error) {
      console.error('Import error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="text-center p-12 rounded-lg shadow-md bg-gradient-to-br from-white via-white to-yellow-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border-l-4 border-[#AA151B]">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent">
          Spanish Words
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Master your Spanish vocabulary
        </p>
      </div>

      {/* Vocabulary List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mt-8">
        <div className="p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Vocabulary List</h2>
            <p className="text-gray-600 dark:text-gray-300">Track your progress with each word</p>
          </div>
          <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
            Sort by spanish (A-Z)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 w-1/4">Spanish</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 w-1/4">English</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-300 w-1/4">Correct</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-300 w-1/4">Wrong</th>
                <th className="px-6 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {words.map((word) => (
                <tr key={word.spanish} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm text-[#AA151B]">{word.spanish}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{word.english}</td>
                  <td className="px-6 py-4 text-sm text-green-500 text-center">{word.correct}</td>
                  <td className="px-6 py-4 text-sm text-red-500 text-center">{word.wrong}</td>
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

        {/* Pagination */}
        <div className="flex justify-center p-4">
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg bg-blue-600 text-white opacity-50" disabled>
              Previous
            </button>
            <span className="text-gray-600 dark:text-gray-300">Page 1 of 3</span>
            <button className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}