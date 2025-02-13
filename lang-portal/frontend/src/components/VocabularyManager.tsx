import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Plus, Trash, Search } from 'lucide-react';

interface Word {
  id: number;
  spanish: string;
  english: string;
  type: string;
}

export function VocabularyManager() {
  const [words, setWords] = useState<Word[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newWord, setNewWord] = useState({ spanish: '', english: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      const data = await api.words.getAll();
      setWords(data);
    } catch (err) {
      setError('Failed to load words');
    } finally {
      setLoading(false);
    }
  };

  const addWord = async () => {
    try {
      await api.words.add(newWord);
      setNewWord({ spanish: '', english: '', type: '' });
      loadWords();
    } catch (err) {
      setError('Failed to add word');
    }
  };

  const deleteWord = async (id: number) => {
    try {
      await api.words.delete(id);
      loadWords();
    } catch (err) {
      setError('Failed to delete word');
    }
  };

  const filteredWords = words.filter(word => 
    word.spanish.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.english.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Vocabulary Manager 📚</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Search words..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add new word form */}
            <div className="flex gap-2">
              <Input
                placeholder="Spanish word"
                value={newWord.spanish}
                onChange={(e) => setNewWord({ ...newWord, spanish: e.target.value })}
              />
              <Input
                placeholder="English translation"
                value={newWord.english}
                onChange={(e) => setNewWord({ ...newWord, english: e.target.value })}
              />
              <Input
                placeholder="Type (noun, verb, etc.)"
                value={newWord.type}
                onChange={(e) => setNewWord({ ...newWord, type: e.target.value })}
              />
              <Button onClick={addWord}>
                <Plus className="w-4 h-4 mr-2" />
                Add Word
              </Button>
            </div>

            {/* Word list */}
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="grid gap-2">
                {filteredWords.map(word => (
                  <div key={word.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <span className="font-bold">{word.spanish}</span>
                      <span className="mx-2">-</span>
                      <span>{word.english}</span>
                      <span className="ml-2 text-sm text-gray-500">({word.type})</span>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => deleteWord(word.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 