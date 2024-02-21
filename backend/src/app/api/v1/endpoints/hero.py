from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from sqlmodel.ext.asyncio.session import AsyncSession

from app import crud
from app.api.deps import get_db
from app.models.hero_model import Hero
from app.schemas.hero_schema import (IHeroCreate, IHeroRead, IHeroUpdate)

router = APIRouter()


@router.get("", response_model=list[IHeroRead])
async def get_hero_list(db_session: Annotated[AsyncSession, Depends(get_db)]):
    """
    Gets a paginated list of heroes
    """
    try:
        heroes = await crud.hero.get_hero_list(db_session=db_session)
        return heroes
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get_by_id/{hero_id}", response_model=IHeroRead)
async def get_hero_by_id(hero_id: UUID, db_session: Annotated[AsyncSession, Depends(get_db)]):
    """
    Gets a hero by its id
    """
    try:
        hero = await crud.hero.get_hero_by_id(id=hero_id, db_session=db_session)
        return hero
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get_by_name/{hero_name}", response_model=IHeroRead)
async def get_hero_by_name(
        hero_name: str,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Gets a hero by his/her name
    """
    try:
        hero = await crud.hero.get_hero_by_name(name=hero_name, db_session=db_session)
        return hero
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("")
async def create_hero(
        hero: IHeroCreate,
        db_session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Creates a new hero

    Required roles:
    - admin
    - manager
    """
    try:
        hero_created = await crud.hero.create_hero(obj_in=hero, db_session=db_session)
        return hero_created
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{hero_id}", response_model=IHeroRead)
async def update_hero(
        hero_id: UUID,
        hero: IHeroUpdate,
        db_session: Annotated[AsyncSession, Depends(get_db)],
):
    """
    Updates a hero by its id

    Required roles:
    - admin
    - manager
    """
    try:
        hero_updated = await crud.hero.update_hero(hero_id=hero_id, obj_in=hero, db_session=db_session)
        return hero_updated
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{hero_id}")
async def remove_hero(hero_id: UUID, db_session: Annotated[AsyncSession, Depends(get_db)]):
    """
    Deletes a hero by its id

    Required roles:
    - admin
    - manager
    """
    try:
        del_hero = await crud.hero.delete_hero(hero_id=hero_id, db_session=db_session)
        return del_hero
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
