from app.utils.uuid6 import uuid7
from pydantic import BaseModel, field_validator
from enum import Enum

# Random Sample Models
class TokenType(str, Enum):
    ACCESS = "access_token"
    REFRESH = "refresh_token"

class IChatResponse(BaseModel):
    """Chat response schema."""

    id: str
    message_id: str
    sender: str
    message: str
    type: str

    @field_validator("id", "message_id")
    def check_ids(cls, v):
        if v == "" or v is None:
            return str(uuid7())
        return v

    @field_validator("sender")
    def sender_must_be_bot_or_you(cls, v):
        if v not in ["bot", "you"]:
            raise ValueError("sender must be bot or you")
        return v

    @field_validator("type")
    def validate_message_type(cls, v):
        if v not in ["start", "stream", "end", "error", "info"]:
            raise ValueError("type must be start, stream or end")
        return v
