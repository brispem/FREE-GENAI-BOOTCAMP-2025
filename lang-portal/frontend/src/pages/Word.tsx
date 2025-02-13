import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

export default function Word() {
  const { id } = useParams();

  // This would come from your actual data
  const word = {
    id: Number(id),
    spanish: 'empezar',
    english: 'to begin',
    partOfSpeech: 'verb',
    conjugation: {
      present: ['empiezo', 'empiezas', 'empieza', 'empezamos', 'empezáis', 'empiezan'],
    },
    examples: [
      'Vamos a empezar la clase.',
      'El concierto empieza a las ocho.',
    ],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center p-12 rounded-lg shadow-md bg-gradient-to-br from-white via-white to-yellow-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border-l-4 border-[#AA151B]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent">
                {word.spanish}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">{word.english}</p>
            </div>
            <Button 
              size="icon" 
              variant="outline"
              className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-[#AA151B] dark:hover:text-[#F1BF00]"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-[#AA151B] p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Details</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Word information and usage</p>
            <dl className="space-y-4">
              <div>
                <dt className="font-medium text-gray-800 dark:text-white">Part of Speech</dt>
                <dd className="text-gray-600 dark:text-gray-300">{word.partOfSpeech}</dd>
              </div>
              {word.conjugation && (
                <div>
                  <dt className="font-medium text-gray-800 dark:text-white">Present Tense Conjugation</dt>
                  <dd className="mt-2 grid grid-cols-2 gap-2">
                    {word.conjugation.present.map((form, index) => (
                      <div key={index} className="text-gray-600 dark:text-gray-300">
                        {form}
                      </div>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Examples Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-[#F1BF00] p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Example Sentences</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">See the word used in context</p>
            <ul className="space-y-4">
              {word.examples.map((example, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-gray-600 dark:text-gray-300">•</span>
                  <span className="text-gray-600 dark:text-gray-300">{example}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}