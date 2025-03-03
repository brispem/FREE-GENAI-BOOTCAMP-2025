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
      const response = await fetch('http://localhost:8000/api/agent', {
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
          fetch(`http://localhost:8000/api/lyrics/${data.song_id}`),
          fetch(`http://localhost:8000/api/vocabulary/${data.song_id}`)
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
          artist: artist.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Song Vocabulary</h1>
        <MusicIcon className="h-6 w-6" />
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Enter song name or artist (e.g., Despacito by Luis Fonsi)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SearchIcon className="mr-2 h-4 w-4" />}
          Search
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Searching for song lyrics and vocabulary...</span>
        </div>
      )}

      {songInfo && (
        <Card className="p-4">
          <h2 className="text-2xl font-bold">{songInfo.title}</h2>
          <p className="text-muted-foreground">by {songInfo.artist}</p>
        </Card>
      )}

      {lyrics && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Spanish Lyrics</h3>
            <div className="whitespace-pre-wrap font-medium max-h-[600px] overflow-y-auto pr-4">
              {lyrics.split('\n\n').map((verse, index) => {
                // Skip empty verses
                if (!verse.trim()) return null;

                // Check if this is a section header verse
                const isHeaderVerse = verse.trim().startsWith('[');

                return (
                  <div 
                    key={index} 
                    className={`
                      ${isHeaderVerse ? 'mb-4' : 'mb-10 last:mb-4'}
                      bg-white rounded-lg
                    `}
                  >
                    {verse.split('\n').map((line, lineIndex) => {
                      // Skip empty lines
                      if (!line.trim()) return null;

                      // Handle section headers
                      if (line.startsWith('[')) {
                        return (
                          <h4 
                            key={lineIndex} 
                            className="text-lg font-bold text-orange-600 mb-6 mt-8 first:mt-0 
                                     tracking-wide border-b border-orange-200 pb-2"
                          >
                            {line}
                          </h4>
                        );
                      }

                      // Handle regular lyrics lines
                      return (
                        <p 
                          key={lineIndex} 
                          className="text-lg mb-4 leading-loose tracking-wide pl-4
                                   hover:bg-orange-50 transition-colors duration-200 
                                   rounded py-1.5"
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
          
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Vocabulary</h3>
            <div className="max-h-[600px] overflow-y-auto pr-4">
              <div className="grid grid-cols-[1fr,auto] gap-x-4 gap-y-2 items-center">
                {vocabulary.map((item, index) => (
                  <React.Fragment key={index}>
                    {/* Spanish word and type */}
                    <div className="flex items-center space-x-2 py-2">
                      <span className="font-semibold text-lg">{item.spanish}</span>
                      {item.pronunciation && (
                        <span className="text-sm text-muted-foreground">[{item.pronunciation}]</span>
                      )}
                    </div>
                    
                    {/* Word type badge */}
                    <div className="text-right">
                      <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        {item.type}
                      </span>
                    </div>
                    
                    {/* English translation - spans full width */}
                    <div className="col-span-2 pb-3 border-b">
                      <p className="text-base text-muted-foreground">{item.english}</p>
                      {item.notes && !item.notes.includes("Automatically extracted") && (
                        <p className="text-sm text-muted-foreground mt-1 italic">{item.notes}</p>
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
  );
} 