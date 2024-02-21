from fastapi import (FastAPI)
from app.api.v1.api import api_router as api_router_v1
from app.core.config import settings

# Core Application Instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.API_VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)


@app.get("/hi")
async def root():
    return {"message": "Hello World"}


# Add Routers
app.include_router(api_router_v1, prefix=settings.API_V1_STR)
