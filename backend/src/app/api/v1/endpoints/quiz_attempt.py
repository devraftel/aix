from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Annotated
from sqlmodel.ext.asyncio.session import AsyncSession

from app import crud
from app.api.deps import get_db
from app.schemas.quiz_attempt_schema import (IQuizAttemptCreate, IQuizAttemptUpdate, IQuizAttemptRead, IQuizAttemptCreateResponse,
                                             IQuizAnswerSlotCreate, IQuizAnswerSlotUpdate, IQuizAnswerSlotRead)

router = APIRouter()

# TODO CRUD When Student Attempts a Quiz

# ~ Create Entry in Quiz Attempt and Return Questions to Start Quiz
@router.post("/create", response_model=IQuizAttemptCreateResponse)
async def create_quiz_attempt(
        quiz_attempt: IQuizAttemptCreate,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Creates a new Quiz Attempt
    """
    try:
        # 1. Validate Quiz ID
        # quiz = await crud.quiz.get(db_session, quiz_attempt.quiz_id)
        # if not quiz:
        #     raise ValueError("Invalid Quiz ID")
        
        # #2. Create Quiz Attempt
        # quiz_attempt_response = await crud.quiz_attempt.create(db_session, quiz_attempt)

        # #3. Get Questions for the Quiz
        # questions = await crud.quiz.get_quiz_questions(db_session, quiz_attempt.quiz_id)

        #4. Return Quiz Attempt and Questions {quiz_id, user_id, time_limit, questions}
        pass


    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# ~ Update Quiz Attempt
@router.patch("/{quiz_attempt_id}", response_model=IQuizAttemptRead)
async def update_quiz_attempt(
        quiz_attempt_id: UUID,
        quiz_attempt: IQuizAttemptUpdate,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Updates a Quiz Attempt
    """
    try:
        # 1. Validate Quiz Attempt ID
        # quiz_attempt_db = await crud.quiz_attempt.get(db_session, quiz_attempt_id)
        # if not quiz_attempt_db:
        #     raise ValueError("Invalid Quiz Attempt ID")

        # #2. Update Quiz Attempt
        # quiz_attempt_response = await crud.quiz_attempt.update(db_session, quiz_attempt_id, quiz_attempt)

        #3. Return Quiz Attempt
        pass

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ~ Get Quiz Attempt By ID
@router.get("/{quiz_attempt_id}", response_model=IQuizAttemptRead)
async def get_quiz_attempt_by_id(quiz_attempt_id: UUID, db_session: Annotated[AsyncSession, Depends(get_db)]):
    """
    Gets a Quiz Attempt by its id
    """
    try:
        # quiz_attempt = await crud.quiz_attempt.get(db_session, quiz_attempt_id)
        # if not quiz_attempt:
        #     raise ValueError("Invalid Quiz Attempt ID")
        # Extend Query to return Quiz Data, Quiz Attempt, Quiz Answer Slots & Feedback
        pass

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------
# QuizAnswerSlot
# ---------------------

@router.post("/answer_slot/save", response_model=IQuizAnswerSlotRead)
async def save_quiz_answer_slot(
        quiz_answer_slot: IQuizAnswerSlotCreate,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Saves a student attempted Quiz Answer Slot
    """
    try:
        # 1. Validate Quiz Attempt ID
        # quiz_attempt = await crud.quiz_attempt.get(db_session, quiz_answer_slot.quiz_attempt_id)
        # if not quiz_attempt:
        #     raise ValueError("Invalid Quiz Attempt ID")

        # #2. Save Quiz Answer Slot
        # quiz_answer_slot_response = await crud.quiz_answer_slot.create(db_session, quiz_answer_slot)

        #3. Return Quiz Answer Slot
        pass

        # 4. RUN A BACKGROUND TASK TO UPDATE THE POINTS AWARDED

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.patch("/answer_slot/{quiz_answer_slot_id}", response_model=IQuizAnswerSlotRead)
async def update_quiz_answer_slot(
        quiz_answer_slot_id: UUID,
        quiz_answer_slot: IQuizAnswerSlotUpdate,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Updates a student attempted Quiz Answer Slot
    """
    try:
        # 1. Validate Quiz Answer Slot ID
        # quiz_answer_slot_db = await crud.quiz_answer_slot.get(db_session, quiz_answer_slot_id)
        # if not quiz_answer_slot_db:
        #     raise ValueError("Invalid Quiz Answer Slot ID")

        # #2. Update Quiz Answer Slot
        # quiz_answer_slot_response = await crud.quiz_answer_slot.update(db_session, quiz_answer_slot_id, quiz_answer_slot)

        #3. Return Quiz Answer Slot
        pass

        # 4. RUN A BACKGROUND TASK TO UPDATE THE POINTS AWARDED

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))