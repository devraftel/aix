from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile
from typing import Annotated
from sqlmodel.ext.asyncio.session import AsyncSession

from app import crud
from app.api.deps import get_db
from app.schemas.question_engine_schema import (IQuestionCreate, IQuestionRead, IBatchQuestionsCreate )


router = APIRouter()

@router.post("/create-questions-batch/", response_model=list[IQuestionRead])
async def create_questions_batch(
    questions_in: IBatchQuestionsCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a batch of questions
    """

    questions = await crud.question_engine.create_questions_batch(db_session=db, questions_in=questions_in)
    return questions


@router.post("/create-question/", response_model=IQuestionRead)
async def create_question(
    question_in: IQuestionCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new question
    """
    print("\n---\nquestion_in:", question_in, "\n---\n")
    question = await crud.question_engine.create_question(db_session=db, question_in=question_in)
    return question

@router.get("/get-question/{question_id}", response_model=IQuestionRead)
async def get_question(
    question_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Get a question by ID
    """
    question = await crud.question_engine.get_question_by_id(db_session=db, question_id=question_id)
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.get("/get-questions-for-quiz/{quiz_id}", response_model=list[IQuestionRead])
async def get_questions_for_quiz(
    quiz_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Get all questions for a quiz
    """
    questions = await crud.question_engine.get_all_questions_for_quiz(db_session=db, quiz_id=quiz_id)
    return questions

@router.get("/get-single-question-for-quiz/{quiz_id}/{question_id}", response_model=IQuestionRead)
async def get_single_question_for_quiz(
    quiz_id: UUID,
    question_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Get a single question for a quiz
    """
    question = await crud.question_engine.get_single_question_for_quiz(db_session=db, quiz_id=quiz_id, question_id=question_id)
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

# Count of questions for a quiz
@router.get("/get-count-of-questions-for-quiz/{quiz_id}")
async def get_count_of_questions_for_quiz(
    quiz_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Count of questions for a quiz
    """
    count = await crud.question_engine.get_count_of_questions_for_quiz(db_session=db, quiz_id=quiz_id)
    return count