from sqlmodel import Field, SQLModel, Relationship
from app.models.base_uuid_model import BaseUUIDModel
from app.models.link_model import LinkQuizFile


class UserFileBase(SQLModel):
    user_id: str = Field(index=True)
    file_url: str

class UserFile(BaseUUIDModel, UserFileBase, table=True):
    quizzes: list["app.models.quiz_model.Quiz"] = Relationship(
        back_populates="user_files",
        link_model=LinkQuizFile
    )

