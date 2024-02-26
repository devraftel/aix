from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from typing import Annotated
from sqlmodel.ext.asyncio.session import AsyncSession
from datetime import datetime

from app import crud
from app.api.deps import get_db
from app.core.auth import clerk_auth
from app.schemas.quiz_attempt_schema import (IQuizAttemptCreate, IQuizAttemptRead, IQuizAttemptCreateResponse,
                                             IQuizAnswerSlotCreate, IQuizAnswerSlotRead, IQuizAttemptGradedRead, transform_quiz_attempt)

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
        quiz_attempt_response = IQuizAttemptCreateResponse(id=quiz_attempt_response.id, user_id=quiz_attempt_response.user_id, quiz_title=quiz.title, quiz_id=quiz_attempt_response.quiz_id, time_limit=quiz_attempt_response.time_limit, time_start=quiz_attempt_response.time_start, total_points=quiz_attempt_response.total_points, questions=quiz_questions)
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
    
# API to view graded Quiz + feedback of each question, selected and correct answers
@router.get("/{quiz_attempt_id}/graded", response_model=IQuizAttemptGradedRead)
async def get_graded_quiz_attempt_by_id(        
    # user_id: Annotated[str, Depends(clerk_auth.get_session_details)],
    quiz_attempt_id: UUID, 
    db_session: Annotated[AsyncSession, Depends(get_db)]):
    """
    Gets a Graded Quiz Attempt by its id
    """
    try:
        quiz_attempt = await crud.quiz_attempt.graded_quiz_attempt_by_id(db_session, quiz_attempt_id)

        if not quiz_attempt:
            raise ValueError("Invalid Quiz Attempt ID")
        
        if not quiz_attempt.time_finish:
            raise ValueError("Quiz Attempt is not finished yet")
        
        if quiz_attempt.time_finish:
            raise ValueError("Quiz Attempt is still active")

        # print("\n------------ quiz_attempt ------------\n\n", quiz_attempt)
        # print("\n quiz_attempt.quiz_answers \n", quiz_attempt.quiz_answers)

        # print("\n------------ .quiz_answers.quiz_question_feedback ------------\n")
        # for answer in quiz_attempt.quiz_answers:
        #     print(answer.quiz_question_feedback)

        # print("\n------------ .quiz_answers.selected_options ------------\n")
        # for answer in quiz_attempt.quiz_answers:
        #     for selected_option in answer.selected_options:
        #         print(selected_option)

        # # Correctly iterating over quiz_answers to access each QuizAnswerSlot's related question
        # print("\n------------ .quiz_answers.question ------------\n")
        # for answer_slot in quiz_attempt.quiz_answers:
        #     print(answer_slot.question)  

        # print("\n------------ .quiz_answers.question.mcq_options ------------\n")
        # for answer_slot in quiz_attempt.quiz_answers:
        #     if hasattr(answer_slot, 'question') and answer_slot.question:  # Check if 'question' is loaded and not None
        #         print(answer_slot.question.mcq_options)  #'mcq_options' is an attribute or related object of 'question'

        quiz_attempt_data = transform_quiz_attempt(quiz_attempt)
        return quiz_attempt_data


    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
#Get Quiz Attempt Based on User ID and Quiz ID
@router.get("/user/{quiz_id}", response_model=IQuizAttemptGradedRead) 
async def get_quiz_attempt_grade_by_user_and_quiz_id(
    user_id: Annotated[str, Depends(clerk_auth.get_session_details)],
    quiz_id: UUID,
    db_session: Annotated[AsyncSession, Depends(get_db)]
):
    try:
        quiz_attempt_id =  await crud.quiz_attempt.get_quiz_attempt_by_user_id_and_quiz_id(user_id=user_id, quiz_id=quiz_id, db_session=db_session)
        print("\n------------ quiz_attempt ------------\n\n", quiz_attempt_id)
        
        graded_quiz_attempt = await crud.quiz_attempt.graded_quiz_attempt_by_id(db_session, quiz_attempt_id=quiz_attempt_id)

        if not graded_quiz_attempt:
            raise ValueError("Invalid Quiz Attempt ID")
        
        if not graded_quiz_attempt.time_finish:
            raise ValueError("Quiz Attempt is not finished yet")
        
        quiz_attempt_data = transform_quiz_attempt(graded_quiz_attempt)
        
        return quiz_attempt_data

    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

