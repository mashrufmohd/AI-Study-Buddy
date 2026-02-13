from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware # <--- IMPORTANT
from app.models import ExplainRequest, TextRequest, QuizRequest, FlashcardRequest
from app.ai_service import get_explanation, get_summary, get_quiz, get_flashcards
from app.utils import extract_text_from_pdf

app = FastAPI(title="AI Study Buddy API", version="2.0")

# --- CORS SETTINGS (Enables communication with React frontend) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, OPTIONS, etc.
    allow_headers=["*"],
)
# -----------------------------------------------------------------

@app.get("/")
def home():
    return {"message": "AI Study Buddy Backend is Running!"}

# 1. Explain
@app.post("/explain")
def explain_endpoint(request: ExplainRequest):
    try:
        result = get_explanation(request.topic, request.difficulty)
        return {"explanation": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. Summarize Text (Copy-Paste)
@app.post("/summarize-text")
def summarize_text_endpoint(request: TextRequest):
    try:
        result = get_summary(request.text)
        return {"summary": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3. Summarize PDF (File Upload)
@app.post("/summarize-pdf")
async def summarize_pdf_endpoint(file: UploadFile = File(...)):
    try:
        pdf_text = await extract_text_from_pdf(file)
        if not pdf_text.strip():
            raise HTTPException(status_code=400, detail="PDF is empty or unreadable.")
        
        # Limit text to first 10,000 characters to ensure speed
        result = get_summary(pdf_text[:10000])
        return {"summary": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Generate Quiz
@app.post("/quiz")
def quiz_endpoint(request: QuizRequest):
    try:
        result = get_quiz(request.material, request.num_questions)
        return {"questions": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 5. Generate Flashcards (NEW)
@app.post("/flashcards")
def flashcard_endpoint(request: FlashcardRequest):
    try:
        result = get_flashcards(request.topic, request.num_cards)
        return {"flashcards": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
