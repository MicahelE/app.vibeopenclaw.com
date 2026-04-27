import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
  
  const { id } = await params;
  const result = await query(
    'DELETE FROM api_keys WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, user.id]
  );
  
  if (result.rowCount === 0) {
    return NextResponse.json({ detail: 'API key not found' }, { status: 404 });
  }
  
  return NextResponse.json({ message: 'API key deleted' });
}
