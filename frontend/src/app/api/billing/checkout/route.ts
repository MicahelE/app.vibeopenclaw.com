import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { stripe, STRIPE_PRICE_PRO, STRIPE_PRICE_PREMIUM } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
  
  try {
    const body = await req.json();
    const plan = body.plan;
    
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ detail: 'Stripe not configured' }, { status: 500 });
    }
    
    const priceId = plan === 'premium' ? STRIPE_PRICE_PREMIUM : STRIPE_PRICE_PRO;
    if (!priceId) {
      return NextResponse.json({ detail: 'Price ID not configured' }, { status: 500 });
    }
    
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
      });
      customerId = customer.id;
      await query('UPDATE users SET stripe_customer_id = $1 WHERE id = $2', [customerId, user.id]);
    }
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com'}/dashboard?canceled=true`,
      metadata: { user_id: user.id },
    });
    
    return NextResponse.json({ checkout_url: session.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ detail: err.message }, { status: 500 });
  }
}
