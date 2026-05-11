import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { polar } from '@/lib/polar';
import { normalizePlan, productForPlan } from '@/lib/billing';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  try {
    const body = await req.json();
    const plan = normalizePlan(body.plan || user.plan_tier);

    if (!process.env.POLAR_ACCESS_TOKEN) {
      return NextResponse.json({ detail: 'Billing is not configured yet. Please try again later.' }, { status: 503 });
    }

    const productId = productForPlan(plan);
    if (!productId) {
      return NextResponse.json({ detail: 'Product not configured' }, { status: 500 });
    }

    const checkout = await polar.checkouts.create({
      products: [productId],
      customerEmail: user.email,
      customerName: user.name || undefined,
      externalCustomerId: user.id,
      metadata: { user_id: user.id, plan },
      customerMetadata: { user_id: user.id },
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com'}/billing/success?checkout_id={CHECKOUT_ID}`,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com'}/dashboard/billing`,
    });

    return NextResponse.json({ checkout_url: checkout.url });
  } catch (err: unknown) {
    console.error('Checkout error:', err);
    const msg = err instanceof Error ? err.message : 'Checkout failed';
    if (msg.includes('not a valid email')) {
      return NextResponse.json({ detail: 'Please use a real email address to subscribe.' }, { status: 400 });
    }
    return NextResponse.json({ detail: msg }, { status: 500 });
  }
}
