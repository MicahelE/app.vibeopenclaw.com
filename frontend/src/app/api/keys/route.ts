import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { encrypt } from '@/lib/encrypt';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
  
  const result = await query(
    'SELECT id, provider, is_active, created_at FROM api_keys WHERE user_id = $1',
    [user.id]
  );
  
  return NextResponse.json(result.rows.map(k => ({
    id: k.id,
    provider: k.provider,
    is_active: k.is_active,
    created_at: k.created_at,
  })));
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
  
  try {
    const { searchParams } = new URL(req.url);
    const provider = searchParams.get('provider');
    const key = searchParams.get('key');
    
    if (!provider || !key) {
      return NextResponse.json({ detail: 'Provider and key required' }, { status: 400 });
    }
    
    const existing = await query(
      'SELECT id FROM api_keys WHERE user_id = $1 AND provider = $2',
      [user.id, provider]
    );
    
    const encryptedKey = encrypt(key);
    
    if (existing.rows.length > 0) {
      await query(
        'UPDATE api_keys SET encrypted_key = $1, is_active = true WHERE id = $2',
        [encryptedKey, existing.rows[0].id]
      );
      return NextResponse.json({ id: existing.rows[0].id, provider, message: 'API key updated' });
    }
    
    const id = uuidv4();
    await query(
      'INSERT INTO api_keys (id, user_id, provider, encrypted_key) VALUES ($1, $2, $3, $4)',
      [id, user.id, provider, encryptedKey]
    );
    
    return NextResponse.json({ id, provider, message: 'API key added' });
  } catch (err: any) {
    console.error('Add key error:', err);
    return NextResponse.json({ detail: err.message }, { status: 500 });
  }
}
