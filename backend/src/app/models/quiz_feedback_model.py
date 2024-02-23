from uuid import UUID
from sqlmodel import Field, SQLModel, Relationship
from typing import  TYPE_CHECKING

from app.models.base_uuid_model import BaseUUIDModel

if TYPE_CHECKING:
    from app.models.quiz_attempt_model import QuizAttempt, QuizAnswerSlot  # Avoid circular imports at runtime

#---------------------
# Overall Quiz & Each Quiz Question Feedback 
# --------------------

# - QuizQuestionFeedback Table

class QuizQuestionFeedbackBase(SQLModel):
    # feedback_score: int | None = Field(default=None)
    feedback_text: str | None = Field(default=None)
    llm_learning_json: str | None = Field(default=None)

    # user_id: str = Field(index=True)
    question_id: UUID = Field(index=True, foreign_key="Question.id")




class QuizQuestionFeedback(BaseUUIDModel, QuizQuestionFeedbackBase, table=True):
    quiz_answer_slots: list["QuizAnswerSlot"] = Relationship(back_populates="quiz_question_feedback")
    

# QuizFeedBack Table

class QuizFeedbackBase(SQLModel):
    # feedback_score: int | None = Field(default=None)
    feedback_text: str | None = Field(default=None)
    llm_learning_json: str | None = Field(default=None)

    quiz_id: UUID = Field(index=True, foreign_key="Quiz.id")
    # user_id: str = Field(index=True)

class QuizFeedback(BaseUUIDModel, QuizFeedbackBase, table=True):
    quiz_attempts: list["QuizAttempt"] = Relationship(back_populates="quiz_feedback")