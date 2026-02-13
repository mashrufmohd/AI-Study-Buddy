import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  variant: 'explain' | 'summarize' | 'quiz' | 'flashcard';
}

const variantStyles = {
  explain: {
    card: 'feature-explain hover:border-explain/50',
    iconBg: 'bg-explain-light',
    iconColor: 'text-explain',
    button: 'bg-explain hover:bg-explain/90',
  },
  summarize: {
    card: 'feature-summarize hover:border-summarize/50',
    iconBg: 'bg-summarize-light',
    iconColor: 'text-summarize',
    button: 'bg-summarize hover:bg-summarize/90',
  },
  quiz: {
    card: 'feature-quiz hover:border-quiz/50',
    iconBg: 'bg-quiz-light',
    iconColor: 'text-quiz',
    button: 'bg-quiz hover:bg-quiz/90',
  },
  flashcard: {
    card: 'feature-flashcard hover:border-flashcard/50',
    iconBg: 'bg-flashcard-light',
    iconColor: 'text-flashcard',
    button: 'bg-flashcard hover:bg-flashcard/90',
  },
};

export function FeatureCard({ title, description, icon: Icon, href, variant }: FeatureCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card className={cn('card-hover bg-card', styles.card)}>
      <CardHeader>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', styles.iconBg)}>
          <Icon className={cn('h-6 w-6', styles.iconColor)} />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link to={href}>
          <Button className={cn('w-full gap-2 text-primary-foreground', styles.button)}>
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
