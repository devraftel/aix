from sqlmodel import Field, SQLModel, Relationship
from app.models.base_uuid_model import BaseUUIDModel
from app.models.link_model import LinkQuizFile


class UserFileBase(SQLModel):
    user_id: str = Field(index=True)
    file_name: str | None = None
    purpose: str = Field(default="quiz-questions")

class UserFile(BaseUUIDModel, UserFileBase, table=True):
    bytes: int | None = Field(default=None)
    quizzes: list["app.models.quiz_engine_model.Quiz"] = Relationship(
        back_populates="user_files",
        link_model=LinkQuizFile
    )