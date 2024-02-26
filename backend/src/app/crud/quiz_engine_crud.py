from sqlmodel import select, func, and_
from sqlmodel.ext.asyncio.session import AsyncSession
from uuid import UUID

from app import crud
from app.models.quiz_engine_model import Quiz
from app.schemas.quiz_engine_schema import IQuizUpdate, IQuizCreate


class CRUDQuizEngine:
    async def get_user_quizzes_list(
        self, *, user_id: str, db_session: AsyncSession, offset: int, limit: int
    ):
        try:
            result = await db_session.exec(
                (select(Quiz).where(Quiz.user_id == user_id))
                .offset(offset)
                .limit(limit)
                .order_by(Quiz.created_at.desc())  # Order by created_at
            )
            user_files = result.all()
            if not user_files:
                raise ValueError("Quizzes not found")
            return user_files
        except ValueError as e:
            await db_session.rollback()
            raise e
        except Exception as e:
            await db_session.rollback()
            raise e

    async def get_quiz_by_id(
        self, *, user_id: str, quiz_id: UUID, db_session: AsyncSession
    ):
        try:
            query = select(Quiz).where(
                and_(Quiz.id == quiz_id, Quiz.user_id == user_id)
            )
            result = await db_session.exec(query)
            quiz_retrieved = result.one_or_none()

            if quiz_retrieved is None:
                raise ValueError("Quiz not found")
            return quiz_retrieved
        except ValueError as e:
            await db_session.rollback()
            raise e
        except Exception as e:
            await db_session.rollback()
            raise e

    async def get_count_of_quizzes_for_user(
        self,
        *,
        user_id: str,
        db_session: AsyncSession,
    ) -> int:
        try:
            db_session = db_session
            subquery = select(Quiz).where(Quiz.user_id == user_id).subquery()
            query = select(func.count()).select_from(subquery)
            count = await db_session.execute(query)
            value = count.scalar_one_or_none()
            if value is None:
                raise ValueError("No Quiz found")
            return value
        except ValueError as e:
            await db_session.rollback()
            raise e
        except Exception as e:
            await db_session.rollback()
            raise e

    async def delete_quiz(
        self, *, db_session: AsyncSession, quiz_id: UUID, user_id: str
    ):
        try:
            quiz = await self.get_quiz_by_id(
                user_id=user_id, quiz_id=quiz_id, db_session=db_session
            )
            if quiz is None:
                raise ValueError("quiz not found")
            await db_session.delete(quiz)
            await db_session.commit()
            return {"id": quiz.id, "quiz_name": quiz.title, "deleted": True}
        except ValueError as e:
            await db_session.rollback()
            raise e
        except Exception as e:
            await db_session.rollback()
            raise e

    async def update_quiz(
        self,
        *,
        db_session: AsyncSession,
        user_id: str,
        quiz_id: UUID,
        quiz_obj: IQuizUpdate,
    ) -> Quiz:
        try:
            db_obj = await self.get_quiz_by_id(
                user_id=user_id, quiz_id=quiz_id, db_session=db_session
            )
            if db_obj is None:
                raise ValueError("Quiz not found")

            for key, value in quiz_obj.model_dump(exclude_unset=True).items():
                setattr(db_obj, key, value)

            db_session.add(db_obj)
            await db_session.commit()
            await db_session.refresh(db_obj)
            return db_obj
        except ValueError as e:
            await db_session.rollback()
            raise e
        except Exception as e:
            await db_session.rollback()
            raise e

    async def create_quiz(self, *, quiz_obj: IQuizCreate, db_session: AsyncSession):
        try:
            if quiz_obj.user_file_ids:
                # Data to Link Selected Files to Quiz
                quiz_files_data_obj = await crud.user_file.get_file_ids_data(
                    file_ids=quiz_obj.user_file_ids,
                    user_id=quiz_obj.user_id,
                    db_session=db_session,
                )
                quiz_obj.user_files.extend(quiz_files_data_obj)

            db_obj = Quiz.model_validate(quiz_obj)
            db_session.add(db_obj)
            await db_session.commit()
            await db_session.refresh(db_obj)
            return db_obj
        except Exception as e:
            await db_session.rollback()
            raise e


quiz_engine = CRUDQuizEngine()
