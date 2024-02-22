from sqlmodel import select, func, and_
from uuid import UUID
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.user_file_modal import UserFile


class CRUDUserFile:
    async def get_user_files_list(self, *, user_id: str, db_session: AsyncSession, offset: int, limit: int):
        try:
            result = await db_session.exec((select(UserFile).where(UserFile.user_id == user_id)).offset(offset).limit(limit))
            user_files = result.all()
            if not user_files:
                raise ValueError("user_files not found")
            return user_files
        except ValueError as e:
            raise e
        except Exception as e:
            raise e

    async def get_file_by_id(self, *,user_id:str,  file_id: UUID, db_session: AsyncSession):
        query = select(UserFile).where(and_(UserFile.id == file_id, UserFile.user_id == user_id))
        result = await db_session.exec(query)
        file_retrieved = result.one()

        if file_retrieved is None:
            raise ValueError("file_retrieved not found")
        return file_retrieved

    async def get_count_of_files_for_user(
            self,
            *,
            user_id: str,
            db_session: AsyncSession,
    ) -> int:
        try:
            db_session = db_session
            subquery = select(UserFile).where(UserFile.user_id == user_id).subquery()
            query = select(func.count()).select_from(subquery)
            count = await db_session.execute(query)
            value = count.scalar_one_or_none()
            if value is None:
                raise ValueError("No files found")
            return value
        except ValueError as e:
            raise e
        except Exception as e:
            raise e

    async def delete_file(
            self, *, db_session: AsyncSession, file_id: UUID
    ):
        try:
            file = await db_session.get(UserFile, file_id)
            if file is None:
                raise ValueError("file not found")
            await db_session.delete(file)
            await db_session.commit()
            return {"id": file.id, "file_name": file.file_name, "deleted": True}
        except ValueError as e:
            raise e
        except Exception as e:
            raise e
        
    async def create_user_file(
            self, *, file_obj: UserFile, db_session: AsyncSession
    ) -> UserFile:
        try:
            db_session.add(file_obj)
            await db_session.commit()
            await db_session.refresh(file_obj)
            return file_obj
        except Exception as e:
            raise e
        
    async def update_file_content_size(
            self, *, db_session: AsyncSession, file_id: UUID, byte_size: int
    ) -> UserFile:
        try:
            db_obj = await db_session.get(UserFile, file_id)
            if db_obj is None:
                raise ValueError("file not found")

            setattr(db_obj, "bytes", byte_size)
            db_session.add(db_obj)
            await db_session.commit()
            await db_session.refresh(db_obj)
            return db_obj
        except ValueError as e:
            raise e
        except Exception as e:
            raise e

    async def get_file_ids_data(
            self,
            *,
            file_ids: list,
            user_id: str,
            db_session: AsyncSession,
    ):
        try:
            result = await db_session.exec(select(UserFile).where(and_(UserFile.id.in_(tuple(file_ids)), UserFile.user_id == user_id))) #type: ignore
            user_files = result.all()
            if not user_files:
                raise ValueError("user_files not found")
            return user_files
        except ValueError as e:
            raise e
        except Exception as e:
            raise e



user_file = CRUDUserFile()
