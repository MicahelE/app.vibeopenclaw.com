from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import StreamingResponse
import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from dependencies import get_db
from models import Agent

router = APIRouter()

@router.api_route("/{agent_id}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
@router.api_route("/{agent_id}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
async def proxy_to_agent(
    agent_id: UUID,
    request: Request,
    path: str = "",
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    if agent.status.value != "running" or not agent.port:
        raise HTTPException(status_code=503, detail="Agent is not running")
    
    # Build target URL
    target_url = f"http://localhost:{agent.port}/{path}"
    if request.query_params:
        target_url += f"?{request.query_params}"
    
    # Forward request
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("content-length", None)
    
    body = await request.body()
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.request(
                method=request.method,
                url=target_url,
                headers=headers,
                content=body,
                timeout=30.0,
            )
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Agent unreachable: {str(e)}")
    
    return StreamingResponse(
        content=resp.aiter_raw(),
        status_code=resp.status_code,
        headers=dict(resp.headers),
    )
