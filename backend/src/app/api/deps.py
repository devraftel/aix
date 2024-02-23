from collections.abc import AsyncGenerator
from sqlmodel.ext.asyncio.session import AsyncSession
from app.db.session import SessionLocal
import asyncio
from asyncpg.exceptions import ConnectionDoesNotExistError

# async def get_db() -> AsyncGenerator[AsyncSession, None]:
#     async with SessionLocal() as session:
#         yield session
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    max_retries = 3
    delay = 1
    for attempt in range(max_retries):
        try:
            # Attempt to create and yield the session
            async with SessionLocal() as session:
                yield session
            break  # If session is successfully created and yielded, break the loop
        except ConnectionDoesNotExistError as e:
            if attempt < max_retries - 1:
                print(f"Retry {attempt + 1}/{max_retries} due to error: {e}")
                await asyncio.sleep(delay)  # Wait before the next retry
            else:
                # If max retries have been reached, log and raise the exception
                print(f"Operation failed after {max_retries} attempts: {e}")
                raise