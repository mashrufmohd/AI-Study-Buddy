from pypdf import PdfReader
from fastapi import UploadFile

async def extract_text_from_pdf(file: UploadFile):
    try:
        reader = PdfReader(file.file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() if page.extract_text() else ""
        return text
    except Exception as e:
        return ""
