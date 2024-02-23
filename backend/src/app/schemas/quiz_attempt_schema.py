from uuid import UUID
from sqlmodel import SQLModel
from datetime import timedelta, datetime

from app.models.quiz_attempt_model import QuizAttemptBase, QuizAnswerSlotBase, QuizAnswerOptionBase
from app.models.quiz_feedback_model import QuizFeedbackBase
from app.utils.model_enums import QuestionTypeEnum

class IQuizAttemptCreate(SQLModel):
    user_id: str
    quiz_id: UUID
    time_limit: timedelta
    time_start: datetime
    total_points: int

# All these fields are optional
class IQuizAttemptUpdate(SQLModel):
    time_finish: datetime | None = None
    attempt_score: float | None = None
    quiz_feedback_id: UUID | None = None    
    quiz_feedback: QuizFeedbackBase | None = None


class IQuizAttemptRead(QuizAttemptBase):
    id: UUID

# ---------------------
# Quiz Attempt Create Response 
# ---------------------
    
class QuizMCQOptions(SQLModel):
    id: UUID
    option_text: str

class QuizAttemptQuestions(SQLModel):
    id: UUID
    question_text: str
    question_type: QuestionTypeEnum
    points: int 
    mcq_options: list[QuizMCQOptions] = []

class IQuizAttemptCreateResponse(SQLModel):
    id: UUID
    user_id: str
    quiz_title: str
    quiz_id: UUID
    time_limit: timedelta
    time_start: datetime
    total_points: int
    questions: list[QuizAttemptQuestions]

# ---------------------
# QuizAnswerSlot
# ---------------------
class IQuizAnswerSlotCreate(QuizAnswerSlotBase):
    selected_options_ids: list[UUID] = []
    selected_options: list[QuizAnswerOptionBase] = []

class IQuizAnswerSlotRead(QuizAnswerSlotBase):
    id: UUID
    selected_options: list[QuizAnswerOptionBase] = []

class IQuizAnswerSlotUpdate(SQLModel):    
    answer_id: UUID | None = None
    answer_text: str | None = None
    points_awarded: float | None = None
    quiz_question_feedback_id: UUID | None = None

