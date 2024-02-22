
from uuid import UUID
from sqlmodel import Field, SQLModel, Relationship
from typing import  TYPE_CHECKING

from app.models.base_uuid_model import BaseUUIDModel

if TYPE_CHECKING:
    from app.models.quiz_engine_model import Quiz  # Avoid circular imports at runtime
    from app.models.quiz_attempt_model import QuizAttempt  # Avoid circular imports at runtime


# Complete Quiz Grade: 
class QuizGradeBase(SQLModel):
    user_id: str = Field(index=True)
    quiz_id: UUID = Field(index=True, foreign_key="Quiz.id")
    quiz_attempt_id: UUID = Field(index=True, foreign_key="QuizAttempt.id")
    grade: int | None = Field(default=None)

class QuizGrade(BaseUUIDModel, QuizGradeBase, table=True):
    quiz: "Quiz" = Relationship(back_populates="quiz_grades")
    quiz_attempt: "QuizAttempt" = Relationship(back_populates="quiz_grades")
    