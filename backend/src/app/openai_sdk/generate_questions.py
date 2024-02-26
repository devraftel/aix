from app.openai_sdk.seed_config import GENERATE_QUESTIONS_ASSISTANT_SEED, MOCK_RAG_CONTENT, MOCK_GENERATED_QUESTIONS

from openai import OpenAI
from dotenv import load_dotenv, find_dotenv


_: bool = load_dotenv(find_dotenv())  # read local .env file

client: OpenAI = OpenAI()
import json 

def generate_questions(quiz_title: str, questions_to_generate: int, question_type:list, content: str, difficulty: str):
    """
    Grade Open Text Question
    """
    try:
        seed_prompt = f"""Create a 10 minutes 'Generative AI' Quiz that will have `4` Questions. The Questions type will include: 1. "single_select_mcq" 2. "multi_select_mcq" and "open_text_question". The Quiz will be easy and the questions generated shall follow: {MOCK_RAG_CONTENT}"""
        user_prompt = f"""Create a 30 minutes {quiz_title} Quiz of {difficulty} difficulty level that will have {questions_to_generate} Questions. The Questions type will include: {question_type}. The Quiz will be easy and the questions generated shall follow: {content}"""
        # 1. Call OpenAI API to grade the question
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": GENERATE_QUESTIONS_ASSISTANT_SEED},
                {"role": "user", "content": seed_prompt},
                {"role": "assistant", "content": json.dumps({'questions': MOCK_GENERATED_QUESTIONS})},
                {"role": "user", "content": user_prompt}
            ]
            )
        
        json_str = response.choices[0].message.content
        print(json_str)
        
        if json_str is None:
            raise ValueError("Question Grading Failed")
        
        # 2. Parse the response
        obj_out: dict[str, list[str]] = json.loads(json_str)

        return obj_out
    except Exception as e:
        raise ValueError(str(e))
    

# USAGE
    

# questions = generate_questions("Generative AI", 4, ["single_select_mcq", "multi_select_mcq", "open_text_question"], MOCK_RAG_CONTENT)

# print(questions)

# OUTPUT
    
# {
#     "questions": [
#         {
#             "time_limit": 5,
#             "question_text": "What is the purpose of Text Summarization in Generative AI?",
#             "difficulty": "easy",
#             "question_type": "single_select_mcq",
#             "points": 2,
#             "mcq_options": [
#                 {"option_text": "Produce a longer version of a piece of text with additional details", "is_correct": false},
#                 {"option_text": "Produce a shorter version of a piece of text while retaining the main ideas", "is_correct": true},
#                 {"option_text": "Detect harmful content within a piece of text", "is_correct": false},
#                 {"option_text": "Handle multiturn conversations through a chat-like interface", "is_correct": false}
#             ]
#         },
#         {
#             "time_limit": 7,
#             "question_text": "Select all the tasks associated with Generative AI?",
#             "difficulty": "easy",
#             "question_type": "multi_select_mcq",
#             "points": 3,
#             "mcq_options": [
#                 {"option_text": "Information extraction", "is_correct": true},
#                 {"option_text": "Detecting toxic or harmful content", "is_correct": true},
#                 {"option_text": "Reasoning", "is_correct": true},
# ...
# }