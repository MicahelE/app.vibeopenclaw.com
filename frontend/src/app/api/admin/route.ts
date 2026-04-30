import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isAdmin } from '@/lib/admin';
import { getContainerStatus } from '@/lib/docker';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
  if (!isAdmin(user.email)) return NextResponse.json({ detail: 'Forbidden' }, { status: 403 });

  const [users, agents, keys, recentAgents] = await Promise.all([
    query(
      `SELECT plan_tier, COALESCE(subscription_status, 'none') AS subscription_status, COUNT(*)::int AS count
       FROM users
       GROUP BY plan_tier, subscription_status
       ORDER BY count DESC`
    ),
    query(
      `SELECT agent_type, status, COUNT(*)::int AS count
       FROM agents
       GROUP BY agent_type, status
       ORDER BY agent_type, status`
    ),
    query(
      `SELECT provider, is_active, COUNT(*)::int AS count
       FROM api_keys
       GROUP BY provider, is_active
       ORDER BY provider`
    ),
    query(
      `SELECT a.id, a.name, a.agent_type, a.status, a.port, a.container_id,
              a.model_provider, a.model_name, a.created_at,
              u.email AS user_email
       FROM agents a
       JOIN users u ON u.id = a.user_id
       WHERE a.status != 'DELETED'
       ORDER BY a.created_at DESC
       LIMIT 30`
    ),
  ]);

  const recent = await Promise.all(
    recentAgents.rows.map(async (a) => {
      let container: Awaited<ReturnType<typeof getContainerStatus>> = null;
      if (a.container_id) {
        try {
          container = await getContainerStatus(a.container_id);
        } catch {}
      }
      return {
        id: a.id,
        name: a.name,
        type: a.agent_type,
        status: a.status,
        port: a.port,
        model: `${a.model_provider}/${a.model_name}`,
        user_email: a.user_email,
        created_at: a.created_at,
        container,
      };
    })
  );

  const totals = {
    users: users.rows.reduce((sum, r) => sum + r.count, 0),
    agents_active: agents.rows
      .filter((r) => r.status === 'RUNNING' || r.status === 'STOPPED')
      .reduce((sum, r) => sum + r.count, 0),
    agents_error: agents.rows.filter((r) => r.status === 'ERROR').reduce((sum, r) => sum + r.count, 0),
    api_keys: keys.rows.reduce((sum, r) => sum + r.count, 0),
  };

  return NextResponse.json({
    totals,
    breakdown: {
      users: users.rows,
      agents: agents.rows,
      keys: keys.rows,
    },
    recent_agents: recent,
  });
}
