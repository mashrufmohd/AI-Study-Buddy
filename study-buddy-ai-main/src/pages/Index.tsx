import { FeatureCard } from '@/components/FeatureCard';
import { BookOpen, FileText, Brain, Layers, Sparkles, Zap, Target } from 'lucide-react';

const features = [
  {
    title: 'Explain a Concept',
    description: 'Get clear, AI-powered explanations for any topic at your preferred difficulty level.',
    icon: BookOpen,
    href: '/explain',
    variant: 'explain' as const,
  },
  {
    title: 'Summarize Notes',
    description: 'Transform lengthy notes or PDFs into concise, easy-to-review summaries.',
    icon: FileText,
    href: '/summarize',
    variant: 'summarize' as const,
  },
  {
    title: 'Test Yourself',
    description: 'Generate custom quizzes from your study material to test your knowledge.',
    icon: Brain,
    href: '/quiz',
    variant: 'quiz' as const,
  },
];

const benefits = [
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Advanced AI helps you learn faster and retain more.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get explanations, summaries, and quizzes in seconds.',
  },
  {
    icon: Target,
    title: 'Personalized',
    description: 'Content tailored to your learning level and needs.',
  },
];

const Index = () => {
  return (
    <div className="page-enter space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Your AI-Powered Learning Companion
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Study Smarter,{' '}
            <span className="gradient-text">Not Harder</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform how you learn with AI-powered explanations, smart summaries, 
            and personalized quizzes. Your study sessions just got supercharged.
          </p>
        </section>

        {/* Quick Start Cards */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Quick Start</h2>
            <p className="text-muted-foreground">Choose a feature to begin your study session</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.href} {...feature} />
            ))}
          </div>
        </section>

        {/* Flashcards Card */}
        <section className="flex justify-center">
          <div className="w-full max-w-md">
            <FeatureCard
              title="Flashcards"
              description="Review concepts with interactive flip cards for better memorization."
              icon={Layers}
              href="/flashcards"
              variant="flashcard"
            />
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-secondary/50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Why Use AI Study Buddy?</h2>
            <p className="text-muted-foreground">Features designed for effective learning</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
};

export default Index;
