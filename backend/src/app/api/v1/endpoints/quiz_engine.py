from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Annotated
from sqlmodel.ext.asyncio.session import AsyncSession

from app import crud
from app.api.deps import get_db
from app.schemas.quiz_engine_schema import (IQuizCreate, IQuizUpdate, IQuizRead, IPaginatedQuizList, IGenerateQuiz)

router = APIRouter()

@router.get("", response_model=IPaginatedQuizList)
async def get_quiz_list(user_id: str, db_session: Annotated[AsyncSession, Depends(get_db)], skip: int= Query(default=0, le=100), limit: int = Query(default=8, le=10)):
    """
    Gets a paginated list of quizzes for a user
    """
    try:
        pass
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get_by_id/{quiz_id}", response_model=IQuizRead)
async def get_quiz_by_id(quiz_id: UUID, db_session: Annotated[AsyncSession, Depends(get_db)]):
    """
    Gets a quiz by its id
    """
    try:
        pass
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
        pass
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
    Updates a quiz by its id
    """
    try:
        pass
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{quiz_id}")
async def remove_quiz(user_id:str, quiz_id: UUID, db_session: Annotated[AsyncSession, Depends(get_db)]):
    """
    Deletes a quiz by its id
    """
    try:
        pass
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