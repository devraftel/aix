from uuid import UUID
from sqlmodel import SQLModel
from datetime import timedelta

from pydantic import field_validator, model_validator
from app.models.question_bank_model import Question, QuestionBase, MCQOptionsBase
from app.utils.model_enums import QuestionTypeEnum, QuestionDifficultyEnum


class IQuestionCreate(QuestionBase):
    mcq_options: list[MCQOptionsBase] = []

    class Config:
        json_schema_extra = {
                   "example": {
                        "question_text": "What is Generative AI?",
                        "difficulty": "medium",
                        "question_type": "single_select_mcq",
                        "points": 1,
                        "user_id": "1",
                        "quiz_id": "018dd038-6068-7aeb-8d45-18b1f10079de",
                        "mcq_options": [
                            {
                                "option_text": "A type of machine learning that generates new content",
                                "is_correct": True
                            },
                            {
                                "option_text": "A type of machine learning that classifies data",
                                "is_correct": False
                            },
                            {
                                "option_text": "A type of machine learning that optimizes algorithms",
                                "is_correct": False
                            },
                            {
                                "option_text": "A type of machine learning that detects anomalies",
                                "is_correct": False
                            }
                        ]
                    }
                    # {
                    #     "question_text": "What is Generative AI?",
                    #     "difficulty": "medium",
                    #     "question_type": "open_text_question",
                    #     "points": 1,
                    #     "user_id": "1",
                    #     "quiz_id": "quiz1",
                    #     "correct_answer": "Generative AI is a type of artificial intelligence that is capable of creating new content or data that is similar to the data it was trained on. This can include creating images, text, and even music or video."
                    # }


        }


    # Check question_type is valid enum
    @field_validator('question_type')
    def check_question_type(cls, v):
        if v not in QuestionTypeEnum:
            # check if it has mcq in the type - if has then make it a single_select_mcq
            if "mcq" in v:
                # Make question_type single_select_mcq
                return "single_select_mcq"
            # check it IQuestionCreate has correct_answer- if has then make it a open_text_question
            elif "correct_answer" in cls.__dict__:
                return "open_text_question"
            else:
                raise ValueError('Invalid question type')
        return v

    # Check difficulty is valid enum if not or missing make it medium
    @field_validator('difficulty')
    def check_difficulty(cls, v):
        if v not in QuestionDifficultyEnum:
            return "medium"
        return v

    # Check points is positive
    @field_validator('points')
    def check_points(cls, v):
        if v < 0:
            return 1
        return v

    # Check if mcq_options is empty if question_type is not mcq
    @model_validator(mode="after")
    def check_mcq_options(self):
        if self.question_type not in ["single_select_mcq", "multi_select_mcq"]:
            # Make mcq_options empty & Add correct option to correct_answer if it;s not present
            if self.mcq_options and not self.correct_answer:
                for option in self.mcq_options:
                    if option.is_correct:
                        self.correct_answer = option.option_text
                self.mcq_options = []
            else:
                self.mcq_options = []
        return self


class IQuestionRead(QuestionBase):
    id: UUID
    mcq_options: list[MCQOptionsBase] = []


class IBatchQuestionsCreate(SQLModel):
    questions: list[IQuestionCreate]

    class Config:
        json_schema_extra = {
            "example": { 
                "questions": [
                    {
                        "question_text": "What is Generative AI?",
                        "difficulty": "medium",
                        "question_type": "single_select_mcq",
                        "points": 1,
                        "user_id": "1",
                        "quiz_id": "018dd038-6068-7aeb-8d45-18b1f10079de",
                        "mcq_options": [
                            {
                                "option_text": "A type of machine learning that generates new content",
                                "is_correct": True
                            },
                            {
                                "option_text": "A type of machine learning that classifies data",
                                "is_correct": False
                            },
                            {
                                "option_text": "A type of machine learning that optimizes algorithms",
                                "is_correct": False
                            },
                            {
                                "option_text": "A type of machine learning that detects anomalies",
                                "is_correct": False
                            }
                        ]
                    },
                    {
                        "question_text": "What is Generative AI?",
                        "difficulty": "medium",
                        "question_type": "open_text_question",
                        "points": 1,
                        "user_id": "1",
                        "quiz_id": "018dd038-6068-7aeb-8d45-18b1f10079de",
                        "correct_answer": "Generative AI is a type of artificial intelligence that is capable of creating new content or data that is similar to the data it was trained on. This can include creating images, text, and even music or video."
                    }
                ]
            }
        }
