import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Shuffle, RotateCcw, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

declare module 'canvas-confetti';

interface Flashcard {
  id: number;
  spanish: string;
  english: string;
  type: 'text' | 'image';
  imageUrl?: string;
  options?: string[];
}

interface CachedImages {
  [key: string]: string;
}

const LOCAL_STORAGE_KEY = 'flashcards_cached_images';

const triggerConfetti = async () => {
  const confetti = (await import('canvas-confetti')).default;
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};

export default function Flashcards() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [loading, setLoading] = useState(false);
  const [cachedImages, setCachedImages] = useState<CachedImages>({});
  const [totalCards, setTotalCards] = useState(0);
  const [originalOrder, setOriginalOrder] = useState<Flashcard[]>([]);

  const textCards: Flashcard[] = [
    { id: 1, spanish: 'el banco', english: 'the bank', type: 'text' },
    { id: 2, spanish: 'la oficina de correos', english: 'the post office', type: 'text' },
    { id: 3, spanish: 'el estadio', english: 'the stadium', type: 'text' },
    { id: 4, spanish: 'la escuela', english: 'the school', type: 'text' },
    { id: 5, spanish: 'el supermercado', english: 'the supermarket', type: 'text' },
    { id: 6, spanish: 'el café', english: 'the cafe', type: 'text' },
  ];

  const imageCards: Flashcard[] = [
    { 
      id: 7, 
      spanish: 'el banco', 
      english: 'the bank', 
      type: 'image',
      options: ['the bank', 'the post office', 'the cafe', 'the school']
    },
    {
      id: 8,
      spanish: 'la oficina de correos',
      english: 'the post office',
      type: 'image',
      options: ['the post office', 'the bank', 'the supermarket', 'the stadium']
    },
    {
      id: 9,
      spanish: 'el estadio',
      english: 'the stadium',
      type: 'image',
      options: ['the stadium', 'the school', 'the bank', 'the cafe']
    },
    {
      id: 10,
      spanish: 'la escuela',
      english: 'the school',
      type: 'image',
      options: ['the school', 'the post office', 'the cafe', 'the supermarket']
    },
    {
      id: 11,
      spanish: 'el supermercado',
      english: 'the supermarket',
      type: 'image',
      options: ['the supermarket', 'the stadium', 'the bank', 'the school']
    },
    {
      id: 12,
      spanish: 'el café',
      english: 'the cafe',
      type: 'image',
      options: ['the cafe', 'the bank', 'the post office', 'the stadium']
    }
  ];

  useEffect(() => {
    loadCards();
  }, [mode]);

  useEffect(() => {
    const savedImages = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedImages) {
      setCachedImages(JSON.parse(savedImages));
    }
  }, []);

  const loadCards = async () => {
    if (mode === 'text') {
      const shuffledCards = shuffleArray([...textCards]);
      setCards(shuffledCards);
      setOriginalOrder([...textCards]);
      setTotalCards(textCards.length);
    } else {
      setLoading(true);
      try {
        const shuffledCards = shuffleArray([...imageCards]);
        
        // Clear any existing images to ensure we only use OpenAI-generated ones
        shuffledCards.forEach(card => {
          // Only keep images from cache, not fallbacks
          if (cachedImages[card.english]) {
            card.imageUrl = cachedImages[card.english];
          } else {
            card.imageUrl = undefined; // Clear any existing image
          }
        });
        
        setCards(shuffledCards);
        setOriginalOrder([...imageCards]);
        setTotalCards(imageCards.length);
        
        // Load the image for the current card from OpenAI
        const currentCard = shuffledCards[currentCardIndex];
        if (!currentCard.imageUrl) {
          try {
            setLoading(true);
            const response = await fetch('http://localhost:5174/api/generate-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ location: currentCard.english })
            });
            
            if (!response.ok) {
              throw new Error('Failed to generate image');
            }
            
            const data = await response.json();
            if (data.success) {
              currentCard.imageUrl = data.imageUrl;
              const newCachedImages = {
                ...cachedImages,
                [currentCard.english]: data.imageUrl
              };
              setCachedImages(newCachedImages);
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCachedImages));
            }
          } catch (error) {
            console.error('Image generation failed:', error);
            toast.error('Failed to generate image from OpenAI');
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        toast.error('Failed to load image cards');
        setMode('text');
        setLoading(false);
      }
    }
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleShuffle = useCallback(() => {
    setCards(shuffleArray([...cards]));
    setCurrentCardIndex(0);
    setScore(0);
    setUserAnswer('');
    setIsFlipped(false);
  }, [cards]);

  const handleReset = useCallback(() => {
    setCards([...originalOrder]);
    setCurrentCardIndex(0);
    setScore(0);
    setUserAnswer('');
    setIsFlipped(false);
  }, [originalOrder]);

  const checkAnswer = (answer?: string) => {
    const currentCard = cards[currentCardIndex];
    const isCorrect = mode === 'text' 
      ? userAnswer.toLowerCase().trim() === currentCard.english.toLowerCase()
      : answer === currentCard.english;
    
    if (isCorrect) {
      setScore(score + 1);
      toast.success(`Correct! 🎉 ${currentCard.spanish} = ${currentCard.english}`);
      triggerConfetti();
    } else {
      toast.error(`Not quite right. The correct answer was: ${currentCard.english}`);
    }

    setIsFlipped(true);
    setTimeout(() => {
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setUserAnswer('');
        setIsFlipped(false);
        
        // Load the image for the next card if in image mode
        if (mode === 'image') {
          const nextCard = cards[currentCardIndex + 1];
          if (!nextCard.imageUrl) {
            loadImageForCard(nextCard);
          }
        }
      } else {
        toast.success(`Practice Complete! Score: ${score + (isCorrect ? 1 : 0)} out of ${cards.length}`);
      }
    }, 2000);
  };

  // Add a helper function to load images for specific cards
  const loadImageForCard = async (card: Flashcard) => {
    if (card.imageUrl) return; // Skip if already has an image
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5174/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: card.english })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }
      
      const data = await response.json();
      if (data.success) {
        // Update the card with the new image
        card.imageUrl = data.imageUrl;
        
        // Update the cached images
        const newCachedImages = {
          ...cachedImages,
          [card.english]: data.imageUrl
        };
        setCachedImages(newCachedImages);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCachedImages));
        
        // Force a re-render
        setCards([...cards]);
      }
    } catch (error) {
      console.error('Image generation failed:', error);
      toast.error('Failed to generate image from OpenAI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center p-12 rounded-lg shadow-md bg-gradient-to-br from-white via-white to-yellow-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border-l-4 border-[#AA151B] mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
          Flashcards
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Practice your Spanish vocabulary with interactive flashcards
        </p>
      </div>

      <div className="flex justify-between items-center max-w-md mx-auto mb-4">
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <Button
            variant={mode === 'text' ? 'default' : 'outline'}
            className="rounded-none"
            onClick={() => setMode('text')}
          >
            Text Mode
          </Button>
          <Button
            variant={mode === 'image' ? 'default' : 'outline'}
            className="rounded-none"
            onClick={() => setMode('image')}
          >
            Image Mode
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleShuffle}
            variant="outline"
            className="ml-2"
            title="Shuffle cards"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="ml-2"
            title="Reset to original order"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress and Score Display */}
      <div className="text-center mb-8">
        <p className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
          Card {currentCardIndex + 1} of {totalCards}
        </p>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          Score: {score} / {currentCardIndex}
        </p>
      </div>

      {/* Flashcard */}
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#AA151B]" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            Generating image...
          </p>
        </div>
      ) : cards.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentCardIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-md mx-auto"
          >
            <motion.div 
              className={`p-6 text-center rounded-lg border shadow-sm ${isFlipped ? 'scale-[0.97]' : ''}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {mode === 'text' ? (
                <>
                  <div className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                    {cards[currentCardIndex].spanish}
                  </div>
                  <Input
                    type="text"
                    placeholder="Type the English translation..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    className="mb-4"
                  />
                  <Button 
                    onClick={() => checkAnswer()}
                    className="w-full bg-gradient-to-r from-[#AA151B] to-[#F1BF00] text-white"
                  >
                    Check Answer
                  </Button>
                </>
              ) : (
                <>
                  {cards[currentCardIndex].imageUrl ? (
                    <img 
                      src={cards[currentCardIndex].imageUrl} 
                      alt="Location"
                      className="w-full h-48 object-cover rounded-lg mb-6"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">Image not available</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {cards[currentCardIndex].options?.map((option, index) => (
                      <motion.div
                        key={option}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          onClick={() => checkAnswer(option)}
                          className="w-full bg-gradient-to-r from-[#AA151B] to-[#F1BF00] text-white"
                        >
                          {option}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
} 