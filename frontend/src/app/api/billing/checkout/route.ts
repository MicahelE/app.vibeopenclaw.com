import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { polar, POLAR_PRODUCT_PRO, POLAR_PRODUCT_PREMIUM } from '@/lib/polar';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  try {
    const body = await req.json();
    const plan = body.plan;

    if (!process.env.POLAR_ACCESS_TOKEN) {
      return NextResponse.json({ detail: 'Billing is not configured yet. Please try again later.' }, { status: 503 });
    }

    const productId = plan === 'premium' ? POLAR_PRODUCT_PREMIUM : POLAR_PRODUCT_PRO;
    if (!productId) {
      return NextResponse.json({ detail: 'Product not configured' }, { status: 500 });
    }

    const checkout = await polar.checkouts.create({
      products: [productId],
      customerEmail: user.email,
      customerName: user.name || undefined,
      metadata: { user_id: user.id },
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com'}/dashboard?success=true`,
    });

    return NextResponse.json({ checkout_url: checkout.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    const msg = err.message || 'Checkout failed';
    if (msg.includes('not a valid email')) {
      return NextResponse.json({ detail: 'Please use a real email address to subscribe.' }, { status: 400 });
    }
    return NextResponse.json({ detail: msg }, { status: 500 });
  }
}