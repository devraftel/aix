from dotenv import load_dotenv, find_dotenv
import os

from fastapi import HTTPException
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings

# Load environment variables
_: bool = load_dotenv(find_dotenv())  # read local .env file

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
PINECONE_INDEX = os.environ.get("PINECONE_INDEX")


async def retrieve_from_pinecone(query, filter ):
    """Stores an embedding in Pinecone."""
    try:
        print("\Retrieving from Pinecone\n")

        pinecone_store = PineconeVectorStore(index_name=PINECONE_INDEX, embedding=OpenAIEmbeddings())
        print("\n Pinecone Store Init:\n", pinecone_store)


        retrieved_content = pinecone_store.similarity_search_with_score(
            query=query, filter=filter
        )

        print("\nRetrieved Content:\n", retrieved_content)

        return retrieved_content
    except Exception as e:
        print(f"Unexpected Error: {e}")
        raise HTTPException(
            status_code=500, detail="An unexpected error occurred when retrieving data from Pinecone")

