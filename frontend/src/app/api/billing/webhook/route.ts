import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { polar, POLAR_WEBHOOK_SECRET } from '@/lib/polar';

export async function POST(req: NextRequest) {
  if (!POLAR_WEBHOOK_SECRET) {
    return NextResponse.json({ detail: 'Webhook secret not configured' }, { status: 500 });
  }

  try {
    const body = await req.text();
    const event = await polar.validateWebhook({
      request: {
        body,
        method: req.method,
        url: req.url,
        headers: Object.fromEntries(req.headers.entries()),
      },
    });

    const type = (event as any).type;

    if (type === 'subscription.active') {
      const data = (event as any).data;
      const userId = data.metadata?.user_id || data.customerMetadata?.user_id;
      if (userId) {
        await query(
          "UPDATE users SET subscription_id = $1, subscription_status = 'active' WHERE id = $2",
          [data.id, userId]
        );
      }
    } else if (type === 'subscription.canceled' || type === 'subscription.revoked') {
      const data = (event as any).data;
      const userId = data.metadata?.user_id || data.customerMetadata?.user_id;
      if (userId) {
        await query(
          "UPDATE users SET subscription_status = 'canceled', plan_tier = 'pro' WHERE id = $1",
          [userId]
        );
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ detail: err.message }, { status: 500 });
  }
}
