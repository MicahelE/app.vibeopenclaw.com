import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { polar } from '@/lib/polar';
import { normalizePlan, planForProduct, planTier } from '@/lib/billing';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  if (!process.env.POLAR_ACCESS_TOKEN) {
    return NextResponse.json({ detail: 'Billing is not configured yet.' }, { status: 503 });
  }

  const checkoutId = req.nextUrl.searchParams.get('checkout_id');
  if (!checkoutId) {
    return NextResponse.json({ detail: 'checkout_id is required' }, { status: 400 });
  }

  try {
    const checkout = await polar.checkouts.get({ id: checkoutId });
    const metadataUserId = typeof checkout.metadata?.user_id === 'string' ? checkout.metadata.user_id : null;
    const ownerMatches = metadataUserId === user.id || checkout.externalCustomerId === user.id;
    if (!ownerMatches) {
      return NextResponse.json({ detail: 'Checkout does not belong to this user' }, { status: 403 });
    }

    if (checkout.status !== 'succeeded') {
      return NextResponse.json({
        status: checkout.status,
        active: false,
        detail: 'Checkout has not succeeded yet.',
      });
    }

    const metadataPlan = typeof checkout.metadata?.plan === 'string' ? normalizePlan(checkout.metadata.plan) : null;
    const productPlan = planForProduct(checkout.productId);
    const plan = metadataPlan || productPlan || normalizePlan(user.plan_tier);
    const customerId = checkout.customerId || user.polar_customer_id || null;
    const subscriptionId = checkout.subscriptionId || user.subscription_id || null;

    await query(
      `UPDATE users
       SET plan_tier = $1,
           subscription_status = 'ACTIVE',
           subscription_id = COALESCE($2, subscription_id),
           polar_customer_id = COALESCE($3, polar_customer_id)
       WHERE id = $4`,
      [planTier(plan), subscriptionId, customerId, user.id]
    );

    return NextResponse.json({
      status: checkout.status,
      active: true,
      plan,
      subscription_id: subscriptionId,
    });
  } catch (err: unknown) {
    console.error('Checkout confirm error:', err);
    return NextResponse.json({ detail: err instanceof Error ? err.message : 'Could not confirm checkout' }, { status: 500 });
  }
}
