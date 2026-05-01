import Docker from 'dockerode';
import { mkdir, writeFile, chmod } from 'fs/promises';
import { getProvider, ProviderConfig } from './providers';

const docker = new Docker();
const AGENT_NETWORK = process.env.AGENT_NETWORK || 'voc-agents';
const DATA_DIR = process.env.DATA_DIR || '/opt/vibeopenclaw/data/agents';
const OPENCLAW_IMAGE = process.env.OPENCLAW_IMAGE || 'ghcr.io/openclaw/openclaw:latest';
const HERMES_IMAGE = process.env.HERMES_IMAGE || 'hermes-agent:latest';
const OPENCLAW_PLUGIN_CACHE = process.env.OPENCLAW_PLUGIN_CACHE || '/opt/vibeopenclaw/data/openclaw-plugin-cache';

type HealthMode = 'http' | 'container';
type AgentRuntime = {
  image: string;
  port?: number;
  healthPath?: string;
  cmd?: string[];
  healthMode: HealthMode;
};

const AGENT_CONFIG: Record<string, AgentRuntime> = {
  OPENCLAW: {
    image: OPENCLAW_IMAGE,
    port: 18789,
    healthPath: '/healthz',
    healthMode: 'http',
  },
  HERMES: {
    image: HERMES_IMAGE,
    cmd: ['gateway', 'run'],
    healthMode: 'container',
  },
};

const HEALTH_CHECK_TIMEOUT = 60_000;
const HEALTH_CHECK_INTERVAL = 2_000;

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

export async function ensureImage(image: string): Promise<void> {
  try {
    await docker.getImage(image).inspect();
  } catch {
    await new Promise<void>((resolve, reject) => {
      docker.pull(image, (err: Error | null, stream: NodeJS.ReadableStream) => {
        if (err) return reject(err);
        docker.modem.followProgress(stream, (followErr: Error | null) => {
          if (followErr) return reject(followErr);
          resolve();
        });
      });
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
  const type = agentType.toUpperCase() as keyof typeof AGENT_CONFIG;
  const config = AGENT_CONFIG[type] || AGENT_CONFIG.OPENCLAW;
  const containerName = `voc-agent-${agentId}`;
  const agentDir = `${DATA_DIR}/${agentId}`;
  const isHermes = type === 'HERMES';

  await mkdir(agentDir, { recursive: true });
  await chmod(agentDir, 0o777);

  if (!isHermes) {
    await mkdir(OPENCLAW_PLUGIN_CACHE, { recursive: true });
    try { await chmod(OPENCLAW_PLUGIN_CACHE, 0o777); } catch {}
  }

  await ensureImage(config.image);

  const activeProvider = getProvider(modelProvider);

  if (activeProvider && apiKeys[activeProvider.id]) {
    if (isHermes) {
      await writeHermesConfig(agentDir, activeProvider, modelName, apiKeys[activeProvider.id]);
    } else {
      await writeOpenclawConfig(agentDir, activeProvider, modelName, apiKeys[activeProvider.id]);
    }
  }

  const env: string[] = [];
  if (isHermes) {
    env.push(`HERMES_HOME=/data`);
    env.push(`HERMES_UID=1001`);
    env.push(`HERMES_GID=1001`);
  } else {
    env.push(`OPENCLAW_GATEWAY_BIND=lan`);
  }
  env.push(`AGENT_ID=${agentId}`);
  env.push(`AGENT_NAME=${agentName}`);

  for (const [provider, key] of Object.entries(apiKeys)) {
    const cfg = getProvider(provider);
    const envVar = cfg?.envKeyName || `${provider.toUpperCase()}_API_KEY`;
    env.push(`${envVar}=${key}`);
  }

  if (!isHermes && activeProvider) {
    if (activeProvider.envModelName) {
      env.push(`${activeProvider.envModelName}=${modelName}`);
    }
    if (activeProvider.baseUrl && apiKeys[activeProvider.id]) {
      env.push(`OPENAI_API_KEY=${apiKeys[activeProvider.id]}`);
      env.push(`OPENAI_BASE_URL=${activeProvider.baseUrl}`);
      env.push(`OPENAI_MODEL=${modelName}`);
    }
  }

  if (telegramToken) env.push(`TELEGRAM_BOT_TOKEN=${telegramToken}`);
  if (discordToken) env.push(`DISCORD_BOT_TOKEN=${discordToken}`);
  if (slackToken) env.push(`SLACK_BOT_TOKEN=${slackToken}`);

  const portKey = config.port ? `${config.port}/tcp` : null;
  const binds = isHermes
    ? [`${agentDir}:/data`]
    : [
        `${agentDir}:/home/node/.openclaw`,
        `${OPENCLAW_PLUGIN_CACHE}:/home/node/.openclaw/plugin-runtime-deps`,
      ];
  const container = await docker.createContainer({
    Image: config.image,
    name: containerName,
    Env: env,
    Cmd: config.cmd,
    HostConfig: {
      Binds: binds,
      Memory: parseMemory(memoryLimit),
      MemorySwap: parseMemory(memoryLimit),
      RestartPolicy: { Name: 'unless-stopped' },
      ...(portKey ? { PortBindings: { [portKey]: [{ HostPort: '' }] } } : {}),
    },
    ...(portKey ? { ExposedPorts: { [portKey]: {} } } : {}),
    NetworkingConfig: {
      EndpointsConfig: {
        [AGENT_NETWORK]: {},
      },
    },
    Labels: {
      app: 'vibeopenclaw',
      agent_id: agentId,
      agent_type: type,
    },
  });

  await container.start();
  return container.id;
}

async function writeHermesConfig(
  agentDir: string,
  provider: ProviderConfig,
  modelName: string,
  apiKey: string
) {
  const isCustom = provider.hermesProvider === 'custom';
  const lines = [
    'model:',
    `  default: "${isCustom ? modelName : `${provider.id}/${modelName}`}"`,
    `  provider: "${provider.hermesProvider}"`,
  ];
  if (isCustom) {
    lines.push(`  base_url: "${provider.openclawBaseUrl}"`);
    lines.push(`  api_key: "${apiKey}"`);
  }
  lines.push('');
  await writeFile(`${agentDir}/config.yaml`, lines.join('\n'));
}

async function writeOpenclawConfig(
  agentDir: string,
  provider: ProviderConfig,
  modelName: string,
  apiKey: string
) {
  const config = {
    models: {
      mode: 'merge',
      providers: {
        [provider.id]: {
          baseUrl: provider.openclawBaseUrl,
          apiKey,
          api: provider.openclawApi,
          models: [
            {
              id: modelName,
              name: modelName,
              reasoning: false,
              input: ['text'],
              cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
              contextWindow: 128000,
              contextTokens: 96000,
              maxTokens: 8192,
            },
          ],
        },
      },
    },
    agents: {
      defaults: {
        model: { primary: `${provider.id}/${modelName}` },
      },
    },
  };
  await writeFile(`${agentDir}/openclaw.json`, JSON.stringify(config, null, 2));
}

function parseMemory(limit: string): number {
  const match = limit.match(/^(\d+)([mg])$/i);
  if (!match) return 1536 * 1024 * 1024;
  const num = parseInt(match[1]);
  return match[2].toLowerCase() === 'g' ? num * 1024 * 1024 * 1024 : num * 1024 * 1024;
}

export async function waitForHealthy(
  containerId: string,
  internalPort: number | undefined,
  healthPath: string | undefined,
  mode: HealthMode = 'http'
): Promise<boolean> {
  const start = Date.now();
  let stableSince: number | null = null;
  while (Date.now() - start < HEALTH_CHECK_TIMEOUT) {
    try {
      if (mode === 'container') {
        const info = await docker.getContainer(containerId).inspect();
        if (info.State.Running) {
          if (stableSince === null) stableSince = Date.now();
          if (Date.now() - stableSince >= 5000) return true;
        } else {
          stableSince = null;
        }
      } else if (internalPort && healthPath) {
        const hostPort = await getContainerPort(containerId, internalPort);
        if (hostPort) {
          const res = await fetch(`http://localhost:${hostPort}${healthPath}`, {
            signal: AbortSignal.timeout(3000),
          });
          if (res.ok) return true;
        }
      }
    } catch {}
    await new Promise(r => setTimeout(r, HEALTH_CHECK_INTERVAL));
  }
  return false;
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
      restart_count: (info as { RestartCount?: number }).RestartCount ?? 0,
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

export function getAgentConfig(agentType: string) {
  const type = agentType.toUpperCase() as keyof typeof AGENT_CONFIG;
  return AGENT_CONFIG[type] || AGENT_CONFIG.OPENCLAW;
}