from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile
from typing import Annotated
from sqlmodel.ext.asyncio.session import AsyncSession

from app import crud
from app.api.deps import get_db
from app.schemas.user_file_schema import (IUserFileRead, IPaginatedUserFileList, IUserFileRemove)
from app.models.user_file_modal import UserFile


router = APIRouter()

# List all Files of a user
@router.get("", response_model=IPaginatedUserFileList)
async def list_user_files(
        user_id: str, # TODO: Dependency Injection to validate USER and get user_id
        db_session: Annotated[AsyncSession, Depends(get_db)],
        skip: int= Query(default=0, le=100), 
        limit: int = Query(default=8, le=10)
):
    """
    List all Files of a user
    """
    try:
        files_list = await crud.user_file.get_user_files_list(user_id=user_id, db_session=db_session, offset=skip, limit=limit)
        
        count_files: int = await crud.user_file.get_count_of_files_for_user(user_id=user_id, db_session=db_session)

        # Create IPaginatedUserFileList
        paginated_response = IPaginatedUserFileList(
            total=count_files,
            data=files_list,
            next_page=skip+limit if skip+limit < int(count_files) else None,
            prev_page=skip-limit if skip-limit >= 0 else None
        )

        return paginated_response
    
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/{user_id}", response_model=IUserFileRead)
async def create_user_file_batch_rag(
        user_id: str, # TODO: Dependency Injection to validate USER and get user_id
        file: UploadFile,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Add File Metadata to UserTable & Batch, Embed and save File Content to RAG
    """
    try:
        print("\n----------file_obj----------\n", file)
        print("\n----------filename----------\n", file.filename)
        print("\n----------content_type----------\n", file.content_type)
        print("\n----------file----------\n", file.file)
        
        # 1. Save File Metadata to UserTable
        file_obj_sanitized = UserFile(user_id = user_id, file_name = file.filename)
        file_in_db = await crud.user_file.create_user_file(file_obj=file_obj_sanitized, db_session=db_session)

        print("\n----------file_in_db----------\n", file_in_db)

        # TODO: 2. Save File Content to Pinecone using RAG Pipeline
        # https://fastapi.tiangolo.com/tutorial/request-files/
        # Use await to get the file i.e file.METHODCALLED()

        # 3. Update Table to store total FileBytes to DB IF POSSIBLE (Optional)
        # updated_file= await crud.user_file.update_file_content_size(file_id=file_in_db.id, byte_size=10, db_session=db_session)
        # return updated_file


        return file_in_db
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/{user_id}/{file_id}", response_model=IUserFileRead)
async def read_user_file_metadata(
        user_id: str, # TODO: Dependency Injection to validate USER and get user_id
        file_id: UUID,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Retrieve a file metadata by its id
    """
    try:
        file_retrieved = await crud.user_file.get_file_by_id(user_id=user_id, file_id=file_id, db_session=db_session)
        return file_retrieved
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Delete a file by its id
@router.delete("/{user_id}/{file_id}", response_model=IUserFileRemove)
async def delete_user_file(
        user_id: str, # TODO: Dependency Injection to validate USER and get user_id
        file_id: UUID,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Delete a file by its id
    """
    try:
        file_deleted = await crud.user_file.delete_file(file_id=file_id, db_session=db_session)
        return file_deleted
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# TODO: After all AI Pipelines - An Endpoint to Retrieve File Content by its id
