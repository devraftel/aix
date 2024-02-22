import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from langchain_community.vectorstores import Pinecone
from langchain.embeddings import OpenAIEmbeddings
from openai import APIError
from pinecone.exceptions import PineconeException


# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

app = FastAPI()  # Create a FastAPI instance


async def generate_embedding(text):
    """Embeds the given text using OpenAI embeddings."""
    try:
        embedder = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
        text_embedding = embedder.embed_query(text)
        return text_embedding
    except APIError as e:
        print(f"OpenAI Error: {e}")
        raise HTTPException(status_code=500, detail="Error generating embedding from OpenAI")


async def store_in_pinecone(embedding, text, metadata={}):
    """Stores an embedding in Pinecone."""
    try:
        pinecone_store = Pinecone.from_existing_index(PINECONE_API_KEY, PINECONE_INDEX_NAME)
        pinecone_id = await pinecone_store.add_embedding(embedding, text, metadata)
        return embedding, pinecone_id
    except PineconeException as e:
        print(f"Pinecone Error: {e}")
        raise HTTPException(status_code=500, detail="Error storing data in Pinecone")
    except Exception as e:
        print(f"Unexpected Error: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")


async def receive_and_process_text(text):
    """Receives text input, generates an embedding, and stores it in Pinecone."""
    embedding = await generate_embedding(text)
    if embedding:
        metadata = {"original_text": text}
        await store_in_pinecone(embedding, text, metadata)
