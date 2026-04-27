import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature') || '';
  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ detail: 'Webhook secret not configured' }, { status: 500 });
  }
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return NextResponse.json({ detail: err.message }, { status: 400 });
  }
  
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const userId = session.metadata?.user_id;
      if (userId) {
        await query(
          "UPDATE users SET subscription_id = $1, subscription_status = 'active' WHERE id = $2",
          [session.subscription, userId]
        );
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as any;
      await query(
        "UPDATE users SET subscription_status = 'canceled', plan_tier = 'pro' WHERE subscription_id = $1",
        [subscription.id]
      );
    }
  } catch (err: any) {
    console.error('Webhook handler error:', err);
  }
  
  return NextResponse.json({ status: 'ok' });
}
