from uuid import UUID
from sqlmodel import SQLModel
from datetime import timedelta

from pydantic import field_validator
from app.models.quiz_engine_model import QuizBase
from app.models.user_file_modal import UserFileBase
from app.utils.model_enums import QuestionTypeEnum, QuestionDifficultyEnum


class IQuizCreate(QuizBase):
    user_file_ids: list[UUID] | None = None
    user_files: list[UserFileBase] = []

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Quiz 1",
                "time_limit": "0:30:00",
                "total_points": 100,
                "total_questions_count": 10,
                "user_file_ids": ["e3e4c3e1-1e4c-4e3e-8e1e-4c3e1e4c3e1e"]
            }
        }

    @field_validator('time_limit')
    def check_time_limit(cls, value):
        if value.total_seconds() < 0:
            raise ValueError("Invalid Time Limit")
        return value


# All these fields are optional
class IQuizUpdate(SQLModel):
    title: str | None = None
    time_limit: timedelta | None = None
    total_points: int | None = None
    total_questions_count: int | None = None


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