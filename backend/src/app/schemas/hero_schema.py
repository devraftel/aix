from app.models.hero_model import HeroBase
from uuid import UUID
from pydantic import field_validator
from sqlmodel import SQLModel


class IHeroCreate(HeroBase):
    @field_validator('age')
    def check_age(cls, value):
        if value < 0:
            raise ValueError("Invalid age")
        return value


# All these fields are optional
class IHeroUpdate(SQLModel):
    name: str | None = None
    secret_name: str| None = None
    age: int | None = None


class IHeroRead(HeroBase):
    id: UUID
