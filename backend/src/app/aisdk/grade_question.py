from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
import json

_ : bool = load_dotenv(find_dotenv()) # read local .env file

client : OpenAI = OpenAI()

# 1. Grade open text question
def grade_open_text_question(question: str, correct_answer: str, answer_text, total_points: int):
    """
    Grade Open Text Question
    """
    try:
        seed_prompt = f"'\nTotal Points: '1'\n. Question: 'What are design patterns?'\nCorrect Answer: 'Design patterns are reusable solutions to common software design problems, categorized into creational, structural, and behavioral types.'\nAttempted Answer: 'Design patterns are reusable solutions to common software design problems. \n Reason to see logic and grade the question our of total points."
        prompt = f"Question: {question}\nCorrect Answer: {correct_answer}\nAttempted Answer: {answer_text}\nTotal Points: {total_points}\n. Reason to see logic and grade the question our of total points."
        # 1. Call OpenAI API to grade the question
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "You are a helpful teaching assistant who reasons and grades quiz questions and return awarded marks in JSON."},
                {"role": "user", "content": seed_prompt},
                {"role": "assistant", "content": "{'total_points': 1, 'points_awarded': 0.7, reason: 'The attempted answer captures the essence of design patterns but lacks specificity regarding the categorization into creational, structural, and behavioral types, as mentioned in the correct answer.'}"},
                {"role": "user", "content": prompt}
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