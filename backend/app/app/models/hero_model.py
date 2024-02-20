from sqlmodel import Field, SQLModel
from app.models.base_uuid_model import BaseUUIDModel


class HeroBase(SQLModel):
    name: str = Field(index=True)
    secret_name: str
    age: int | None = Field(default=None, index=True)


class Hero(BaseUUIDModel, HeroBase, table=True):
    pass
