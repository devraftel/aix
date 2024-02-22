from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

# A function that checks health of db by pinging it
async def check_db_health(db_session: AsyncSession):
    try:
        await db_session.exec(select(1))
        return True
    except Exception as e:
        raise e