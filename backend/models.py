from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Enum, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import uuid
import enum

Base = declarative_base()

class PlanTier(str, enum.Enum):
    PRO = "pro"
    PREMIUM = "premium"

class AgentType(str, enum.Enum):
    OPENCLAW = "openclaw"
    HERMES = "hermes"

class AgentStatus(str, enum.Enum):
    CREATING = "creating"
    RUNNING = "running"
    STOPPED = "stopped"
    ERROR = "error"
    DELETED = "deleted"

class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    CANCELED = "canceled"
    PAST_DUE = "past_due"
    UNPAID = "unpaid"

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)
    name = Column(String(255), nullable=True)
    google_id = Column(String(255), unique=True, nullable=True)
    avatar_url = Column(String(512), nullable=True)
    
    # Stripe
    stripe_customer_id = Column(String(255), unique=True, nullable=True)
    
    # Plan
    plan_tier = Column(Enum(PlanTier), default=PlanTier.PRO, nullable=False)
    subscription_status = Column(Enum(SubscriptionStatus), nullable=True)
    subscription_id = Column(String(255), nullable=True)
    current_period_end = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    agents = relationship("Agent", back_populates="user", cascade="all, delete-orphan")
    api_keys = relationship("ApiKey", back_populates="user", cascade="all, delete-orphan")

class Agent(Base):
    __tablename__ = "agents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    
    agent_type = Column(Enum(AgentType), nullable=False)
    status = Column(Enum(AgentStatus), default=AgentStatus.CREATING)
    
    # Container info
    container_id = Column(String(255), nullable=True)
    container_name = Column(String(255), nullable=True)
    port = Column(Integer, nullable=True)
    
    # Model config
    model_provider = Column(String(50), nullable=True)  # openai, anthropic, etc.
    model_name = Column(String(100), nullable=True)
    
    # Channels
    telegram_bot_token = Column(Text, nullable=True)
    telegram_bot_username = Column(String(255), nullable=True)
    discord_bot_token = Column(Text, nullable=True)
    slack_bot_token = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_started_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="agents")

class ApiKey(Base):
    __tablename__ = "api_keys"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    provider = Column(String(50), nullable=False)  # openai, anthropic, google
    encrypted_key = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="api_keys")

class UsageLog(Base):
    __tablename__ = "usage_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"), nullable=True)
    
    date = Column(DateTime, default=datetime.utcnow)
    messages_sent = Column(Integer, default=0)
    api_calls = Column(Integer, default=0)
    input_tokens = Column(Integer, default=0)
    output_tokens = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
