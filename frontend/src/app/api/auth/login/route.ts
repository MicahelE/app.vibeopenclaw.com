import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, createToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    if (!email || !password) {
      return NextResponse.json({ detail: 'Email and password required' }, { status: 400 });
    }
    
    const result = await query('SELECT id, password_hash FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return NextResponse.json({ detail: 'Incorrect email or password' }, { status: 400 });
    }
    
    const token = await createToken({ sub: user.id });
    return NextResponse.json({ access_token: token, token_type: 'bearer', user_id: user.id });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ detail: err.message || 'Login failed' }, { status: 500 });
  }
}
