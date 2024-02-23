
from uuid import UUID
from sqlmodel import Field, SQLModel, Relationship
from datetime import timedelta, datetime
from typing import  TYPE_CHECKING, Optional

from app.models.base_uuid_model import BaseUUIDModel
from app.utils.model_enums import QuestionTypeEnum

if TYPE_CHECKING:
    from app.models.quiz_engine_model import Quiz  # Avoid circular imports at runtime
    from app.models.quiz_feedback_model import QuizFeedback, QuizQuestionFeedback  # Avoid circular imports at runtime
    from app.models.quiz_grade_model import QuizGrade  # Avoid circular imports at runtime
    from app.models.question_bank_model import Question  # Avoid circular imports at runtime

#---------------------
# Quiz Attempt Engine (stores the info a user's attempts at a question.)
#---------------------


# Quiz Attempt Table: 
class QuizAttemptBase(SQLModel):
    user_id: str = Field(index=True)
    quiz_id: UUID = Field(index=True, foreign_key="Quiz.id")
    time_limit: timedelta = Field()
    time_start: datetime | None = Field(default=None)
    time_finish: datetime | None = Field(default=None)
    total_points: int
    attempt_score: float | None = Field(default=None)
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
    
    question_type: QuestionTypeEnum

    # answer_id: UUID | None = Field(default=None)
    answer_text: str | None = Field(default=None)
    

class QuizAnswerSlot(BaseUUIDModel, QuizAnswerSlotBase, table=True):
    
    points_awarded: int | None = Field(default=None)
    quiz_question_feedback_id: UUID | None = Field(default=None, foreign_key="QuizQuestionFeedback.id")
    
    quiz_attempt: "QuizAttempt" = Relationship(back_populates="quiz_answers")
    question: "Question" = Relationship(back_populates="quiz_answers")
    quiz_question_feedback: Optional["QuizQuestionFeedback"] = Relationship(back_populates="quiz_answer_slots")
    selected_options: list["QuizAnswerOption"] = Relationship(back_populates="quiz_answer_slot", sa_relationship_kwargs={"lazy": "selectin"})


class QuizAnswerOptionBase(SQLModel):
    quiz_answer_slot_id: UUID = Field(foreign_key="QuizAnswerSlot.id")
    option_id: UUID  # This represents the specific option selected

class QuizAnswerOption(BaseUUIDModel, QuizAnswerOptionBase, table=True):
    # Relationship back to the QuizAnswerSlot
    quiz_answer_slot: "QuizAnswerSlot" = Relationship(back_populates="selected_options", sa_relationship_kwargs={"lazy": "joined"})

