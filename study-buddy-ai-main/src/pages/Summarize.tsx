import { useState, useCallback } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ResponseCard } from '@/components/ResponseCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Type, ArrowRight, FileUp, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { summarizeText, summarizePdf } from '@/lib/api';

const Summarize = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('text');
  const { toast } = useToast();

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter some text to summarize.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const result = await summarizeText({ text: text.trim() });
      setResponse(result.summary);
      toast({
        title: 'Success!',
        description: 'Summary generated successfully.',
      });
    } catch (error) {
      console.error('Summarize text error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Could not connect to backend. Is it running?',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast({
        title: 'Validation Error',
        description: 'Please upload a PDF file first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const result = await summarizePdf(file);
      setResponse(result.summary);
      toast({
        title: 'Success!',
        description: 'PDF summarized successfully.',
      });
    } catch (error) {
      console.error('Summarize PDF error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Could not connect to backend. Is it running?',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      toast({
        title: 'Invalid File',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else if (selectedFile) {
      toast({
        title: 'Invalid File',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="page-enter max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-summarize-light">
            <FileText className="h-8 w-8 text-summarize" />
          </div>
          <h1 className="text-3xl font-bold">Smart Summarizer</h1>
          <p className="text-muted-foreground text-lg">
            Transform lengthy notes or PDFs into concise, easy-to-review summaries.
          </p>
        </div>

        {/* Input Tabs */}
        <Card className="feature-summarize">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-summarize" />
              Choose Your Input
            </CardTitle>
            <CardDescription>
              Paste your notes or upload a PDF document.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="text" className="gap-2">
                  <Type className="h-4 w-4" />
                  Paste Text
                </TabsTrigger>
                <TabsTrigger value="pdf" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload PDF
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text">
                <form onSubmit={handleTextSubmit} className="space-y-4">
                  <Textarea
                    placeholder="Paste your notes, articles, or study material here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={10}
                    className="resize-none text-base"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full gap-2 bg-summarize hover:bg-summarize/90 text-primary-foreground"
                  >
                    {isLoading ? (
                      'Summarizing...'
                    ) : (
                      <>
                        Summarize Text
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="pdf">
                <form onSubmit={handlePdfSubmit} className="space-y-4">
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className={`
                      border-2 border-dashed rounded-xl p-8 text-center transition-colors
                      ${file ? 'border-summarize bg-summarize-light' : 'border-border hover:border-summarize/50'}
                    `}
                  >
                    {file ? (
                      <div className="space-y-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-summarize/20">
                          <FileUp className="h-6 w-6 text-summarize" />
                        </div>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFile(null)}
                          className="gap-2"
                        >
                          <X className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">Drop your PDF here</p>
                          <p className="text-sm text-muted-foreground">
                            or click to browse
                          </p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileInput}
                          className="hidden"
                          id="pdf-upload"
                        />
                        <label htmlFor="pdf-upload">
                          <Button type="button" variant="outline" asChild>
                            <span>Browse Files</span>
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !file}
                    className="w-full gap-2 bg-summarize hover:bg-summarize/90 text-primary-foreground"
                  >
                    {isLoading ? (
                      'Summarizing...'
                    ) : (
                      <>
                        Upload & Summarize
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Response */}
        {response && !isLoading && (
          <ResponseCard title="Summary" content={response} />
        )}
      </div>
    );
};

export default Summarize;
