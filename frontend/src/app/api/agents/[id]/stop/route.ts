import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { stopContainer, getContainerStatus } from '@/lib/docker';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
  
  const { id } = await params;
  const result = await query(
    'SELECT container_id, status FROM agents WHERE id = $1 AND user_id = $2',
    [id, user.id]
  );
  const agent = result.rows[0];
  if (!agent) return NextResponse.json({ detail: 'Agent not found' }, { status: 404 });
  
  if (agent.container_id) {
    try { await stopContainer(agent.container_id); } catch (e) { console.error(e); }
  }
  
  await query("UPDATE agents SET status = 'STOPPED' WHERE id = $1", [id]);
  return NextResponse.json({ id, status: 'STOPPED' });
}
