from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Annotated
from uuid import UUID
from datetime import timedelta

from app import crud
from app.api.deps import get_db
from app.core.auth import clerk_auth
from app.schemas.question_engine_schema import IBatchQuestionsCreate
from app.schemas.quiz_engine_schema import (IQuizCreate, IQuizUpdate, IQuizRead, IPaginatedQuizList, IGenerateQuiz, IQuizRemove)

# Mock Data
from app.utils.mock.generated_questions import mock_generated_questions

router = APIRouter()


@router.get("", response_model=IPaginatedQuizList)
async def get_quiz_list(
    user_id: Annotated[str, Depends(clerk_auth.get_session_details)],
    db_session: Annotated[AsyncSession, Depends(get_db)], 
    skip: int = Query(default=0, le=100), 
    limit: int = Query(default=8, le=10)
    ):
    """
    Gets a paginated list of quizzes for a user
    """
    try:
        quizzes_list = await crud.quiz_engine.get_user_quizzes_list(user_id=user_id, db_session=db_session, offset=skip, limit=limit)
        
        count_quiz: int = await crud.quiz_engine.get_count_of_quizzes_for_user(user_id=user_id, db_session=db_session)

        to_skip = skip + limit if count_quiz > skip + limit else None
        # Create IPaginatedUserFileList
        paginated_response = IPaginatedQuizList(
            total=count_quiz,
            data=quizzes_list,
            next_page=f"/api/v1/quiz?skip={to_skip}&limit={limit}" if to_skip else "",
            prev_page=f"/api/v1/quiz?skip={skip - limit}&limit={limit}" if skip > 0 else ""
        )

        return paginated_response
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{quiz_id}", response_model=IQuizRead)
async def get_quiz_by_id(
    user_id: Annotated[str, Depends(clerk_auth.get_session_details)],
    quiz_id: UUID, 
    db_session: Annotated[AsyncSession, Depends(get_db)]):
    """
    Gets a quiz by its id
    """
    try:
        quiz_retrieved = await crud.quiz_engine.get_quiz_by_id(user_id=user_id, quiz_id=quiz_id, db_session=db_session)
        return quiz_retrieved
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @router.post("/create", response_model=IQuizRead)
async def create_quiz(
        user_id: Annotated[str, Depends(clerk_auth.get_session_details)],
        quiz_in: IQuizCreate,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Creates a new Quiz and add Questions to it

    We will use this API to create a Custom Action in ChatGPT interface when creating out CustomGPT
    """
    try:
        quiz_created = await crud.quiz_engine.create_quiz(quiz_obj=quiz_in, db_session=db_session)
        return quiz_created
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @router.patch("/{quiz_id}", response_model=IQuizRead)
async def update_quiz(
        user_id: Annotated[str, Depends(clerk_auth.get_session_details)],
        quiz_id: UUID,
        quiz: IQuizUpdate,
        db_session: Annotated[AsyncSession, Depends(get_db)],
):
    """
    Updates a quiz title or duration by its id
    """
    try:
        quiz_updated = await crud.quiz_engine.update_quiz(user_id=user_id, quiz_id=quiz_id, quiz_obj=quiz, db_session=db_session)
        return quiz_updated
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{quiz_id}", response_model=IQuizRemove)
async def remove_quiz(    
    quiz_id: UUID, 
    user_id: Annotated[str, Depends(clerk_auth.get_session_details)], 
    db_session: Annotated[AsyncSession, Depends(get_db)]):
    """
    Deletes a quiz by its id
    """
    try:
        quiz_deleted = await crud.quiz_engine.delete_quiz(user_id=user_id, quiz_id=quiz_id, db_session=db_session)
        return quiz_deleted
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate", response_model=IQuizRead)
async def generate_quiz_rag_ai_pipeline(
        user_id: Annotated[str, Depends(clerk_auth.get_session_details)],
        generate_quiz_data: IGenerateQuiz,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Generate Quiz from NextJS - GUI

    Wrapper API That used RAG Pipeline to Generate Quiz Questions and calls create_quiz
    """
    try:
        # 0. Create Quiz in DB to get quiz_id
        quiz_obj = IQuizCreate(title=generate_quiz_data.title, user_id=user_id, time_limit=generate_quiz_data.time_limit, user_file_ids=generate_quiz_data.file_ids)
        quiz_in_db = await crud.quiz_engine.create_quiz(quiz_obj=quiz_obj, db_session=db_session)

        # TODO: 1. RAG & AI PIPELINES
        
        # 1.1 RAG PIPELINE TO GET QUESTIONS CONTENT
        #      -> Take user Prompt and get prep the RAG query Structure - call OpenAI if needed
        #      -> Get the Questions Content using selected file_ids & Query Structure

        # 1.2 AI PIPELINE TO GENERATE QUESTIONS
        #      -> Take the Questions Content and Generate the Questions using OpenAI Assistant or Completions API
                    # -> In GPT prompt we will get time_limit for each question to calculate total quiz_time_limit
        generated_questions = mock_generated_questions

        # 2. Add Questions to Quiz
        # 2.1 Sanitize and add Questions in Database
        
        # - add quiz_id & user_id to each question
        for question in generated_questions:
            question["quiz_id"] = quiz_in_db.id
            question["user_id"] = quiz_in_db.user_id

        # - sanitize and add questions to database
        sanitized_questions_in = IBatchQuestionsCreate(questions=generated_questions)
        await crud.question_engine.create_questions_batch(questions_in=sanitized_questions_in, db_session=db_session)

        # - count questions_added, total_points, and time_limit (if returned from GPT)
        count_questions_added = len(generated_questions)
        total_points = sum([question["points"] for question in generated_questions])
        
        time_limit_in_minutes = sum([question["time_limit"] for question in generated_questions])
        # Convert total minutes into a timedelta object
        time_limit = timedelta(minutes=time_limit_in_minutes)

        # 3. Update Quiz Fields and return it
        quiz_update_obj = IQuizUpdate(total_questions_count=count_questions_added, total_points=total_points, time_limit=time_limit)
        quiz_updated = await crud.quiz_engine.update_quiz(user_id=user_id, quiz_id=quiz_in_db.id, quiz_obj=quiz_update_obj, db_session=db_session)
        return quiz_updated

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
