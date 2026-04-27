import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { getContainerStatus, getContainerPort, deleteContainer, startContainer, stopContainer, restartContainer } from '@/lib/docker';

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
