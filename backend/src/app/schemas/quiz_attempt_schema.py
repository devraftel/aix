from uuid import UUID
from sqlmodel import SQLModel
from datetime import timedelta, datetime
from pydantic import validator

from app.utils.model_enums import QuestionTypeEnum
from app.models.quiz_attempt_model import QuizAttemptBase, QuizAnswerSlotBase, QuizAnswerOptionBase
from app.models.quiz_feedback_model import QuizFeedbackBase

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

# ---------------------
# Get the graded quiz attempt by ID
# ---------------------
    
class MCQOptionRead(SQLModel):
    option_id: UUID
    option_text: str
    is_correct: bool
    selected_option: bool

class AttemptedQuestionRead(SQLModel):
    question_id: UUID
    question_text: str
    question_type: QuestionTypeEnum
    points: int
    points_awarded: float
    feedback_text: str
    answer_text: str | None = None
    mcq_options: list[MCQOptionRead] = []

class IQuizAttemptGradedRead(SQLModel):
    time_start: datetime
    total_points: int
    time_finish: datetime
    time_limit: timedelta
    attempt_score: float
    attempt_id: UUID
    quiz_id: UUID
    attempted_questions: list[AttemptedQuestionRead]



# Transformation function for a single quiz answer slot (question and its answers)
def transform_mcq_option(option, selected_option_ids):
    return MCQOptionRead(
        option_id=option.id,
        option_text=option.option_text,
        is_correct=option.is_correct,
        selected_option=option.id in selected_option_ids
    )

def transform_quiz_answer_slot(answer_slot):
    selected_option_ids = {option.option_id for option in answer_slot.selected_options}
    mcq_options_transformed = [transform_mcq_option(option, selected_option_ids) for option in answer_slot.question.mcq_options]

    return AttemptedQuestionRead(
        question_id=answer_slot.question.id,
        question_text=answer_slot.question.question_text,
        question_type=answer_slot.question.question_type,
        points=answer_slot.question.points,
        points_awarded=answer_slot.points_awarded,
        feedback_text=answer_slot.quiz_question_feedback.feedback_text if answer_slot.quiz_question_feedback else '',
        answer_text=answer_slot.answer_text,
        mcq_options=mcq_options_transformed
    )

def transform_quiz_attempt(quiz_attempt):
    attempted_questions = [transform_quiz_answer_slot(answer_slot) for answer_slot in quiz_attempt.quiz_answers]

    return IQuizAttemptGradedRead(
        time_start=quiz_attempt.time_start,
        total_points=quiz_attempt.total_points,
        time_finish=quiz_attempt.time_finish,
        time_limit=quiz_attempt.time_limit,
        attempt_score=quiz_attempt.attempt_score,
        attempt_id=quiz_attempt.id,
        quiz_id=quiz_attempt.quiz_id,
        attempted_questions=attempted_questions
    )