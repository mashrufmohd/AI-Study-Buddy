from pydantic import BaseModel
from typing import Optional

# 1. Explain Topic
class ExplainRequest(BaseModel):
    topic: str
    difficulty: str = "Medium"  # Options: Easy, Medium, Hard

# 2. Summarize Text
class TextRequest(BaseModel):
    text: str

# 3. Generate Quiz
class QuizRequest(BaseModel):
    material: str
    num_questions: int = 5

# 4. Generate Flashcards (NEW)
class FlashcardRequest(BaseModel):
    topic: str
    num_cards: int = 5
