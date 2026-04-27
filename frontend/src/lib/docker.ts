import Docker from 'dockerode';

const docker = new Docker();
const AGENT_NETWORK = process.env.AGENT_NETWORK || 'voc-agents';
const DATA_DIR = process.env.DATA_DIR || '/opt/vibeopenclaw/data/agents';

export async function ensureNetwork() {
  try {
    await docker.getNetwork(AGENT_NETWORK).inspect();
  } catch {
    await docker.createNetwork({
      Name: AGENT_NETWORK,
      Driver: 'bridge',
      Labels: { app: 'vibeopenclaw' },
    });
  }
}

export async function createAgentContainer(
  agentId: string,
  agentType: string,
  agentName: string,
  memoryLimit: string = '1536m',
  apiKeys: Record<string, string> = {},
  modelProvider: string = 'openai',
  modelName: string = 'gpt-4o',
  telegramToken?: string,
  discordToken?: string,
  slackToken?: string
) {
  const containerName = `voc-agent-${agentId}`;
  const agentDir = `${DATA_DIR}/${agentId}`;
  
  const env = [
    `NODE_ENV=production`,
    `AGENT_ID=${agentId}`,
    `AGENT_NAME=${agentName}`,
    `MODEL_PROVIDER=${modelProvider}`,
    `MODEL_NAME=${modelName}`,
  ];
  
  Object.entries(apiKeys).forEach(([provider, key]) => {
    env.push(`${provider.toUpperCase()}_API_KEY=${key}`);
  });
  if (telegramToken) env.push(`TELEGRAM_BOT_TOKEN=${telegramToken}`);
  if (discordToken) env.push(`DISCORD_BOT_TOKEN=${discordToken}`);
  if (slackToken) env.push(`SLACK_BOT_TOKEN=${slackToken}`);

  const image = agentType === 'openclaw' ? 'node:24-alpine' : 'python:3.11-slim';
  const port = agentType === 'openclaw' ? '18789' : '8642';
  const command = agentType === 'openclaw'
    ? ['sh', '-c', 'node -e \'const http=require("http");const s=http.createServer((q,r)=>{r.writeHead(200);r.end(JSON.stringify({status:"ok",agent:process.env.AGENT_NAME,type:"openclaw",time:new Date().toISOString()}))});s.listen(18789,"0.0.0.0",()=>console.log("ok"))\'']
    : ['sh', '-c', 'pip install fastapi uvicorn -q && python -c \'import uvicorn,os,fastapi;app=fastapi.FastAPI();@app.get("/")async def r():return{"status":"ok","agent":os.getenv("AGENT_NAME","hermes"),"type":"hermes"}\' && uvicorn main:app --host 0.0.0.0 --port 8642'];

  const container = await docker.createContainer({
    Image: image,
    name: containerName,
    Env: env,
    HostConfig: {
      Binds: [`${agentDir}:/data`],
      Memory: parseMemory(memoryLimit),
      MemorySwap: parseMemory(memoryLimit),
      RestartPolicy: { Name: 'unless-stopped' },
      PortBindings: { [`${port}/tcp`]: [{ HostPort: '' }] },
    },
    ExposedPorts: { [`${port}/tcp`]: {} },
    NetworkingConfig: {
      EndpointsConfig: {
        [AGENT_NETWORK]: {},
      },
    },
    Labels: {
      app: 'vibeopenclaw',
      agent_id: agentId,
      agent_type: agentType,
    },
    Cmd: command,
  });

  await container.start();
  return container.id;
}

function parseMemory(limit: string): number {
  const match = limit.match(/^(\d+)([mg])$/i);
  if (!match) return 1536 * 1024 * 1024;
  const num = parseInt(match[1]);
  return match[2].toLowerCase() === 'g' ? num * 1024 * 1024 * 1024 : num * 1024 * 1024;
}

export async function stopContainer(containerId: string) {
  const container = docker.getContainer(containerId);
  await container.stop({ t: 30 });
}

export async function startContainer(containerId: string) {
  const container = docker.getContainer(containerId);
  await container.start();
}

export async function restartContainer(containerId: string) {
  const container = docker.getContainer(containerId);
  await container.restart({ t: 30 });
}

export async function deleteContainer(containerId: string) {
  const container = docker.getContainer(containerId);
  const info = await container.inspect();
  const agentId = info.Config.Labels?.agent_id;
  await container.remove({ force: true });
  if (agentId) {
    const fs = await import('fs/promises');
    try { await fs.rm(`${DATA_DIR}/${agentId}`, { recursive: true, force: true }); } catch {}
  }
}

export async function getContainerStatus(containerId: string) {
  try {
    const info = await docker.getContainer(containerId).inspect();
    return {
      id: info.Id,
      name: info.Name.replace(/^\//, ''),
      status: info.State.Status,
      running: info.State.Running,
      started_at: info.State.StartedAt,
    };
  } catch {
    return null;
  }
}

export async function getContainerPort(containerId: string, internalPort: number) {
  try {
    const info = await docker.getContainer(containerId).inspect();
    const ports = info.NetworkSettings.Ports;
    const mapping = ports?.[`${internalPort}/tcp`];
    if (mapping && mapping[0]) {
      return parseInt(mapping[0].HostPort);
    }
    return null;
  } catch {
    return null;
  }
}
