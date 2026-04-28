import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { polar } from '@/lib/polar';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  if (!process.env.POLAR_ACCESS_TOKEN) {
    return NextResponse.json({ detail: 'Polar not configured' }, { status: 500 });
  }

  try {
    const session = await polar.customerSessions.create({
      externalCustomerId: user.id,
    });

    return NextResponse.json({ portal_url: session.customerPortalUrl });
  } catch (err: any) {
    console.error('Portal error:', err);
    return NextResponse.json({ detail: err.message }, { status: 500 });
  }
}
