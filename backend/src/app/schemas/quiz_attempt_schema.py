from uuid import UUID
from sqlmodel import SQLModel
from datetime import timedelta

from app.models.quiz_attempt_model import QuizAttemptBase, QuizAnswerSlotBase
from app.models.quiz_feedback_model import QuizFeedback

# Change to Question Schema
from app.models.question_bank_model import Question

class IQuizAttemptCreate(SQLModel):

    user_id: str
    quiz_id: UUID

    # We will not take the user's input for the following fields

    # exclude = ['quiz_feedback_id', 'time_started', 'time_finish', 'attempt_score', 'total_points', "time_limit"]
    # time_started is stamped in Crud and others (total_points, time_limit) are added as we get them when checking quiz_id 
    # time_finish is either quiz duration timeout or when user submits the quiz

# All these fields are optional
class IQuizAttemptUpdate(SQLModel):
    time_start: timedelta | None = None
    time_finish: timedelta | None = None
    attempt_score: float | None = None
    quiz_feedback_id: UUID | None = None    
    quiz_feedback: QuizFeedback | None = None


class IQuizAttemptRead(QuizAttemptBase):
    id: UUID


class IQuizAttemptCreateResponse(SQLModel):
    id: UUID
    total_points: int
    time_limit: timedelta
    user_id: str
    quiz_id: UUID
    #TODO: Replace Question with Schema that includes MCQ options for MCQ type questions & exclude correct and extra fie;s using pydantic's parsing & validation
    questions: list[Question]

# ---------------------
# QuizAnswerSlot
# ---------------------
    
class IQuizAnswerSlotCreate(QuizAnswerSlotBase):
    pass

class IQuizAnswerSlotRead(QuizAnswerSlotBase):
    id: UUID
class IQuizAnswerSlotUpdate(SQLModel):    
    answer_id: UUID | None = None
    answer_text: str | None = None
    points_awarded: int | None = None
    quiz_question_feedback_id: UUID | None = None
