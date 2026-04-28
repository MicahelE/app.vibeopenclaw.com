from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID, uuid4
from datetime import datetime

from dependencies import get_db, get_current_user
from models import User, Agent, AgentType, AgentStatus, PlanTier, ApiKey
from config import get_settings
from services.container_manager import (
    create_agent_container,
    stop_agent_container,
    start_agent_container,
    restart_agent_container,
    delete_agent_container,
    get_container_status,
    get_container_port,
)
from services.encryption import decrypt

settings = get_settings()
router = APIRouter()

PLAN_LIMITS = {
    PlanTier.PRO: {"agents": settings.plan_pro_agents, "memory_mb": settings.plan_pro_memory_mb},
    PlanTier.PREMIUM: {"agents": settings.plan_premium_agents, "memory_mb": settings.plan_premium_memory_mb},
}

@router.get("/")
async def list_agents(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Agent).where(Agent.user_id == current_user.id))
    agents = result.scalars().all()
    return [{"id": str(a.id), "name": a.name, "type": a.agent_type.value, "status": a.status.value, "port": a.port} for a in agents]

@router.post("/")
async def create_agent(
    name: str,
    agent_type: AgentType,
    model_provider: str = "openai",
    model_name: str = "gpt-4o",
    telegram_token: str = None,
    discord_token: str = None,
    slack_token: str = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Enforce plan limits
    limits = PLAN_LIMITS.get(current_user.plan_tier, PLAN_LIMITS[PlanTier.PRO])
    result = await db.execute(
        select(func.count()).where(Agent.user_id == current_user.id, Agent.status != AgentStatus.DELETED)
    )
    current_count = result.scalar()
    if current_count >= limits["agents"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Plan limit reached: {limits['agents']} agents max",
        )
    
    agent = Agent(
        id=uuid4(),
        user_id=current_user.id,
        name=name,
        agent_type=agent_type,
        status=AgentStatus.CREATING,
        model_provider=model_provider,
        model_name=model_name,
        telegram_bot_token=telegram_token,
        discord_bot_token=discord_token,
        slack_bot_token=slack_token,
    )
    db.add(agent)
    await db.commit()
    await db.refresh(agent)
    
    # Get API keys for the user
    api_keys = {}
    key_result = await db.execute(select(ApiKey).where(ApiKey.user_id == current_user.id, ApiKey.is_active == True))
    for key in key_result.scalars().all():
        api_keys[key.provider] = decrypt(key.encrypted_key)
    
    try:
        memory_limit = f"{limits['memory_mb']}m"
        container_id = await create_agent_container(
            agent_id=str(agent.id),
            agent_type=agent_type.value,
            agent_name=name,
            memory_limit=memory_limit,
            api_keys=api_keys,
            model_provider=model_provider,
            model_name=model_name,
            telegram_token=telegram_token,
            discord_token=discord_token,
            slack_token=slack_token,
        )
        
        agent.container_id = container_id
        agent.container_name = f"voc-agent-{agent.id}"
        agent.status = AgentStatus.RUNNING
        
        # Get mapped port
        if agent_type == AgentType.OPENCLAW:
            agent.port = await get_container_port(container_id, 18789)
        elif agent_type == AgentType.HERMES:
            agent.port = await get_container_port(container_id, 8642)
        
        agent.last_started_at = datetime.utcnow()
        await db.commit()
        await db.refresh(agent)
    except Exception as e:
        agent.status = AgentStatus.ERROR
        await db.commit()
        raise HTTPException(status_code=500, detail=f"Failed to provision agent: {str(e)}")
    
    return {"id": str(agent.id), "status": agent.status.value, "port": agent.port}

@router.get("/{agent_id}")
async def get_agent(
    agent_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Agent).where(Agent.id == agent_id, Agent.user_id == current_user.id)
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    status_info = None
    if agent.container_id:
        status_info = await get_container_status(agent.container_id)
    
    return {
        "id": str(agent.id),
        "name": agent.name,
        "type": agent.agent_type.value,
        "status": agent.status.value,
        "port": agent.port,
        "model_provider": agent.model_provider,
        "model_name": agent.model_name,
        "container_status": status_info,
        "created_at": agent.created_at,
        "last_started_at": agent.last_started_at,
    }

@router.post("/{agent_id}/stop")
async def stop_agent(
    agent_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Agent).where(Agent.id == agent_id, Agent.user_id == current_user.id)
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    if agent.container_id:
        success = await stop_agent_container(agent.container_id)
        if success:
            agent.status = AgentStatus.STOPPED
            await db.commit()
    
    return {"id": str(agent.id), "status": agent.status.value}

@router.post("/{agent_id}/start")
async def start_agent(
    agent_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Agent).where(Agent.id == agent_id, Agent.user_id == current_user.id)
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    if agent.container_id:
        success = await start_agent_container(agent.container_id)
        if success:
            agent.status = AgentStatus.RUNNING
            agent.last_started_at = datetime.utcnow()
            if agent.agent_type == AgentType.OPENCLAW:
                agent.port = await get_container_port(agent.container_id, 18789)
            elif agent.agent_type == AgentType.HERMES:
                agent.port = await get_container_port(agent.container_id, 8642)
            await db.commit()
    
    return {"id": str(agent.id), "status": agent.status.value, "port": agent.port}

@router.post("/{agent_id}/restart")
async def restart_agent(
    agent_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Agent).where(Agent.id == agent_id, Agent.user_id == current_user.id)
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    if agent.container_id:
        success = await restart_agent_container(agent.container_id)
        if success:
            agent.status = AgentStatus.RUNNING
            agent.last_started_at = datetime.utcnow()
            if agent.agent_type == AgentType.OPENCLAW:
                agent.port = await get_container_port(agent.container_id, 18789)
            elif agent.agent_type == AgentType.HERMES:
                agent.port = await get_container_port(agent.container_id, 8642)
            await db.commit()
    
    return {"id": str(agent.id), "status": agent.status.value, "port": agent.port}

@router.delete("/{agent_id}")
async def delete_agent(
    agent_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Agent).where(Agent.id == agent_id, Agent.user_id == current_user.id)
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    if agent.container_id:
        await delete_agent_container(agent.container_id)
    
    agent.status = AgentStatus.DELETED
    agent.container_id = None
    agent.port = None
    await db.commit()
    
    return {"id": str(agent.id), "status": "deleted"}
