from fastapi import APIRouter
from app.api.v1.endpoints import (
    quiz_engine,
    quiz_attempt,
    user_file,
    questions_engine
)

api_router = APIRouter()

api_router.include_router(
    quiz_engine.router, prefix="/quiz", tags=["Quiz Engine"])
api_router.include_router(
    quiz_attempt.router, prefix="/quiz-attempt", tags=["Quiz Attempt"])
api_router.include_router(
    user_file.router, prefix="/user-file", tags=["User File"])
# This was just to test Questions Crud - we will the endpoints file later
# api_router.include_router(questions_engine.router, prefix="/questions", tags=["Questions Engine "])
