from sqlmodel import Field, SQLModel, Relationship
from datetime import timedelta
from typing import  TYPE_CHECKING

from app.models.base_uuid_model import BaseUUIDModel
from app.models.link_model import LinkQuizFile

if TYPE_CHECKING:
    from app.models.question_bank_model import Question  # Avoid circular imports at runtime
    from app.models.user_file_modal import UserFile  # Avoid circular imports at runtime
    from app.models.quiz_attempt_model import QuizAttempt, QuizGrade  # Avoid circular imports at runtime


class QuizBase(SQLModel):
    title: str = Field(index=True)
    user_id: str = Field(index=True)
    time_limit: timedelta = Field(default=timedelta(minutes=0))
    total_points: int = Field(default=0)


class Quiz(BaseUUIDModel, QuizBase, table=True):
    questions: list["Question"] = Relationship(back_populates='quiz')
    user_files: list["UserFile"] = Relationship(
        back_populates="quizzes",
        link_model=LinkQuizFile
    )
    quiz_attempts: list["QuizAttempt"] = Relationship(back_populates="quiz")
    quiz_grades: list["QuizGrade"] = Relationship(back_populates="quiz")