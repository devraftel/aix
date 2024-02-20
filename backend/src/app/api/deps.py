from collections.abc import AsyncGenerator
from sqlmodel.ext.asyncio.session import AsyncSession
from app.db.session import SessionLocal


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session

