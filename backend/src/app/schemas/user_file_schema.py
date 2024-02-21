from app.models.user_file_modal import UserFileBase
from uuid import UUID
from pydantic import field_validator
from sqlmodel import SQLModel
from datetime import datetime

class IUserFileCreate(UserFileBase):
    pass

class IUserFileRead(UserFileBase):
    id: UUID
    created_at: datetime

class IPaginatedUserFileList(SQLModel):
    data: list[IUserFileRead]
    total: int
    page: int
    size: int
    total_pages: int

class IUserFileRemove(SQLModel):
    id: UUID
    file_name: str
    deleted: bool