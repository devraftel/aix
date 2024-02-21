from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile
from typing import Annotated
from sqlmodel.ext.asyncio.session import AsyncSession

from app import crud
from app.api.deps import get_db
from app.schemas.user_file_schema import (
    IUserFileRead, IPaginatedUserFileList, IUserFileRemove)

router = APIRouter()

@router.post("/{user_id}", response_model=IUserFileRead)
async def create_user_file_batch_rag(
        user_id: str,
        file: UploadFile,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Add File Metadata to UserTable & Batch, Embed and save File Content to RAG
    """
    try:
        print("user_id", user_id)
        print("file", file)
        # File Size, Name, Bytes
        print("file.filename", file.filename)
        print("file.content_type", file.content_type)

        # https://fastapi.tiangolo.com/tutorial/request-files/
        print("file.file", file.file)

        # TODO: 1. Save File Metadata to UserTable
        # TODO: 2. Save File Content to Pinecone using RAG Pipeline
        # TODO: 3. Update Table to store total FileBytes to DB IF POSSIBLE (Optional)
        pass
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# List all Files of a user
@router.get("/{user_id}", response_model=IPaginatedUserFileList)
async def list_user_files(
        user_id: str,
        db_session: Annotated[AsyncSession, Depends(get_db)],
        page: int = Query(1, ge=1),
        size: int = Query(10, le=100),
):
    """
    List all Files of a user
    """
    try:
        print("user_id", user_id)
        print("page", page)
        print("size", size)

        pass
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Retrive a file metadata by its id
@router.get("/{user_id}/{file_id}", response_model=IUserFileRead)
async def read_user_file_metadata(
        user_id: str,
        file_id: UUID,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Retrive a file metadata by its id
    """
    try:
        print("user_id", user_id)
        print("file_id", file_id)

        pass
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Delete a file by its id
@router.delete("/{user_id}/{file_id}", response_model=IUserFileRemove)
async def delete_user_file(
        user_id: str,
        file_id: UUID,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Delete a file by its id
    """
    try:
        print("user_id", user_id)
        print("file_id", file_id)

        return {"id": "file-abc123", "file_name": "file_name.pdf", "deleted": True}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# TODO: An Endpoint to Retrive File Content by its id
