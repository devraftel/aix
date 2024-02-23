from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile
from sqlmodel.ext.asyncio.session import AsyncSession
from uuid import UUID
from typing import Annotated

from app import crud
from app.api.deps import get_db
from app.schemas.user_file_schema import (IUserFileRead, IPaginatedUserFileList, IUserFileRemove)
from app.models.user_file_modal import UserFile
from app.core.auth import clerk_auth

router = APIRouter()

# List all Files of a user
@router.get("", response_model=IPaginatedUserFileList)
async def list_user_files(
        user_id: Annotated[str, Depends(clerk_auth.get_session_details)],
        db_session: Annotated[AsyncSession, Depends(get_db)],
        skip: int = Query(default=0, le=100),
        limit: int = Query(default=50, le=100)
):
    """
    List all Files of a user
    """
    try:
        print("\n----------user_id----------\n", user_id)
        files_list = await crud.user_file.get_user_files_list(user_id=user_id, db_session=db_session, offset=skip, limit=limit)

        count_files: int = await crud.user_file.get_count_of_files_for_user(user_id=user_id, db_session=db_session)

        to_skip = skip + limit if count_files > skip + limit else None
        # Create IPaginatedUserFileList
        paginated_response = IPaginatedUserFileList(
            total=count_files,
            data=files_list,
            next_page=f"/api/v1/user_file?skip={to_skip}&limit={limit}" if to_skip else "",
            prev_page=f"/api/v1/user_file?skip={skip - limit}&limit={limit}" if skip > 0 else ""
        )

        return paginated_response

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", response_model=IUserFileRead)
async def create_user_file_batch_rag(
        user_id: Annotated[str, Depends(clerk_auth.get_session_details)],
        file: UploadFile,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Add File Metadata to UserTable & Batch, Embed and save File Content to RAG
    """
    try:
        # print("\n----------file_obj----------\n", file)
        # print("\n----------filename----------\n", file.filename)
        # print("\n----------content_type----------\n", file.content_type)

        # 1. Save File Metadata to UserTable
        file_obj_sanitized = UserFile(user_id=user_id, file_name=file.filename)
        print("\n----------file_obj_sanitized----------\n", file_obj_sanitized)

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


@router.get("/{file_id}", response_model=IUserFileRead)
async def read_user_file_metadata(
        user_id: Annotated[str, Depends(clerk_auth.get_session_details)],
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


@router.delete("/{file_id}", response_model=IUserFileRemove)
async def delete_user_file(
        user_id: Annotated[str, Depends(clerk_auth.get_session_details)],
        file_id: UUID,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Delete a file by its id
    """
    try:
        file_deleted = await crud.user_file.delete_file(file_id=file_id, db_session=db_session, user_id=user_id)
        return file_deleted
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @router.post("/file_ids/read", response_model=list[IUserFileRead])
async def read_user_files_metadata(
        file_ids: list[UUID],
        user_id: Annotated[str, Depends(clerk_auth.get_session_details)],
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Retrieve a list of file metadata by their ids
    """
    try:
        files_retrieved = await crud.user_file.get_file_ids_data(file_ids=file_ids, user_id=user_id, db_session=db_session)
        return files_retrieved
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# TODO: After all AI Pipelines - An Endpoint to Retrieve File Content by its id
