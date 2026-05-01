import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import {
  getContainerStatus,
  getContainerPort,
  deleteContainer,
  ensureNetwork,
  createAgentContainer,
  waitForHealthy,
  getAgentConfig,
} from '@/lib/docker';
import { decrypt } from '@/lib/encrypt';

const PLAN_MEMORY_MB: Record<string, number> = { pro: 2048, premium: 4096 };

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
  
  const { id } = await params;
  const result = await query(
    'SELECT * FROM agents WHERE id = $1 AND user_id = $2',
    [id, user.id]
  );
  const agent = result.rows[0];
  if (!agent) return NextResponse.json({ detail: 'Agent not found' }, { status: 404 });
  
  let containerStatus = null;
  if (agent.container_id) {
    containerStatus = await getContainerStatus(agent.container_id);
  }
  
  return NextResponse.json({
    id: agent.id,
    name: agent.name,
    type: agent.agent_type,
    status: agent.status,
    port: agent.port,
    model_provider: agent.model_provider,
    model_name: agent.model_name,
    container_status: containerStatus,
    created_at: agent.created_at,
    last_started_at: agent.last_started_at,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const updates: Record<string, unknown> = {};
  let touchesTokens = false;
  if (typeof body.name === 'string' && body.name.trim()) {
    updates.name = body.name.trim();
  }
  for (const key of ['telegram_bot_token', 'discord_bot_token', 'slack_bot_token'] as const) {
    if (key in body) {
      const v = body[key];
      if (v === null || v === '' || (typeof v === 'string' && v.trim())) {
        updates[key] = v ? String(v).trim() : null;
        touchesTokens = true;
      }
    }
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ detail: 'No fields to update' }, { status: 400 });
  }

  const existing = await query(
    'SELECT * FROM agents WHERE id = $1 AND user_id = $2',
    [id, user.id]
  );
  const agent = existing.rows[0];
  if (!agent) return NextResponse.json({ detail: 'Agent not found' }, { status: 404 });
  if (agent.status === 'DELETED') {
    return NextResponse.json({ detail: 'Cannot edit a deleted agent' }, { status: 400 });
  }

  const setClauses = Object.keys(updates).map((k, i) => `${k} = $${i + 1}`);
  const values = Object.values(updates);
  await query(
    `UPDATE agents SET ${setClauses.join(', ')} WHERE id = $${values.length + 1}`,
    [...values, id]
  );

  if (!touchesTokens || !agent.container_id) {
    return NextResponse.json({ id, updated: Object.keys(updates) });
  }

  try { await deleteContainer(agent.container_id); } catch (e) { console.error('delete container during patch', e); }

  const refreshed = await query('SELECT * FROM agents WHERE id = $1', [id]);
  const a = refreshed.rows[0];

  const keyResult = await query(
    'SELECT provider, encrypted_key FROM api_keys WHERE user_id = $1 AND is_active = true',
    [user.id]
  );
  const apiKeys: Record<string, string> = {};
  for (const row of keyResult.rows) {
    try { apiKeys[row.provider] = decrypt(row.encrypted_key); } catch {}
  }

  const memoryMb = PLAN_MEMORY_MB[user.plan_tier?.toLowerCase()] || PLAN_MEMORY_MB.pro;
  await query("UPDATE agents SET status = 'CREATING', container_id = NULL, port = NULL WHERE id = $1", [id]);

  try {
    await ensureNetwork();
    const containerId = await createAgentContainer(
      a.id, a.agent_type, a.name, `${memoryMb}m`, apiKeys,
      a.model_provider, a.model_name,
      a.telegram_bot_token || undefined,
      a.discord_bot_token || undefined,
      a.slack_bot_token || undefined,
    );

    const cfg = getAgentConfig(a.agent_type);
    const healthy = await waitForHealthy(containerId, cfg.port, cfg.healthPath, cfg.healthMode);
    if (!healthy) {
      await query("UPDATE agents SET status = 'ERROR' WHERE id = $1", [id]);
      return NextResponse.json({ detail: 'Updated, but new container failed health check' }, { status: 504 });
    }

    const hostPort = cfg.port ? await getContainerPort(containerId, cfg.port) : null;
    await query(
      'UPDATE agents SET container_id = $1, container_name = $2, status = $3, port = $4, last_started_at = NOW() WHERE id = $5',
      [containerId, `voc-agent-${id}`, 'RUNNING', hostPort, id]
    );
    return NextResponse.json({ id, updated: Object.keys(updates), status: 'RUNNING', port: hostPort });
  } catch (err: any) {
    await query("UPDATE agents SET status = 'ERROR' WHERE id = $1", [id]);
    return NextResponse.json({ detail: `Updated DB but container redeploy failed: ${err.message}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
  
  const { id } = await params;
  const result = await query(
    'SELECT container_id FROM agents WHERE id = $1 AND user_id = $2',
    [id, user.id]
  );
  const agent = result.rows[0];
  if (!agent) return NextResponse.json({ detail: 'Agent not found' }, { status: 404 });
  
  if (agent.container_id) {
    try { await deleteContainer(agent.container_id); } catch (e) { console.error(e); }
  }
  
  await query(
    "UPDATE agents SET status = 'DELETED', container_id = NULL, port = NULL WHERE id = $1",
    [id]
  );
  
  return NextResponse.json({ id, status: 'DELETED' });
}
