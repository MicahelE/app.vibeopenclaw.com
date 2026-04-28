from fastapi import FastAPI
import os
import uvicorn

app = FastAPI()

@app.get("/")
async def root():
    return {
        "status": "ok",
        "agent": os.getenv("AGENT_NAME", "hermes-agent"),
        "agent_id": os.getenv("AGENT_ID"),
        "type": "hermes",
        "timestamp": __import__("datetime").datetime.utcnow().isoformat(),
    }

if __name__ == "__main__":
    port = int(os.getenv("AGENT_PORT", "8642"))
    uvicorn.run(app, host="0.0.0.0", port=port)
