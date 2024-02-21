
from uuid import UUID
from sqlmodel import Field, SQLModel, Relationship
from typing import  TYPE_CHECKING, Optional

from app.models.base_uuid_model import BaseUUIDModel
from app.utils.model_enums import QuestionTypeEnum, QuestionDifficultyEnum

if TYPE_CHECKING:
    from app.models.quiz_model import Quiz  # Avoid circular imports at runtime
    from app.models.quiz_attempt_model import QuizAnswerSlot  # Avoid circular imports at runtime


#---------------------
# Question Bank (stores the question definitions, organised into types)
# --------------------

class MCQOptionsBase(SQLModel):
    question_id: UUID | None = Field(foreign_key="Question.id", default=None)
    option_text: str
    is_correct: bool = Field(default=False)

class MCQOptions(BaseUUIDModel, MCQOptionsBase, table=True):
    question: Optional["Question"] = Relationship(back_populates="mcq_options")

# - Question Table
class QuestionBase(SQLModel):
    question_text: str = Field(index=True)
    default_grade: int = Field(default=1)
    difficulty: QuestionDifficultyEnum = QuestionDifficultyEnum.easy
    question_type: QuestionTypeEnum = Field(index=True)
    points: int = Field(default=1)
    user_id: str = Field(index=True)
    quiz_id: UUID | None = Field(foreign_key="Quiz.id", default=None)
    correct_answer: str | None = Field(default=None)  # For coding and open text questions

class Question(BaseUUIDModel, QuestionBase, table=True):
    quiz: Optional["Quiz"] = Relationship(back_populates="questions")
    quiz_answers: list["QuizAnswerSlot"] = Relationship(back_populates="question")
    mcq_options: list["MCQOptions"] = Relationship(back_populates="question")
