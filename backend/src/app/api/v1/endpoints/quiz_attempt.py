from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Annotated
from sqlmodel.ext.asyncio.session import AsyncSession

from app import crud
from app.api.deps import get_db

router = APIRouter()

# TODO CRUD When Student Attempts a Quiz