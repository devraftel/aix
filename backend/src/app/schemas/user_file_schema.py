from app.models.user_file_modal import UserFileBase
from uuid import UUID
from pydantic import field_validator
from sqlmodel import SQLModel
from datetime import datetime
from typing import Any
from pydantic import validator

class IUserFileCreate(UserFileBase):
    pass

class IUserFileRead(UserFileBase):
    id: UUID
    created_at: datetime
  

class IPaginatedUserFileList(SQLModel):
    total: int
    next_page: str | None
    prev_page: str | None

    data: list[IUserFileRead]


class IUserFileRemove(SQLModel):
    id: UUID
    file_name: str
    deleted: bool