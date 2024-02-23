from fastapi import (FastAPI, Depends)
from typing import Annotated
from app.api.v1.api import api_router as api_router_v1
from app.core.config import settings
from app.db.health import check_db_health, AsyncSession
from app.api.deps import get_db

# Core Application Instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.API_VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)


@app.get("/health/api", tags=["Health"])
async def api_root():
    return {"message": "API is up and running!"}

@app.get("/health/db", tags=["Health"])
async def db_root( db_session: Annotated[AsyncSession, Depends(get_db)]):
    try:
        await check_db_health(db_session=db_session)
        return {"message": "Database is up and running!"}
    except Exception as e:
        return {"message": f"Database is down! {str(e)}"}

# Add Routers
app.include_router(api_router_v1, prefix=settings.API_V1_STR)
