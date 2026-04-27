import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, createToken } from '@/lib/jwt';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const password = searchParams.get('password');
    const name = searchParams.get('name');
    
    if (!email || !password) {
      return NextResponse.json({ detail: 'Email and password required' }, { status: 400 });
    }
    
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ detail: 'Email already registered' }, { status: 400 });
    }
    
    const id = uuidv4();
    const passwordHash = await hashPassword(password);
    
    await query(
      'INSERT INTO users (id, email, password_hash, name, plan_tier) VALUES ($1, $2, $3, $4, $5)',
      [id, email, passwordHash, name || null, 'PRO']
    );
    
    const token = await createToken({ sub: id });
    return NextResponse.json({ access_token: token, token_type: 'bearer', user_id: id });
  } catch (err: any) {
    console.error('Register error:', err);
    return NextResponse.json({ detail: err.message || 'Registration failed' }, { status: 500 });
  }
}
