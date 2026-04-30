import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  if (!process.env.POLAR_WEBHOOK_SECRET) {
    return NextResponse.json({ status: 'skipped', detail: 'Webhook not configured — event acknowledged but not processed.' });
  }

  const { polar, POLAR_WEBHOOK_SECRET } = await import('@/lib/polar');

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
          "UPDATE users SET subscription_id = $1, subscription_status = 'ACTIVE' WHERE id = $2",
          [data.id, userId]
        );
      }
    } else if (type === 'subscription.canceled' || type === 'subscription.revoked') {
      const data = (event as any).data;
      const userId = data.metadata?.user_id || data.customerMetadata?.user_id;
      if (userId) {
        await query(
          "UPDATE users SET subscription_status = 'CANCELED', plan_tier = 'PRO' WHERE id = $1",
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