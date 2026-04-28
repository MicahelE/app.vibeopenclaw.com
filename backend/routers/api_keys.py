from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID, uuid4

from dependencies import get_db, get_current_user
from models import User, ApiKey
from services.encryption import encrypt, decrypt

router = APIRouter()

@router.get("/")
async def list_api_keys(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(ApiKey).where(ApiKey.user_id == current_user.id)
    )
    keys = result.scalars().all()
    return [
        {
            "id": str(k.id),
            "provider": k.provider,
            "is_active": k.is_active,
            "created_at": k.created_at.isoformat() if k.created_at else None,
        }
        for k in keys
    ]

@router.post("/")
async def add_api_key(
    provider: str,
    key: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check if key already exists for this provider
    result = await db.execute(
        select(ApiKey).where(ApiKey.user_id == current_user.id, ApiKey.provider == provider)
    )
    existing = result.scalar_one_or_none()
    if existing:
        # Update existing key
        existing.encrypted_key = encrypt(key)
        existing.is_active = True
        await db.commit()
        return {"id": str(existing.id), "provider": provider, "message": "API key updated"}
    
    api_key = ApiKey(
        id=uuid4(),
        user_id=current_user.id,
        provider=provider,
        encrypted_key=encrypt(key),
        is_active=True,
    )
    db.add(api_key)
    await db.commit()
    await db.refresh(api_key)
    return {"id": str(api_key.id), "provider": provider, "message": "API key added"}

@router.delete("/{key_id}")
async def delete_api_key(
    key_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(ApiKey).where(ApiKey.id == key_id, ApiKey.user_id == current_user.id)
    )
    api_key = result.scalar_one_or_none()
    if not api_key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    await db.delete(api_key)
    await db.commit()
    return {"message": "API key deleted"}

@router.post("/{key_id}/toggle")
async def toggle_api_key(
    key_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(ApiKey).where(ApiKey.id == key_id, ApiKey.user_id == current_user.id)
    )
    api_key = result.scalar_one_or_none()
    if not api_key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    api_key.is_active = not api_key.is_active
    await db.commit()
    return {"id": str(api_key.id), "is_active": api_key.is_active}
