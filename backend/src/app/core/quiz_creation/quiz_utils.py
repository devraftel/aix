import os
from langchain.embeddings import OpenAIEmbeddings
from pinecone import Pinecone
from pinecone.exceptions import PineconeException

# Load environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def query_pinecone(prompt, metadata_filter=None, top_k=5):
    # Queries Pinecone with the user's prompt and optional metadata filters.
    try:
        # Initialize Pinecone connection
        pinecone_store = Pinecone(api_key=PINECONE_API_KEY, environment="us-west1-gcp")

        # Select the index
        pinecone_store.init(index_name=PINECONE_INDEX_NAME)

        embedder = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)

        query_embedding = embedder.embed_query(prompt)
        results = pinecone_store.query(
            query_embedding,
            filter=metadata_filter,
            top_k=top_k,
            include_metadata=True
        )

        return results.matches

    except PineconeException as e:
        print(f"Pinecone Error: {e}")
        raise
