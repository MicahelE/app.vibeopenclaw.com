import docker
import os
import shutil
from typing import Optional, Dict, Any
from config import get_settings

settings = get_settings()

# Initialize Docker client
try:
    docker_client = docker.from_env()
except Exception as e:
    print(f"Warning: Could not connect to Docker: {e}")
    docker_client = None

def get_docker():
    return docker_client

async def create_agent_container(
    agent_id: str,
    agent_type: str,
    agent_name: str,
    memory_limit: str = "1536m",
    api_keys: Dict[str, str] = None,
    model_provider: str = "openai",
    model_name: str = "gpt-4o",
    telegram_token: str = None,
    discord_token: str = None,
    slack_token: str = None,
) -> Optional[str]:
    """Create and start a Docker container for an agent. Returns container ID."""
    if docker_client is None:
        raise RuntimeError("Docker client not available")
    
    container_name = f"voc-agent-{agent_id}"
    agent_dir = os.path.join(settings.data_dir, str(agent_id))
    
    # Create agent data directory
    os.makedirs(agent_dir, exist_ok=True)
    
    # Environment variables
    env = {
        "NODE_ENV": "production",
        "AGENT_ID": str(agent_id),
        "AGENT_NAME": agent_name,
        "MODEL_PROVIDER": model_provider,
        "MODEL_NAME": model_name,
    }
    
    if api_keys:
        for provider, key in api_keys.items():
            env[f"{provider.upper()}_API_KEY"] = key
    
    if telegram_token:
        env["TELEGRAM_BOT_TOKEN"] = telegram_token
    if discord_token:
        env["DISCORD_BOT_TOKEN"] = discord_token
    if slack_token:
        env["SLACK_BOT_TOKEN"] = slack_token
    
    # Copy startup template to agent directory
    template_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
    if agent_type == "openclaw":
        src = os.path.join(template_dir, "openclaw", "server.js")
        dst = os.path.join(agent_dir, "server.js")
        if os.path.exists(src):
            shutil.copy2(src, dst)
        image = "node:24-alpine"
        command = ["node", "/data/server.js"]
        ports = {"18789/tcp": None}  # Random host port
    elif agent_type == "hermes":
        src = os.path.join(template_dir, "hermes", "server.py")
        dst = os.path.join(agent_dir, "server.py")
        if os.path.exists(src):
            shutil.copy2(src, dst)
        image = "python:3.11-slim"
        command = ["sh", "-c", "pip install fastapi uvicorn && python /data/server.py"]
        ports = {"8642/tcp": None}
    else:
        raise ValueError(f"Unknown agent type: {agent_type}")
    
    # Volume mounts
    volumes = {
        agent_dir: {"bind": "/data", "mode": "rw"},
    }
    
    try:
        # Pull image if not present
        try:
            docker_client.images.get(image)
        except docker.errors.ImageNotFound:
            docker_client.images.pull(image)
        
        # Create and start container
        container = docker_client.containers.run(
            image=image,
            name=container_name,
            command=command,
            environment=env,
            volumes=volumes,
            ports=ports,
            mem_limit=memory_limit,
            memswap_limit=memory_limit,
            network=settings.agent_network,
            detach=True,
            restart_policy={"Name": "unless-stopped"},
            labels={
                "app": "vibeopenclaw",
                "agent_id": str(agent_id),
                "agent_type": agent_type,
            },
        )
        
        return container.id
    except Exception as e:
        # Cleanup on failure
        if os.path.exists(agent_dir):
            shutil.rmtree(agent_dir)
        raise RuntimeError(f"Failed to create container: {e}")

async def stop_agent_container(container_id: str) -> bool:
    """Stop an agent container."""
    if docker_client is None:
        return False
    
    try:
        container = docker_client.containers.get(container_id)
        container.stop(timeout=30)
        return True
    except docker.errors.NotFound:
        return False
    except Exception as e:
        print(f"Error stopping container: {e}")
        return False

async def start_agent_container(container_id: str) -> bool:
    """Start a stopped agent container."""
    if docker_client is None:
        return False
    
    try:
        container = docker_client.containers.get(container_id)
        container.start()
        return True
    except docker.errors.NotFound:
        return False
    except Exception as e:
        print(f"Error starting container: {e}")
        return False

async def restart_agent_container(container_id: str) -> bool:
    """Restart an agent container."""
    if docker_client is None:
        return False
    
    try:
        container = docker_client.containers.get(container_id)
        container.restart(timeout=30)
        return True
    except docker.errors.NotFound:
        return False
    except Exception as e:
        print(f"Error restarting container: {e}")
        return False

async def delete_agent_container(container_id: str) -> bool:
    """Delete an agent container and its data."""
    if docker_client is None:
        return False
    
    try:
        container = docker_client.containers.get(container_id)
        
        # Get agent_id from labels
        labels = container.attrs.get("Config", {}).get("Labels", {})
        agent_id = labels.get("agent_id")
        
        # Remove container
        container.remove(force=True)
        
        # Remove data directory
        if agent_id:
            agent_dir = os.path.join(settings.data_dir, agent_id)
            if os.path.exists(agent_dir):
                shutil.rmtree(agent_dir)
        
        return True
    except docker.errors.NotFound:
        return False
    except Exception as e:
        print(f"Error deleting container: {e}")
        return False

async def get_container_status(container_id: str) -> Optional[Dict[str, Any]]:
    """Get status of a container."""
    if docker_client is None:
        return None
    
    try:
        container = docker_client.containers.get(container_id)
        attrs = container.attrs
        
        state = attrs.get("State", {})
        config = attrs.get("Config", {})
        
        return {
            "id": container.id,
            "name": attrs.get("Name", "").lstrip("/"),
            "status": state.get("Status", "unknown"),
            "running": state.get("Running", False),
            "health": state.get("Health", {}).get("Status", "none"),
            "started_at": state.get("StartedAt"),
            "image": config.get("Image", ""),
        }
    except docker.errors.NotFound:
        return None
    except Exception as e:
        print(f"Error getting container status: {e}")
        return None

async def get_container_port(container_id: str, internal_port: int) -> Optional[int]:
    """Get the host port mapped to an internal container port."""
    if docker_client is None:
        return None
    
    try:
        container = docker_client.containers.get(container_id)
        ports = container.attrs.get("NetworkSettings", {}).get("Ports", {})
        
        port_key = f"{internal_port}/tcp"
        if port_key in ports and ports[port_key]:
            return int(ports[port_key][0]["HostPort"])
        
        return None
    except Exception as e:
        print(f"Error getting container port: {e}")
        return None

async def ensure_network():
    """Ensure the agent Docker network exists."""
    if docker_client is None:
        return
    
    try:
        docker_client.networks.get(settings.agent_network)
    except docker.errors.NotFound:
        docker_client.networks.create(
            settings.agent_network,
            driver="bridge",
            labels={"app": "vibeopenclaw"},
        )
