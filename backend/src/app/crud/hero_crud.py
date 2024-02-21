from app.schemas.hero_schema import IHeroCreate, IHeroUpdate
from app.models.hero_model import Hero
from sqlmodel import select, func, col
from sqlmodel.ext.asyncio.session import AsyncSession
from uuid import UUID


class CRUDHero:

    async def get_hero_list(self, *, db_session: AsyncSession) -> list[Hero]:
        heroes = await db_session.execute(select(Hero))
        all_heroes = list(heroes.scalars().all())
        if not all_heroes:
            raise ValueError("No heroes found")
        return all_heroes

    async def get_hero_by_name(
            self, *, name: str, db_session: AsyncSession
    ) -> Hero:
        db_session = db_session
        hero_query = await db_session.execute(
            select(Hero).where(col(Hero.name).ilike(f"%{name}%"))
        )
        hero = hero_query.scalars().one()
        return hero

    async def get_hero_by_id(
            self, *, id: UUID, db_session: AsyncSession
    ) -> Hero:
        db_session = db_session
        hero = await db_session.get(Hero, id)
        if hero is None:
            raise ValueError("Hero not found")
        return hero

    async def get_count_of_heroes(
            self,
            *,
            db_session: AsyncSession,
    ) -> int:
        db_session = db_session
        subquery = (select(Hero).subquery())
        query = select(func.count()).select_from(subquery)
        count = await db_session.execute(query)
        value = count.scalar_one_or_none()
        if value is None:
            raise ValueError("No heroes found")
        return value

    async def create_hero(
            self, *, obj_in: IHeroCreate, db_session: AsyncSession
    ) -> Hero:
        hero = Hero.model_validate(obj_in)
        db_session.add(hero)
        await db_session.commit()
        await db_session.refresh(hero)
        return hero

    async def update_hero(
            self, *, db_session: AsyncSession, hero_id: UUID, obj_in: IHeroUpdate,
    ) -> Hero:

        db_obj = await db_session.get(Hero, hero_id)

        if db_obj is None:
            raise ValueError("Hero not found")

        hero_obj_in = obj_in.model_dump(exclude_unset=True)

        for key, value in hero_obj_in.items():
            setattr(db_obj, key, value)

        db_session.add(db_obj)

        await db_session.commit()
        await db_session.refresh(db_obj)
        return db_obj

    async def delete_hero(
            self, *, db_session: AsyncSession, hero_id: UUID
    ) -> dict[str, str]:
        hero = await db_session.get(Hero, hero_id)
        if hero is None:
            raise ValueError("Hero not found")
        await db_session.delete(hero)
        await db_session.commit()
        return {"message": "Hero deleted"}


hero = CRUDHero()
