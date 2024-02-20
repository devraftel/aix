from fastapi import APIRouter
from app.api.v1.endpoints import (
    hero,
)

api_router = APIRouter()

api_router.include_router(hero.router, prefix="/hero", tags=["Hero API For Testing"])