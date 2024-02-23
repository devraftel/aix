from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from typing import Annotated
from sqlmodel.ext.asyncio.session import AsyncSession
from datetime import datetime

from app import crud
from app.api.deps import get_db
from app.core.auth import clerk_auth
from app.schemas.quiz_attempt_schema import (IQuizAttemptCreate, IQuizAttemptUpdate, IQuizAttemptRead, IQuizAttemptCreateResponse,
                                             IQuizAnswerSlotCreate, IQuizAnswerSlotUpdate, IQuizAnswerSlotRead)

router = APIRouter()
@router.post("/create/{quiz_id}", response_model=IQuizAttemptCreateResponse)
async def create_quiz_attempt(
        user_id: Annotated[str, Depends(clerk_auth.get_session_details)],
        quiz_id: UUID,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Create Entry in Quiz Attempt and Return Questions to Start Quiz
    """
    try:
        # 1. Validate Quiz ID
        quiz = await crud.quiz_engine.get_quiz_by_id(db_session=db_session, quiz_id=quiz_id, user_id=user_id)
        if not quiz:
            raise ValueError("Invalid Quiz ID")
        
        # Check if creator has already attempted quiz has_user_attempted
        if quiz.has_user_attempted:
            raise ValueError("You have already attempted this quiz")
                
        # #2. Create Quiz Attempt
        quiz_attempt_response = await crud.quiz_attempt.create_quiz_attempt(db_session=db_session, quiz_attempt=IQuizAttemptCreate(user_id=user_id, quiz_id=quiz_id, time_limit=quiz.time_limit, total_points=quiz.total_points, time_start=datetime.now()))

        # #3. Get Questions for the Quiz
        quiz_questions = await crud.question_engine.get_all_questions_for_quiz(db_session=db_session, quiz_id=quiz.id)

        # Mark the quiz as attempted
        quiz.has_user_attempted = True
        await db_session.commit()

        # prep the response IQuizAttemptCreateResponse
        quiz_attempt_response = IQuizAttemptCreateResponse(id=quiz_attempt_response.id, user_id=quiz_attempt_response.user_id, quiz_id=quiz_attempt_response.quiz_id, time_limit=quiz_attempt_response.time_limit, time_start=quiz_attempt_response.time_start, total_points=quiz_attempt_response.total_points, questions=quiz_questions)
        return quiz_attempt_response

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# ~ Get Quiz Attempt By ID
@router.get("/{quiz_attempt_id}", response_model=IQuizAttemptRead)
async def get_quiz_attempt_by_id(        
    user_id: Annotated[str, Depends(clerk_auth.get_session_details)],
    quiz_attempt_id: UUID, 
    db_session: Annotated[AsyncSession, Depends(get_db)]):
    """
    Gets a Quiz Attempt by its id
    """
    try:
        
        is_active = await crud.quiz_attempt.is_quiz_attempt_active(db_session, quiz_attempt_id)
        print ("\n------------ is_active ------------\n", is_active)

        quiz_attempt = await crud.quiz_attempt.get_quiz_attempt_by_id(db_session, quiz_attempt_id)
        return quiz_attempt

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ~ Update Quiz Attempt - Finish Quiz
@router.patch("/{quiz_attempt_id}/finish")
async def update_quiz_attempt(
        user_id: Annotated[str, Depends(clerk_auth.get_session_details)],
        quiz_attempt_id: UUID,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Update Quiz Attempt
    """
    try:
        quiz_attempt_response = await crud.quiz_attempt.finish_quiz_attempt(db_session, quiz_attempt_id)
        return quiz_attempt_response

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# ---------------------
# QuizAnswerSlot
# ---------------------

@router.post("/answer_slot/save", response_model=IQuizAnswerSlotRead)
async def save_quiz_answer_slot(
        user_id: Annotated[str, Depends(clerk_auth.get_session_details)],
        background_tasks: BackgroundTasks,
        quiz_answer_slot: IQuizAnswerSlotCreate,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Saves a student attempted Quiz Answer Slot
    """
    try:
        # 1. ValidateIf Quiz is Active & Quiz Attempt ID is Valid
        quiz_attempt = await crud.quiz_attempt.is_quiz_attempt_active(db_session, quiz_answer_slot.quiz_attempt_id)
        if not quiz_attempt:
            raise ValueError("Quiz Time has Ended or Invalid Quiz Attempt ID")

        #2. Save Quiz Answer Slot
        quiz_answer_slot_response = await crud.quiz_answer_slot.create_quiz_answer_slot(db_session, quiz_answer_slot)

        # 2.1 RUN A BACKGROUND TASK TO UPDATE THE POINTS AWARDED
        background_tasks.add_task(crud.quiz_answer_slot.grade_quiz_answer_slot, db_session, quiz_answer_slot_response)

        #3. Return Quiz Answer Slot
        return quiz_answer_slot_response


    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
