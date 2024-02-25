from uuid import UUID
from sqlmodel import Field
from app.models.base_uuid_model import SQLModel

# https://sqlmodel.tiangolo.com/tutorial/many-to-many/create-models-with-link/

class LinkQuizFile(SQLModel, table=True):
    quiz_id: UUID | None = Field(index=True, default=None, primary_key=True, foreign_key="Quiz.id")
    user_file_id: UUID = Field(index=True, default=None, primary_key=True, foreign_key="UserFile.id")