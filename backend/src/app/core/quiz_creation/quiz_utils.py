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
        Using the following information, craft a detailed multiple-choice question suitable for educational purposes. Ensure the question tests key concepts or facts within the content, has one clearly correct answer, and three plausible distractors. Focus on clarity, relevance to the content, and educational value. Consider common misconceptions that might make distractors more challenging.

        Content Summary:
        {content_piece}

        Generate a question as follows:
        """

        response = llm(prompt)  # Make sure this call matches your method of invoking the AI model

        # Parse and format the response into your IDictQuestion structure
        try:
            # Assuming parse_question_from_response returns a structured dict with 'question_text', 'options', etc.
            question_data = parse_question_from_response(response)
            generated_question = {
                "text": question_data["question_text"],
                "options": question_data["options"],
                "points": 1,
                "difficulty": "medium",
                "time_limit": 30,
            }
            generated_questions.append(generated_question)
        except Exception as e:
            print(f"Error parsing question from response: {e}")

    return generated_questions


def parse_question_from_response(response: str) -> Tuple[str, List[str]]:
    lines = response.splitlines()
    question_text = lines[0].split(":")[1].strip()
    options = [line.split(":")[1].strip() for line in lines[1:5]]
    correct_answer_letter = lines[5].split(":")[1].strip()
    correct_answer_index = ord(correct_answer_letter) - ord('A')  # Convert 'A', 'B',... to 0, 1, ...
    options.insert(correct_answer_index, f"* {options.pop(correct_answer_index)}") # Insert '*' to mark correct answer
    return question_text, options
