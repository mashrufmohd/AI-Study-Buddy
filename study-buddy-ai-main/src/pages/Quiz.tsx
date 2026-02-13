import { useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Brain, ArrowRight, Check, X, Eye, RotateCcw, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateQuiz, QuizQuestion } from '@/lib/api';
import { cn } from '@/lib/utils';

const Quiz = () => {
  const [material, setMaterial] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!material.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter study material first.',
        variant: 'destructive',
      });
      return;
    }

    if (numQuestions < 1 || numQuestions > 20) {
      toast({
        title: 'Validation Error',
        description: 'Number of questions must be between 1 and 20.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setQuestions([]);
    setSelectedAnswers({});
    setRevealedAnswers({});
    setQuizCompleted(false);

    try {
      const result = await generateQuiz({ material: material.trim(), num_questions: numQuestions });
      setQuestions(result.questions);
      toast({
        title: 'Success!',
        description: `Generated ${result.questions.length} questions.`,
      });
    } catch (error) {
      console.error('Quiz generation error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Could not connect to backend. Is it running?',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    if (revealedAnswers[questionIndex]) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleRevealAnswer = (questionIndex: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [questionIndex]: true }));
  };

  const handleFinishQuiz = () => {
    // Reveal all answers
    const allRevealed: Record<number, boolean> = {};
    questions.forEach((_, index) => {
      allRevealed[index] = true;
    });
    setRevealedAnswers(allRevealed);
    setQuizCompleted(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setRevealedAnswers({});
    setQuizCompleted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct_answer) {
        correct++;
      }
    });
    return correct;
  };

  const optionLabels = ['A', 'B', 'C', 'D'] as const;

  return (
    <div className="page-enter max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-quiz-light">
          <Brain className="h-8 w-8 text-quiz" />
        </div>
        <h1 className="text-3xl font-bold">Quiz Generator</h1>
        <p className="text-muted-foreground text-lg">
          Generate custom quizzes from your study material to test your knowledge.
        </p>
      </div>

      {/* Input Form */}
        {questions.length === 0 && (
          <Card className="feature-quiz">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-quiz" />
                Create Your Quiz
              </CardTitle>
              <CardDescription>
                Paste your study material and let AI generate questions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="material">Study Material</Label>
                  <Textarea
                    id="material"
                    placeholder="Paste your notes, textbook content, or any study material here..."
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    rows={8}
                    className="resize-none text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numQuestions">Number of Questions</Label>
                  <Input
                    id="numQuestions"
                    type="number"
                    min={1}
                    max={20}
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value) || 5)}
                    className="max-w-32"
                  />
                  <p className="text-sm text-muted-foreground">Between 1 and 20 questions</p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gap-2 bg-quiz hover:bg-quiz/90 text-primary-foreground"
                >
                  {isLoading ? (
                    'Generating...'
                  ) : (
                    <>
                      Generate Quiz
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && <LoadingSpinner text="AI is generating your quiz..." />}

        {/* Quiz Questions */}
        {questions.length > 0 && (
          <div className="space-y-6">
            {/* Score Card */}
            {quizCompleted && (
              <Card className="bg-quiz-light border-quiz animate-scale-in">
                <CardContent className="py-6">
                  <div className="flex items-center justify-center gap-4">
                    <Trophy className="h-8 w-8 text-quiz" />
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Your Score</p>
                      <p className="text-3xl font-bold text-quiz">
                        {calculateScore()} / {questions.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((calculateScore() / questions.length) * 100)}% correct
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              {!quizCompleted && (
                <Button
                  onClick={handleFinishQuiz}
                  className="gap-2 bg-quiz hover:bg-quiz/90 text-primary-foreground"
                >
                  <Trophy className="h-4 w-4" />
                  Finish Quiz & See Score
                </Button>
              )}
              <Button variant="outline" onClick={handleResetQuiz} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset Answers
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setQuestions([]);
                  setSelectedAnswers({});
                  setRevealedAnswers({});
                  setQuizCompleted(false);
                }}
              >
                New Quiz
              </Button>
            </div>

            {/* Questions */}
            {questions.map((question, qIndex) => {
              const selected = selectedAnswers[qIndex];
              const revealed = revealedAnswers[qIndex];
              const isCorrect = selected === question.correct_answer;

              return (
                <Card
                  key={qIndex}
                  className={cn(
                    'animate-fade-in feature-quiz',
                    revealed && isCorrect && 'border-success',
                    revealed && !isCorrect && selected && 'border-destructive'
                  )}
                  style={{ animationDelay: `${qIndex * 100}ms` }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-quiz-light text-quiz flex items-center justify-center text-sm font-bold">
                        {qIndex + 1}
                      </span>
                      <span>{question.question}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      {optionLabels.map((label) => {
                        const optionKey = label as keyof typeof question.options;
                        const optionText = question.options[optionKey];
                        const isSelected = selected === label;
                        const isCorrectOption = question.correct_answer === label;

                        return (
                          <button
                            key={label}
                            onClick={() => handleSelectAnswer(qIndex, label)}
                            disabled={revealed}
                            className={cn(
                              'w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-3',
                              !revealed && !isSelected && 'border-border hover:border-quiz/50 bg-card',
                              !revealed && isSelected && 'border-quiz bg-quiz-light',
                              revealed && isCorrectOption && 'border-success bg-success/10',
                              revealed && isSelected && !isCorrectOption && 'border-destructive bg-destructive/10'
                            )}
                          >
                            <span
                              className={cn(
                                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                                !revealed && !isSelected && 'bg-secondary',
                                !revealed && isSelected && 'bg-quiz text-primary-foreground',
                                revealed && isCorrectOption && 'bg-success text-success-foreground',
                                revealed && isSelected && !isCorrectOption && 'bg-destructive text-destructive-foreground'
                              )}
                            >
                              {revealed && isCorrectOption && <Check className="h-4 w-4" />}
                              {revealed && isSelected && !isCorrectOption && <X className="h-4 w-4" />}
                              {!revealed && label}
                            </span>
                            <span className="flex-1">{optionText}</span>
                          </button>
                        );
                      })}
                    </div>

                    {!revealed && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevealAnswer(qIndex)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Show Answer
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
};

export default Quiz;
