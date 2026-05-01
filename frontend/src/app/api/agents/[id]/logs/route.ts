import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { getContainerLogs } from '@/lib/docker';

const MAX_TAIL = 500;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  const result = await query(
    'SELECT container_id FROM agents WHERE id = $1 AND user_id = $2',
    [id, user.id]
  );
  const agent = result.rows[0];
  if (!agent) return NextResponse.json({ detail: 'Agent not found' }, { status: 404 });
  if (!agent.container_id) {
    return NextResponse.json({ logs: '', detail: 'No container yet' });
  }

  const tailParam = parseInt(new URL(req.url).searchParams.get('tail') || '200', 10);
  const tail = Math.min(Math.max(20, isNaN(tailParam) ? 200 : tailParam), MAX_TAIL);

  try {
    const logs = await getContainerLogs(agent.container_id, tail);
    return NextResponse.json({ logs, tail });
  } catch (err: any) {
    return NextResponse.json({ detail: err?.message || 'Failed to read logs' }, { status: 500 });
  }
}
