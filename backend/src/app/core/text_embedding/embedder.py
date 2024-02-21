from fastapi import HTTPException
import langchain.embeddings as embeddings
from langchain.vectorstores import Pinecone
from pinecone.exceptions import PineconeException
from openai import APIError
from dotenv import load_dotenv
import os


# Load environment variables from .env file
load_dotenv()

# Access environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")


async def generate_embedding(text):
    """Embeds the given text using OpenAI embeddings.

    Args:
        text (str): The text to be embedded.

    Returns:
        list: The generated embedding vector.
    """

    try:
        embedder = embeddings.OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
        text_embedding = embedder.embed_query(text)
        return text_embedding
    except APIError as e:
        print(f"OpenAI Error: {e}")  # Consider logging to a file for debugging
        raise HTTPException(
            status_code=500, detail="Error generating embedding from OpenAI"
        )


async def store_in_pinecone(embedding, text, metadata={}):
    """Stores an embedding in Pinecone.

    Args:
        embedding (list): The embedding vector.
        text (str): The original text.
        metadata (dict, optional): Additional metadata to store. Defaults to {}.
    """

    try:
        pinecone_store = Pinecone.from_existing_index(
            PINECONE_API_KEY, PINECONE_INDEX_NAME
        )
        pinecone_id = pinecone_store.add_embedding(embedding, text, metadata)
        return embedding, pinecone_id  # Return both embedding and ID
    except PineconeException as e:
        print(f"Pinecone Error: {e}")
        raise HTTPException(
            status_code=500, detail="Error storing data in Pinecone"
        )
    except Exception as e:  # Catch other unexpected errors
        print(f"Unexpected Error: {e}")
        raise HTTPException(
            status_code=500, detail="An unexpected error occurred"
        )


def receive_and_process_text(text):
    """Receives text input, generates an embedding, and stores it in Pinecone."""

    embedding = generate_embedding(text)
    if embedding:  # Make sure embedding was successfully generated
        metadata = {"original_text": text}
        store_in_pinecone(embedding, text, metadata)


if __name__ == "__main__":
    receive_and_process_text('Hello, World!')
