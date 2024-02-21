from uuid import UUID
from sqlmodel import Field, SQLModel
from app.models.base_uuid_model import BaseUUIDModel
from datetime import datetime, timedelta


class QuizBase(SQLModel):
    title: str = Field(index=True)
    creator_id: UUID
    time_limit: timedelta | None = Field(default=None)


class Quiz(BaseUUIDModel, QuizBase, table=True):
    pass
