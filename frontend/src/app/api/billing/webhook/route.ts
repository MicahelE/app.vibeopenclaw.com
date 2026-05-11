import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { normalizePlan, planTier } from '@/lib/billing';

type PolarWebhookEvent = {
  type?: string;
  data?: {
    id?: string;
    metadata?: Record<string, unknown>;
    customerMetadata?: Record<string, unknown>;
  };
};

export async function POST(req: NextRequest) {
  if (!process.env.POLAR_WEBHOOK_SECRET) {
    return NextResponse.json({ status: 'skipped', detail: 'Webhook not configured — event acknowledged but not processed.' });
  }

  const { polar } = await import('@/lib/polar');

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

    const { type, data } = event as PolarWebhookEvent;

    if (type === 'subscription.active' && data) {
      const userId = data.metadata?.user_id || data.customerMetadata?.user_id;
      if (userId) {
        const plan = normalizePlan(data.metadata?.plan);
        await query(
          "UPDATE users SET subscription_id = $1, subscription_status = 'ACTIVE', plan_tier = $2 WHERE id = $3",
          [data.id, planTier(plan), String(userId)]
        );
      }
    } else if ((type === 'subscription.canceled' || type === 'subscription.revoked') && data) {
      const userId = data.metadata?.user_id || data.customerMetadata?.user_id;
      if (userId) {
        await query(
          "UPDATE users SET subscription_status = 'CANCELED', plan_tier = 'PRO' WHERE id = $1",
          [String(userId)]
        );
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err: unknown) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ detail: err instanceof Error ? err.message : 'Webhook handler failed' }, { status: 500 });
  }
}
