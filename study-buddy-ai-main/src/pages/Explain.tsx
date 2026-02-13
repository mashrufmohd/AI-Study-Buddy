import { useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ResponseCard } from '@/components/ResponseCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Lightbulb, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { explainTopic, ExplainRequest } from '@/lib/api';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

const difficultyDescriptions = {
  Easy: 'Simple terms, great for beginners',
  Medium: 'Balanced depth, good for most learners',
  Hard: 'Advanced detail, for deep understanding',
};

const Explain = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a topic first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const data: ExplainRequest = { topic: topic.trim(), difficulty };
      const result = await explainTopic(data);
      setResponse(result.explanation);
      toast({
        title: 'Success!',
        description: 'Explanation generated successfully.',
      });
    } catch (error) {
      console.error('Explain error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Could not connect to backend. Is it running?',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-enter max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-explain-light">
            <BookOpen className="h-8 w-8 text-explain" />
          </div>
          <h1 className="text-3xl font-bold">Explain a Concept</h1>
          <p className="text-muted-foreground text-lg">
            Get AI-powered explanations for any topic at your preferred difficulty level.
          </p>
        </div>

        {/* Input Form */}
        <Card className="feature-explain">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-explain" />
              What do you want to learn?
            </CardTitle>
            <CardDescription>
              Enter a topic and select your preferred difficulty level.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Deadlock, Photosynthesis, Machine Learning"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {(Object.keys(difficultyDescriptions) as Difficulty[]).map((level) => (
                      <SelectItem key={level} value={level}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{level}</span>
                          <span className="text-xs text-muted-foreground">
                            {difficultyDescriptions[level]}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gap-2 bg-explain hover:bg-explain/90 text-primary-foreground"
              >
                {isLoading ? (
                  'Generating...'
                ) : (
                  <>
                    Explain Concept
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Response */}
        {response && !isLoading && (
          <ResponseCard title="AI Explanation" content={response} />
        )}
      </div>
    );
};

export default Explain;
