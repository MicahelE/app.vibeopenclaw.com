from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql+asyncpg://voc:YOUR_DB_PASSWORD@localhost:5432/vibeopenclaw"
    
    # Redis
    redis_url: str = "redis://localhost:6379/0"
    
    # Security
    secret_key: str = "vibeopenclaw-super-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    
    # Encryption for API keys
    encryption_key: str = "vibeopenclaw-encryption-key-32-bytes!!"
    
    # Stripe
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_price_pro: str = ""      # $60/month
    stripe_price_premium: str = ""  # $100/month
    
    # Server
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    frontend_url: str = "https://app.vibeopenclaw.com"
    
    # Docker
    agent_network: str = "voc-agents"
    data_dir: str = "/opt/vibeopenclaw/data/agents"
    
    # Plans
    plan_pro_price: int = 6000      # $60.00 in cents
    plan_premium_price: int = 10000 # $100.00 in cents
    plan_pro_agents: int = 1
    plan_premium_agents: int = 3
    plan_pro_memory_mb: int = 1536  # 1.5 GB
    plan_premium_memory_mb: int = 3072  # 3 GB
    
    class Config:
        env_file = ".env"

@lru_cache
def get_settings() -> Settings:
    return Settings()
