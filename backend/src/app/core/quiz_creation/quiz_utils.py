import os
from langchain.embeddings import OpenAIEmbeddings
from langchain.document_loaders import DirectoryLoader
from langchain.llms import OpenAI
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


async def generate_questions_content_with_rag(
    generate_quiz_data: dict,  # Updated to accept the full data structure as input
    db_session: AsyncSession,
    directory_path: str = "/app/documents"  # Example path, adjust as needed
) -> List[str]:
    try:
        # Retrieve relevant file content
        metadata_filter = {"file_id": generate_quiz_data["file_ids"]} if generate_quiz_data["file_ids"] else None
        relevant_docs = query_pinecone(generate_quiz_data["user_prompt"], metadata_filter=metadata_filter)

        # Load documents into Langchain format
        loader = DirectoryLoader(directory_path)
        documents = loader.load([doc.metadata['file_path'] for doc in relevant_docs])

        # Combine document texts into a single string for the context
        combined_documents = "\n\n".join(documents)

        # Initialize ChatGPT-4 (or suitable OpenAI LLM)
        llm = OpenAI(
            openai_api_key=OPENAI_API_KEY,
            temperature=0,  # Reduce randomness for factual question generation
            model_name="text-chat-davinci-004-turbo"  # Use ChatGPT-4-turbo
        )

        generated_questions = []
        for _ in range(generate_quiz_data["total_questions_to_generate"]):
            # Construct RAG Prompt for each question generation
            rag_prompt = f"""
            Generate a question based on the provided context. The question should be of type '{generate_quiz_data["questions_type"][0]}' and of '{generate_quiz_data["difficulty"]}' difficulty. If the question cannot be answered based on the context, generate a relevant question using the context as a guideline.

            Context: {combined_documents}

            Question:
            """

            # Generate question content piece
            rag_output = llm.query(rag_prompt).strip()
            generated_questions.append(rag_output)

        return generated_questions

    except Exception as e:
        print(f"Error in RAG pipeline: {e}")
        raise


async def generate_questions_with_ai(questions_content: List[str]) -> List[dict]:
    llm = OpenAI(openai_api_key=OPENAI_API_KEY)

    generated_questions = []
    for content_piece in questions_content:
        prompt = f"""
        Craft a detailed multiple-choice question based on the following information, suitable for educational purposes. The question should test key concepts or facts within the content and include one clearly correct answer and three plausible distractors. Focus on clarity, relevance to the content, and educational value. Consider common misconceptions that might make distractors more challenging. Present the question and options together, each on a separate line. Mark the correct answer by starting it with an asterisk (*) directly before the text, with no spaces between the asterisk and the text.

        Content Summary:
        {content_piece}

        Begin your response as follows:
        """

        response = llm(prompt)

        try:
            question_data = parse_answers(response)
            generated_question = {
                "text": question_data["question_text"],
                "options": question_data["options"],
                "correct_answer": question_data["correct_answer"],
                "points": 1,
                "difficulty": "medium",
                "time_limit": 30,
            }
            generated_questions.append(generated_question)
        except Exception as e:
            print(f"Error parsing question from response: {e}")

    return generated_questions


def parse_answers(response: str) -> dict:
    lines = response.strip().split('\n')

    options = []

    correct_answer_index = -1

    for i, line in enumerate(lines):
        if line.startswith("*"):
            correct_answer_index = i
            options.append(line[1:].strip())
        else:
            options.append(line.strip())

    return {
        "options": options,
        "correct_answer_index": correct_answer_index,
    }
