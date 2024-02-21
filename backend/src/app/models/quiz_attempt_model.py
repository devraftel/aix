
from uuid import UUID
from sqlmodel import Field, SQLModel, Relationship
from datetime import timedelta
from typing import  TYPE_CHECKING, Optional

from app.models.base_uuid_model import BaseUUIDModel
from app.utils.model_enums import QuestionTypeEnum

if TYPE_CHECKING:
    from app.models.quiz_engine_model import Quiz  # Avoid circular imports at runtime
    from app.models.question_bank_model import Question  # Avoid circular imports at runtime
    from app.models.quiz_feedback_model import QuizFeedback, QuizQuestionFeedback  # Avoid circular imports at runtime

#---------------------
# Quiz Attempt Engine (stores the info a user's attempts at a question.)
#---------------------


# Quiz Attempt Table: 
class QuizAttemptBase(SQLModel):
    user_id: str = Field(index=True)
    quiz_id: UUID = Field(index=True, foreign_key="Quiz.id")
    time_limit: timedelta = Field()
    time_started: timedelta | None = Field(default=None)
    time_finish: timedelta | None = Field(default=None)
    total_points: int
    attempt_score: int | None = Field(default=None)
    quiz_feedback_id: UUID | None = Field(default=None, foreign_key="QuizFeedback.id")

class QuizAttempt(BaseUUIDModel, QuizAttemptBase, table=True):
    quiz: Optional["Quiz"] = Relationship(back_populates="quiz_attempts")
    quiz_answers: list["QuizAnswerSlot"] = Relationship(back_populates="quiz_attempt")
    quiz_grades: list["QuizGrade"] = Relationship(back_populates="quiz_attempt")
    quiz_feedback: Optional["QuizFeedback" ] = Relationship(back_populates="quiz_attempts")

# Quiz Answer Slot: Save each User Answer and check to update the points awarded

class QuizAnswerSlotBase(SQLModel):
    quiz_attempt_id: UUID = Field(index=True, foreign_key="QuizAttempt.id")
    question_id: UUID = Field(index=True, foreign_key="Question.id")
    
    answer_id: UUID | None = Field(default=None)
    answer_text: str | None = Field(default=None)
    
    question_type: QuestionTypeEnum
    points_awarded: int | None = Field(default=None)

    quiz_question_feedback_id: UUID | None = Field(default=None, foreign_key="QuizQuestionFeedback.id")

class QuizAnswerSlot(BaseUUIDModel, QuizAnswerSlotBase, table=True):
    quiz_attempt: "QuizAttempt" = Relationship(back_populates="quiz_answers")
    question: "Question" = Relationship(back_populates="quiz_answers")
    quiz_question_feedback: Optional["QuizQuestionFeedback"] = Relationship(back_populates="quiz_answer_slots")

# Complete Quiz Grade: 

class QuizGradeBase(SQLModel):
    user_id: str = Field(index=True)
    quiz_id: UUID = Field(index=True, foreign_key="Quiz.id")
    quiz_attempt_id: UUID = Field(index=True, foreign_key="QuizAttempt.id")
    grade: int | None = Field(default=None)

class QuizGrade(BaseUUIDModel, QuizGradeBase, table=True):
    quiz: "Quiz" = Relationship(back_populates="quiz_grades")
    quiz_attempt: "QuizAttempt" = Relationship(back_populates="quiz_grades")
    