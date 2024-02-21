from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Annotated
from sqlmodel.ext.asyncio.session import AsyncSession

from app import crud
from app.api.deps import get_db
from app.schemas.quiz_engine_schema import (
    IQuizCreate, IQuizUpdate, IQuizRead, IPaginatedQuizList, IGenerateQuiz, IQuizRemove)

router = APIRouter()


@router.get("", response_model=IPaginatedQuizList)
async def get_quiz_list(user_id: str, # TODO: Dependency Injection to validate USER and get user_id
                        db_session: Annotated[AsyncSession, Depends(get_db)], 
                        skip: int = Query(default=0, le=100), 
                        limit: int = Query(default=8, le=10)):
    """
    Gets a paginated list of quizzes for a user
    """
    try:
        quizzes_list = await crud.quiz_engine.get_user_quizzes_list(user_id=user_id, db_session=db_session, offset=skip, limit=limit)
        
        count_quiz: int = await crud.quiz_engine.get_count_of_quizzes_for_user(user_id=user_id, db_session=db_session)

        # Create IPaginatedUserFileList
        paginated_response = IPaginatedQuizList(
            total=count_quiz,
            data=quizzes_list,
            next_page=skip+limit if skip+limit < int(count_quiz) else None,
            prev_page=skip-limit if skip-limit >= 0 else None
        )

        return paginated_response
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get_by_id/{quiz_id}", response_model=IQuizRead)
async def get_quiz_by_id(user_id: str, quiz_id: UUID, db_session: Annotated[AsyncSession, Depends(get_db)]):
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


@router.post("/create", response_model=IQuizRead)
async def create_quiz(
        quiz: IQuizCreate,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Creates a new Quiz

    We will use this API to create a Custom Action in ChatGPT interface when creating out CustomGPT
    """
    try:
        quiz_created = await crud.quiz_engine.create_quiz(quiz_obj=quiz, db_session=db_session)
        return quiz_created
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{quiz_id}", response_model=IQuizRead)
async def update_quiz(
        user_id: str,
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
async def remove_quiz(user_id: str, quiz_id: UUID, db_session: Annotated[AsyncSession, Depends(get_db)]):
    """
    Deletes a quiz by its id
    """
    try:
        quiz_deleted = await crud.quiz_engine.delete_quiz(quiz_id=quiz_id, db_session=db_session)
        return quiz_deleted
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# TODO: Endpoint to Generate QuizQuestions & Create Quiz using RAG Pipeline
@router.post("/generate", response_model=IQuizRead)
async def generate_quiz_rag_ai_pipeline(
        generate_quiz_data: IGenerateQuiz,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Generate Quiz from NextJS - GUI

    Wrapper API That used RAG Pipeline to Generate Quiz Questions and calls create_quiz
    """
    try:
        # 1. Take user Prompt and get prep the RAG query Structure - call OpenAI if needed
        # 2. using selected file_ids & Query Structure, Call RAG Pipeline to get the Content

        #  --- AI Pipelines

        # 3. Strucutre Prompt & call OpenAI to Generate the Questions
        # 4. Create Quiz using the Questions - Store Questions, Answers for MCQs etc.

        # Return Quiz Created Basic Data (Fields in Quiz table only)

        pass
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
