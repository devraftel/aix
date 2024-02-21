from fastapi import APIRouter
from app.api.v1.endpoints import (
    quiz_engine,
    quiz_attempt,
    user_file
)

api_router = APIRouter()

api_router.include_router(quiz_engine.router, prefix="/quiz", tags=["Quiz Engine"])
api_router.include_router(quiz_attempt.router, prefix="/quiz_attempt", tags=["Quiz Attempt"])
api_router.include_router(user_file.router, prefix="/user_file", tags=["User File"])