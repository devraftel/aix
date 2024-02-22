import io
from docx import Document
import pdfplumber
from fastapi import HTTPException


# Import your embedding functions
from app.core.text_embedding import receive_and_process_text


async def process_uploaded_file(file) -> None:
    """Processes uploaded file, extracts text, and sends for embedding."""

    try:
        file_bytes = await file.read()

        if file.content_type == 'text/plain':
            text = file_bytes.decode()
            await receive_and_process_text(text)
        elif file.content_type in ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']:
            text = process_docx(io.BytesIO(file_bytes))
            await receive_and_process_text(text)
        elif file.content_type == 'application/pdf':
            text = process_pdf(io.BytesIO(file_bytes))
            await receive_and_process_text(text)
        else:
            raise HTTPException(status_code=415, detail="Unsupported file type")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


def process_docx(file_stream) -> str:
    document = Document(file_stream)
    full_text = [para.text for para in document.paragraphs]
    return '\n'.join(full_text)


def process_pdf(file_stream) -> str:
    text = []
    with pdfplumber.open(file_stream) as pdf:
        for page in pdf.pages:
            text.append(page.extract_text())
    return '\n'.join(filter(None, text))  # Filters out any `None` values if text extraction fails for a page
