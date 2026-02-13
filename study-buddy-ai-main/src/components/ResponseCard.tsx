import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResponseCardProps {
  title: string;
  content: string;
}

const LINES_PER_PAGE = 50;

export function ResponseCard({ title, content }: ResponseCardProps) {
  const [copied, setCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();

  // Clean special characters from content
  const cleanedContent = useMemo(() => {
    return content
      .replace(/\$[^$]*\$/g, '') // Remove $...$
      .replace(/#{4,}/g, '###') // Convert #### to ###
      .replace(/\* /g, '• ') // Convert * to •
      .replace(/\*\*/g, ''); // Remove ** markers (will handle separately)
  }, [content]);

  // Split content into pages
  const pages = useMemo(() => {
    const lines = cleanedContent.split('\n');
    const pageArray = [];
    for (let i = 0; i < lines.length; i += LINES_PER_PAGE) {
      pageArray.push(lines.slice(i, i + LINES_PER_PAGE));
    }
    return pageArray.length > 0 ? pageArray : [[]];
  }, [cleanedContent]);

  const totalPages = pages.length;
  const currentPageContent = pages[currentPage]?.join('\n') || '';
  const canGoNext = currentPage < totalPages - 1;
  const canGoPrev = currentPage > 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanedContent);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Content copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleNextPage = () => {
    if (canGoNext) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (canGoPrev) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Simple markdown-like formatting
  const formatContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-semibold mt-4 mb-2">
            {line.slice(4)}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-semibold mt-4 mb-2">
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-2xl font-bold mt-4 mb-2">
            {line.slice(2)}
          </h1>
        );
      }
      // Bullet points
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <li key={index} className="ml-4 list-disc">
            {line.slice(2)}
          </li>
        );
      }
      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={index} className="ml-4 list-decimal">
            {line.replace(/^\d+\.\s/, '')}
          </li>
        );
      }
      // Bold text
      const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Empty lines
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return (
        <p
          key={index}
          className="mb-2"
          dangerouslySetInnerHTML={{ __html: boldFormatted }}
        />
      );
    });
  };

  return (
    <Card className="animate-fade-in bg-card border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none text-foreground max-h-96 overflow-y-auto p-4 bg-muted/20 rounded-lg">
          <div className="space-y-2">
            {formatContent(currentPageContent)}
          </div>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={!canGoPrev}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!canGoNext}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
