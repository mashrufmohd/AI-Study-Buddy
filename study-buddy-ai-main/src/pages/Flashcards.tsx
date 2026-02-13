import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Layers, ChevronLeft, ChevronRight, RotateCcw, Shuffle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateFlashcards } from '@/lib/api';

interface Flashcard {
  front: string;
  back: string;
}

const Flashcards = () => {
  const [topic, setTopic] = useState('');
  const [numCards, setNumCards] = useState(8);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentCard = cards[currentIndex];

  const handleGenerateFlashcards = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await generateFlashcards(topic, numCards);
      if (result && result.length > 0) {
        setCards(result);
        setCurrentIndex(0);
        setIsFlipped(false);
      } else {
        setError('No flashcards were generated. Please try again.');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate flashcards. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const handleReset = () => {
    setIsFlipped(false);
    setCurrentIndex(0);
  };

  return (
    <div className="page-enter max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-flashcard-light">
          <Layers className="h-8 w-8 text-flashcard" />
        </div>
        <h1 className="text-3xl font-bold">Flashcards</h1>
          <p className="text-muted-foreground text-lg">
            Generate flashcards from any topic with AI assistance.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
            <p className="text-sm font-medium">Error: {error}</p>
          </div>
        )}

        {/* Generate Flashcards Form */}
        <form onSubmit={handleGenerateFlashcards} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Topic</label>
            <Input
              placeholder="Enter a topic (e.g., Biology, Quantum Physics, History)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Number of Cards</label>
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                min="3"
                max="20"
                value={numCards}
                onChange={(e) => setNumCards(Math.max(3, Math.min(20, parseInt(e.target.value) || 8)))}
                disabled={isLoading}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground pt-2">(3-20 cards)</span>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-flashcard hover:bg-flashcard/90 text-primary-foreground gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Flashcards'
            )}
          </Button>
        </form>

        {/* Flashcards Display */}
        {cards.length > 0 && (
          <>
            {/* Progress */}
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm text-muted-foreground">
                Card {currentIndex + 1} of {cards.length}
              </span>
              <div className="flex-1 max-w-xs h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-flashcard transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Flashcard */}
            <div
              className={cn('flip-card cursor-pointer mx-auto', isFlipped && 'flipped')}
              style={{ height: '320px', maxWidth: '500px', width: '100%' }}
              onClick={handleFlip}
            >
              <div className="flip-card-inner w-full h-full">
                {/* Front */}
                <Card className="flip-card-front absolute w-full h-full feature-flashcard">
                  <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="mb-4">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                        Question
                      </span>
                    </div>
                    <p className="text-xl font-medium">{currentCard.front}</p>
                    <p className="mt-6 text-sm text-muted-foreground">
                      Click to reveal answer
                    </p>
                  </CardContent>
                </Card>

                {/* Back */}
                <Card className="flip-card-back absolute w-full h-full bg-flashcard-light border-flashcard">
                  <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="mb-4">
                      <span className="text-xs uppercase tracking-wider text-flashcard font-medium">
                        Answer
                      </span>
                    </div>
                    <p className="text-lg whitespace-pre-line">{currentCard.back}</p>
                    <p className="mt-6 text-sm text-muted-foreground">
                      Click to see question
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrevious}
                className="gap-2"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </Button>
              <Button
                size="lg"
                onClick={handleNext}
                className="gap-2 bg-flashcard hover:bg-flashcard/90 text-primary-foreground"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Additional Controls */}
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" onClick={handleShuffle} className="gap-2">
                <Shuffle className="h-4 w-4" />
                Shuffle
              </Button>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>

            {/* Card Dots */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentIndex(index);
                  }}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all',
                    index === currentIndex
                      ? 'bg-flashcard scale-125'
                      : 'bg-secondary hover:bg-flashcard/50'
                  )}
                />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {cards.length === 0 && !isLoading && (
          <div className="text-center text-sm text-muted-foreground bg-secondary/50 rounded-lg p-8">
            <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-2">
              � <strong>Get started:</strong> Enter a topic above to generate flashcards.
            </p>
            <p>The AI will create personalized flashcards to help you study!</p>
          </div>
        )}
      </div>
    );
};

export default Flashcards;
