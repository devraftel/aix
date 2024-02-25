import os
from pydantic_core.core_schema import FieldValidationInfo
from pydantic import AnyHttpUrl, field_validator, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Any
from enum import Enum


class ModeEnum(str, Enum):
    development = "development"
    production = "production"
    testing = "testing"


class Settings(BaseSettings):
    MODE: ModeEnum = ModeEnum.development
    API_VERSION: str = "v1"
    API_V1_STR: str = f"/api/{API_VERSION}"
    PROJECT_NAME: str = ""
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 1  # 1 hour
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 100  # 100 days
    OPENAI_API_KEY: str | None = None
    DB_POOL_SIZE: int = 83
    WEB_CONCURRENCY: int = 9
    POOL_SIZE: int = max(DB_POOL_SIZE // WEB_CONCURRENCY, 5)
    ASYNC_DATABASE_URI: str = ""

    CLERK_SECRET_KEY: str = os.environ["CLERK_SECRET_KEY"]
    CLERK_API_BACKEND_URL: str = os.environ["CLERK_API_BACKEND_URL"]
    CLERK_API_FRONTEND_URL: str = os.environ["CLERK_API_FRONTEND_URL"]
    CLERK_JWT_KEYS_URL: str = os.environ["CLERK_JWT_KEYS_URL"]

    @field_validator("ASYNC_DATABASE_URI", mode="after")
    def assemble_db_connection(cls, v: str | None, info: FieldValidationInfo) -> Any:
        if isinstance(v, str):
            # if v == "" and settings.MODE == ModeEnum.development:
            #     return PostgresDsn.build(
            #         scheme="postgresql+asyncpg",
            #         username=info.data["DATABASE_USER"],
            #         password=info.data["DATABASE_PASSWORD"],
            #         host=info.data["DATABASE_HOST"],
            #         port=info.data["DATABASE_PORT"],
            #         path=info.data["DATABASE_NAME"],
            #     )
            if v == "":
                return info.data["ASYNC_DATABASE_URL"]
        return v

    BACKEND_CORS_ORIGINS: list[str] | list[AnyHttpUrl] | None = None

    @field_validator("BACKEND_CORS_ORIGINS")
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    model_config = SettingsConfigDict(
        case_sensitive=True, env_file=os.path.expanduser("~/.env")
    )


settings = Settings()
