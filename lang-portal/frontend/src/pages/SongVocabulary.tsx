import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MusicIcon, SearchIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import React from "react";

interface VocabularyItem {
  spanish: string;
  pronunciation: string;
  english: string;
  type: string;
  conjugation_group: string | null;
  is_irregular: boolean;
  gender: string | null;
  notes: string;
}

export default function SongVocabulary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [songInfo, setSongInfo] = useState<{ title: string; artist: string } | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a song name or artist');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLyrics(null);
    setVocabulary([]);
    setSongInfo(null);

    try {
      const response = await fetch('http://localhost:5174/api/song-vocabulary/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message_request: `Find Spanish lyrics and vocabulary for the song "${searchQuery}"`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch song data');
      }

      const data = await response.json();
      
      if (data.song_id) {
        const [lyricsResponse, vocabularyResponse] = await Promise.all([
          fetch(`http://localhost:5174/api/song-vocabulary/lyrics/${data.song_id}`),
          fetch(`http://localhost:5174/api/song-vocabulary/vocabulary/${data.song_id}`)
        ]);

        if (!lyricsResponse.ok || !vocabularyResponse.ok) {
          throw new Error('Failed to fetch lyrics or vocabulary. Please try again.');
        }

        const [lyricsText, vocabularyData] = await Promise.all([
          lyricsResponse.text(),
          vocabularyResponse.json()
        ]);

        const parts = data.song_id.split('-');
        const artist = parts.slice(0, -1).join(' ');
        const title = parts[parts.length - 1];

        setLyrics(lyricsText);
        setVocabulary(vocabularyData);
        setSongInfo({
          title: title.charAt(0).toUpperCase() + title.slice(1),
          artist: artist.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        });
      } else {
        throw new Error('Could not find the song. Please try with a different search term.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent mb-4">
            Song Vocabulary
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Learn Spanish through popular songs with lyrics and translations
          </p>
        </div>

        <Card className="p-6 border-t-4 border-[#AA151B]">
          <div className="flex gap-2">
            <Input
              placeholder="Enter song name or artist (e.g., Despacito by Luis Fonsi)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isLoading}
              className="bg-gradient-to-r from-[#AA151B] to-[#F1BF00] text-white hover:from-[#8A1216] hover:to-[#D1A000]"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SearchIcon className="mr-2 h-4 w-4" />}
              Search
            </Button>
          </div>

          {error && (
            <p className="mt-4 text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>
          )}
        </Card>

        {isLoading && (
          <Card className="p-6 flex items-center justify-center border-t-4 border-[#F1BF00]">
            <Loader2 className="h-8 w-8 animate-spin text-[#AA151B]" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Searching for song lyrics and vocabulary...</span>
          </Card>
        )}

        {songInfo && (
          <Card className="p-6 border-t-4 border-[#AA151B]">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent">Song Info</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Title: {songInfo.title}</p>
            <p className="text-gray-600 dark:text-gray-300">Artist: {songInfo.artist}</p>
          </Card>
        )}

        {lyrics && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 border-t-4 border-[#AA151B]">
              <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent">Spanish Lyrics</h3>
              <div className="whitespace-pre-wrap font-medium max-h-[600px] overflow-y-auto pr-4">
                {lyrics.split('\n\n').map((verse, index) => {
                  if (!verse.trim()) return null;
                  const isHeaderVerse = verse.trim().startsWith('[');

                  return (
                    <div 
                      key={index} 
                      className={`
                        ${isHeaderVerse ? 'mb-4' : 'mb-10 last:mb-4'}
                        dark:bg-gray-800 rounded-lg
                      `}
                    >
                      {verse.split('\n').map((line, lineIndex) => {
                        if (!line.trim()) return null;

                        if (line.startsWith('[')) {
                          return (
                            <h4 
                              key={lineIndex} 
                              className="text-lg font-bold text-[#AA151B] dark:text-[#F1BF00] mb-6 mt-8 first:mt-0 
                                       tracking-wide border-b border-[#AA151B]/20 dark:border-[#F1BF00]/20 pb-2"
                            >
                              {line}
                            </h4>
                          );
                        }

                        return (
                          <p 
                            key={lineIndex} 
                            className="text-lg mb-4 leading-loose tracking-wide pl-4
                                     hover:bg-[#AA151B]/5 dark:hover:bg-[#F1BF00]/5 transition-colors duration-200 
                                     rounded py-1.5 text-gray-700 dark:text-gray-200"
                          >
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </Card>
            
            <Card className="p-6 border-t-4 border-[#F1BF00]">
              <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent">Vocabulary</h3>
              <div className="max-h-[600px] overflow-y-auto pr-4">
                <div className="grid grid-cols-[1fr,auto] gap-x-4 gap-y-2 items-center">
                  {vocabulary.map((item, index) => (
                    <React.Fragment key={index}>
                      <div className="flex items-center space-x-2 py-2">
                        <span className="font-semibold text-lg text-gray-800 dark:text-white">{item.spanish}</span>
                        {item.pronunciation && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">[{item.pronunciation}]</span>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <span className="text-sm bg-gradient-to-r from-[#AA151B] to-[#F1BF00] text-white px-3 py-1 rounded-full">
                          {item.type}
                        </span>
                      </div>
                      
                      <div className="col-span-2 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-base text-gray-600 dark:text-gray-300">{item.english}</p>
                        {item.notes && !item.notes.includes("Automatically extracted") && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">{item.notes}</p>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 