import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { createAgentContainer, getContainerPort, ensureNetwork, waitForHealthy, getAgentConfig } from '@/lib/docker';
import { decrypt } from '@/lib/encrypt';
import { v4 as uuidv4 } from 'uuid';

const PLAN_LIMITS: Record<string, { agents: number; memory_mb: number }> = {
  pro: { agents: 1, memory_mb: 1536 },
  premium: { agents: 3, memory_mb: 3072 },
};

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
  
  const result = await query(
    "SELECT id, name, agent_type, status, port, model_provider, model_name, telegram_bot_token IS NOT NULL AS has_telegram, discord_bot_token IS NOT NULL AS has_discord, slack_bot_token IS NOT NULL AS has_slack FROM agents WHERE user_id = $1 AND status != 'DELETED'",
    [user.id]
  );
  
  return NextResponse.json(result.rows.map(a => ({
    id: a.id,
    name: a.name,
    type: a.agent_type,
    status: a.status,
    port: a.port,
    model_provider: a.model_provider,
    model_name: a.model_name,
    has_telegram: a.has_telegram,
    has_discord: a.has_discord,
    has_slack: a.has_slack,
  })));
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
  
  try {
    const body = await req.json();
    const name = body.name;
    const agentType = body.agent_type;
    const modelProvider = body.model_provider || 'openai';
    const modelName = body.model_name || 'gpt-4o';
    const telegramToken = body.telegram_token || undefined;
    const discordToken = body.discord_token || undefined;
    const slackToken = body.slack_token || undefined;
    
    if (!name || !agentType) {
      return NextResponse.json({ detail: 'Name and agent_type required' }, { status: 400 });
    }
    
    const limits = PLAN_LIMITS[user.plan_tier?.toLowerCase()] || PLAN_LIMITS.pro;
    const countResult = await query(
      "SELECT COUNT(*) FROM agents WHERE user_id = $1 AND status != 'DELETED'",
      [user.id]
    );
    const currentCount = parseInt(countResult.rows[0].count);
    if (currentCount >= limits.agents) {
      return NextResponse.json({ detail: `Plan limit reached: ${limits.agents} agents max. Upgrade your plan for more.` }, { status: 403 });
    }
    
    const agentId = uuidv4();
    const memoryLimit = `${limits.memory_mb}m`;
    
    await query(
      `INSERT INTO agents (id, user_id, name, agent_type, status, model_provider, model_name, telegram_bot_token, discord_bot_token, slack_bot_token)
       VALUES ($1, $2, $3, $4, 'CREATING', $5, $6, $7, $8, $9)`,
      [agentId, user.id, name, agentType.toUpperCase(), modelProvider, modelName, telegramToken || null, discordToken || null, slackToken || null]
    );
    
    const keyResult = await query(
      'SELECT provider, encrypted_key FROM api_keys WHERE user_id = $1 AND is_active = true',
      [user.id]
    );
    const apiKeys: Record<string, string> = {};
    for (const row of keyResult.rows) {
      try {
        apiKeys[row.provider] = decrypt(row.encrypted_key);
      } catch {
        console.error(`Failed to decrypt ${row.provider} key for user ${user.id}`);
      }
    }
    
    if (Object.keys(apiKeys).length === 0) {
      await query("UPDATE agents SET status = 'ERROR' WHERE id = $1", [agentId]);
      return NextResponse.json({ detail: 'No API keys configured. Add at least one API key (OpenAI, Anthropic, or Google) before creating an agent.' }, { status: 400 });
    }
    
    try {
      await ensureNetwork();
      const containerId = await createAgentContainer(
        agentId, agentType, name, memoryLimit, apiKeys,
        modelProvider, modelName, telegramToken, discordToken, slackToken
      );
      
      const config = getAgentConfig(agentType);
      const healthy = await waitForHealthy(containerId, config.port, config.healthPath);
      
      if (!healthy) {
        await query("UPDATE agents SET status = 'ERROR' WHERE id = $1", [agentId]);
        return NextResponse.json({ detail: 'Agent container started but health check timed out. It may need more time to initialize — check back in a minute.' }, { status: 504 });
      }
      
      const hostPort = await getContainerPort(containerId, config.port);
      
      await query(
        'UPDATE agents SET container_id = $1, container_name = $2, status = $3, port = $4, last_started_at = NOW() WHERE id = $5',
        [containerId, `voc-agent-${agentId}`, 'RUNNING', hostPort, agentId]
      );
      
      return NextResponse.json({ id: agentId, status: 'running', port: hostPort });
    } catch (err: any) {
      await query("UPDATE agents SET status = 'ERROR' WHERE id = $1", [agentId]);
      return NextResponse.json({ detail: `Failed to provision agent: ${err.message}` }, { status: 500 });
    }
  } catch (err: any) {
    console.error('Create agent error:', err);
    return NextResponse.json({ detail: err.message || 'Failed to create agent' }, { status: 500 });
  }
}