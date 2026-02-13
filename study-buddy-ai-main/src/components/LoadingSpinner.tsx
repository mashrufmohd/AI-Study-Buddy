import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export function LoadingSpinner({ text = 'AI is thinking...', className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center gap-3 py-8', className)}>
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span className="text-muted-foreground thinking-pulse">{text}</span>
    </div>
  );
}
