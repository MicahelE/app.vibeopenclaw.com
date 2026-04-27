import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
  
  if (!user.stripe_customer_id) {
    return NextResponse.json({ detail: 'No subscription found' }, { status: 400 });
  }
  
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com'}/dashboard`,
    });
    
    return NextResponse.json({ portal_url: session.url });
  } catch (err: any) {
    console.error('Portal error:', err);
    return NextResponse.json({ detail: err.message }, { status: 500 });
  }
}
