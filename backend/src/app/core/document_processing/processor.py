import aiohttp
import io
from typing import Union
from python_docx import Document
import pdfplumber
from fastapi import HTTPException


async def process_file_from_url(file_url: str) -> Union[str, None]:
    async with aiohttp.ClientSession() as session:
        async with session.get(file_url) as response:
            if response.status == 200:
                if file_url.endswith('.txt') or 'text/plain' in response.headers['Content-Type']:
                    return await response.text()
                elif file_url.endswith('.docx') or 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' in response.headers['Content-Type']:
                    content = await response.read()
                    return process_docx(io.BytesIO(content))
                elif file_url.endswith('.pdf') or 'application/pdf' in response.headers['Content-Type']:
                    content = await response.read()
                    return process_pdf(io.BytesIO(content))
                else:
                    raise HTTPException(status_code=415, detail="Unsupported file type")
            else:
                raise HTTPException(status_code=400, detail=f"Failed to download file: HTTP {response.status}")


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
