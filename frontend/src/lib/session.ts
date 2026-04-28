import { NextRequest } from 'next/server';
import { verifyToken } from './jwt';
import { query } from './db';

export async function getCurrentUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const payload = await verifyToken(token);
  if (!payload?.sub) return null;

  const result = await query(
    'SELECT id, email, name, plan_tier, subscription_status, subscription_id FROM users WHERE id = $1',
    [payload.sub]
  );

  return result.rows[0] || null;
}
