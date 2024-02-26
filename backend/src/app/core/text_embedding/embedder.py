from dotenv import load_dotenv, find_dotenv
import os

from fastapi import HTTPException
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings

from app.core.document_processing.splitter import RecursiveCharacterTextSplitter


# Load environment variables
_: bool = load_dotenv(find_dotenv())  # read local .env file

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
PINECONE_INDEX = os.environ.get("PINECONE_INDEX")


async def store_in_pinecone(text, metadata={}):
    """Stores an embedding in Pinecone."""
    try:
        print("\nStoring in Pinecone\n")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=0)
        print("\nText Splitter:\n", text_splitter)

        doc_to_split = text_splitter.create_documents(texts=[text])
        print("\n -------- \n  doc_to_split  \n -------- \n",
              doc_to_split, "\n -------- \n")
        all_splits = text_splitter.split_documents(
            documents=doc_to_split, metadata_extra=metadata)

        print("\n -------- \n NUMBER OF SPLITS \n -------- \n",
              all_splits, "\n -------- \n")

        vectorstore = PineconeVectorStore.from_documents(
            documents=all_splits, embedding=OpenAIEmbeddings(), index_name=PINECONE_INDEX
        )

        print("\nPinecone store:\n", vectorstore)

        return vectorstore
    except Exception as e:
        print(f"Unexpected Error: {e}")
        raise HTTPException(
            status_code=500, detail="An unexpected error occurred when storing data in Pinecone")


async def receive_and_process_text(file_id: str, user_id: str, file_name: str, text):

    print("Received text:", text)
    metadata = {"file_id": file_id, "user_id": user_id, "file_name": file_name}

    await store_in_pinecone(text, metadata)
