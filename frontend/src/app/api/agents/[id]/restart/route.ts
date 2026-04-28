import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { restartContainer, getContainerPort } from '@/lib/docker';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
  
  const { id } = await params;
  const result = await query(
    'SELECT container_id, agent_type FROM agents WHERE id = $1 AND user_id = $2',
    [id, user.id]
  );
  const agent = result.rows[0];
  if (!agent) return NextResponse.json({ detail: 'Agent not found' }, { status: 404 });
  
  if (agent.container_id) {
    try { await restartContainer(agent.container_id); } catch (e) { console.error(e); }
    const internalPort = agent.agent_type === 'OPENCLAW' ? 18789 : 8642;
    const hostPort = await getContainerPort(agent.container_id, internalPort);
    await query(
      "UPDATE agents SET status = 'RUNNING', port = $1, last_started_at = NOW() WHERE id = $2",
      [hostPort, id]
    );
    return NextResponse.json({ id, status: 'RUNNING', port: hostPort });
  }
  
  return NextResponse.json({ id, status: agent.status });
}
