const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ExplainRequest {
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ExplainResponse {
  explanation: string;
}

export interface SummarizeTextRequest {
  text: string;
}

export interface SummarizeResponse {
  summary: string;
}

export interface QuizRequest {
  material: string;
  num_questions: number;
}

export interface QuizQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface FlashcardRequest {
  topic: string;
  num_cards: number;
}

export interface FlashcardResponse {
  flashcards: Flashcard[];
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new ApiError(`API Error: ${errorText}`, response.status);
  }
  return response.json();
}

export async function explainTopic(data: ExplainRequest): Promise<ExplainResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/explain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<ExplainResponse>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Could not connect to backend. Is it running?');
  }
}

export async function summarizeText(data: SummarizeTextRequest): Promise<SummarizeResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/summarize-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<SummarizeResponse>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Could not connect to backend. Is it running?');
  }
}

export async function summarizePdf(file: File): Promise<SummarizeResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/summarize-pdf`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<SummarizeResponse>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Could not connect to backend. Is it running?');
  }
}

export async function generateQuiz(data: QuizRequest): Promise<QuizResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<QuizResponse>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Could not connect to backend. Is it running?');
  }
}

export async function generateFlashcards(topic: string, num_cards: number): Promise<Flashcard[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/flashcards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, num_cards }),
    });
    const data = await handleResponse<FlashcardResponse>(response);
    return data.flashcards;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Could not connect to backend. Is it running?');
  }
}