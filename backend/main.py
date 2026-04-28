from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import engine
from models import Base
from config import get_settings
from routers import auth, agents, billing, api_keys, agent_proxy
from services.container_manager import ensure_network

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await ensure_network()
    yield
    # Shutdown
    await engine.dispose()

app = FastAPI(
    title="VibeOpenClaw API",
    description="Managed SaaS platform for OpenClaw and Hermes AI agents",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth, prefix="/api/auth", tags=["auth"])
app.include_router(agents, prefix="/api/agents", tags=["agents"])
app.include_router(billing, prefix="/api/billing", tags=["billing"])
app.include_router(api_keys, prefix="/api/keys", tags=["api-keys"])
app.include_router(agent_proxy, prefix="/agent", tags=["agent-proxy"])

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "0.1.0"}
