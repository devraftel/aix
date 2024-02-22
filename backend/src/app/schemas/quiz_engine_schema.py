from uuid import UUID
from sqlmodel import SQLModel
from datetime import timedelta

from pydantic import field_validator
from app.models.quiz_engine_model import QuizBase
from app.models.question_bank_model import Question
from app.utils.model_enums import QuestionTypeEnum, QuestionDifficultyEnum


class IQuizCreate(QuizBase):
    @field_validator('time_limit')
    def check_time_limit(cls, value):
        if value.total_seconds() < 0:
            raise ValueError("Invalid Time Limit")
        return value


# All these fields are optional
class IQuizUpdate(SQLModel):
    title: str | None = None
    time_limit: timedelta | None = None

class IQuizRead(QuizBase):
    id: UUID

class IQuizRemove(SQLModel):
    id: UUID
    quiz_name: str
    deleted: bool


class IPaginatedQuizList(SQLModel):
    total: int
    next_page: int | None
    prev_page: int | None

    data: list[IQuizRead]
    skip: int | None = 0
    limit: int | None = 8

class IGenerateQuiz(SQLModel):
    title: str 
    user_id: str 
    time_limit: timedelta | None
    total_questions_to_generate: int
    questions_type: list[QuestionTypeEnum]
    difficulty: QuestionDifficultyEnum
    user_prompt: str | None = None
    file_ids: list[UUID] | None = None

    @field_validator('time_limit')
    def check_time_limit(cls, value):
        if value.total_seconds() < 0:
            raise ValueError("Invalid Time Limit")
        return value
    
    @field_validator('total_questions_to_generate')
    def check_total_questions_to_generate(cls, value):
        if value < 1:
            raise ValueError("Invalid Total Questions To Generate")
        return value
    
    @field_validator('questions_type')
    # Check if the question type is valid enum value
    def check_questions_type(cls, value):
        for question_type in value:
            if question_type not in QuestionTypeEnum:
                raise ValueError("Invalid Question Type", question_type)
        return value
    
    @field_validator('difficulty')
    # Check if the difficulty is valid enum value
    def check_difficulty(cls, value):
        for difficulty in value:
            if difficulty not in QuestionDifficultyEnum:
                raise ValueError("Invalid Difficulty", difficulty)
        return value