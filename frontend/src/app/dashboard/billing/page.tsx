'use client';

import { useState } from 'react';
import { createCheckout, createPortal } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { capture } from '@/lib/analytics';
import { Button, Badge, useToast, FONT_DISPLAY } from '@/components/ui';
import { PLANS, type PlanId } from '@/content/pricing';

export default function BillingPage() {
  // `pending` holds the in-flight action so only the clicked button spins.
  const [pending, setPending] = useState<PlanId | 'portal' | null>(null);
  const { user } = useAuth();
  const { error } = useToast();

  const isActive = user?.subscription_status === 'ACTIVE';
  // Current tier from the subscription data the page already loads.
  const currentTier = isActive ? user?.plan_tier : undefined;
  const isCurrent = (plan: PlanId) => currentTier === PLANS[plan].tier;

  async function handleSubscribe(plan: PlanId) {
    capture('checkout_started', { plan });
    setPending(plan);
    try {
      const data = await createCheckout(plan);
      if (data.checkout_url) window.location.href = data.checkout_url;
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Failed to start checkout');
    } finally {
      setPending(null);
    }
  }

  async function handlePortal() {
    setPending('portal');
    try {
      const data = await createPortal();
      if (data.portal_url) window.location.href = data.portal_url;
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Failed to open portal');
    } finally {
      setPending(null);
    }
  }

  // Bullet feature list for a plan card.
  const features: Record<PlanId, string[]> = {
    pro: ['1 AI Agent', '2 GB RAM', 'BYOK', 'Discord & Telegram', 'Email Support'],
    premium: ['3 AI Agents', '4 GB RAM each', 'BYOK', 'All Channels + Slack', 'Priority Support', 'Usage Analytics'],
  };

  // Button label for a card given the current tier.
  function ctaLabel(plan: PlanId): string {
    if (isCurrent(plan)) return 'Current Plan';
    if (plan === 'premium' && currentTier === 'PRO') return 'Upgrade to Premium';
    if (plan === 'pro' && currentTier === 'PREMIUM') return 'Switch to Pro';
    return `Subscribe to ${PLANS[plan].name}`;
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-[#f0f4ff] mb-2" style={{ fontFamily: FONT_DISPLAY }}>Billing</h1>
      <p className="text-sm text-[#5a6480] mb-6">
        {isActive
          ? `Your ${user?.plan_tier?.toLowerCase()} subscription is active.`
          : 'A subscription is required to create new agents. Existing agents stay viewable and manageable.'}
      </p>

      {!isActive && (
        <div className="bg-[rgba(255,193,7,0.12)] text-[#ffd166] p-3 rounded-xl mb-4 text-sm border border-[rgba(255,193,7,0.25)]">
          Choose a plan and complete Polar checkout to unlock new agent creation.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5 mb-8 max-w-2xl">
        <div className="glass-card rounded-2xl p-8 transition-all hover:-translate-y-1 hover:border-[rgba(255,77,77,0.2)]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-[#f0f4ff]" style={{ fontFamily: FONT_DISPLAY }}>Pro</h2>
            {isCurrent('pro') && <Badge tone="cyan">Current Plan</Badge>}
          </div>
          <p className="text-3xl font-bold text-[#f0f4ff] mb-1">${PLANS.pro.monthly}<span className="text-sm font-normal text-[#5a6480]">/mo</span></p>
          <ul className="space-y-2.5 text-sm text-[#8892b0] mb-6 mt-4">
            {features.pro.map((item, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#00e5cc] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <Button
            variant="primary"
            fullWidth
            size="lg"
            loading={pending === 'pro'}
            disabled={isCurrent('pro') || pending !== null}
            onClick={() => handleSubscribe('pro')}
          >
            {ctaLabel('pro')}
          </Button>
        </div>

        <div className="glass-card rounded-2xl p-8 relative overflow-hidden transition-all hover:-translate-y-1 hover:border-[rgba(255,77,77,0.2)]">
          <div className="absolute top-0 right-0 bg-[#ff4d4d] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Popular</div>
          <div className="flex items-center justify-between mb-2 pr-16">
            <h2 className="text-lg font-semibold text-[#f0f4ff]" style={{ fontFamily: FONT_DISPLAY }}>Premium</h2>
            {isCurrent('premium') && <Badge tone="cyan">Current Plan</Badge>}
          </div>
          <p className="text-3xl font-bold text-[#f0f4ff] mb-1">${PLANS.premium.monthly}<span className="text-sm font-normal text-[#5a6480]">/mo</span></p>
          <ul className="space-y-2.5 text-sm text-[#8892b0] mb-6 mt-4">
            {features.premium.map((item, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#00e5cc] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <Button
            variant="secondary"
            fullWidth
            size="lg"
            loading={pending === 'premium'}
            disabled={isCurrent('premium') || pending !== null}
            onClick={() => handleSubscribe('premium')}
          >
            {ctaLabel('premium')}
          </Button>
        </div>
      </div>

      {isActive && (
        <div className="glass-card rounded-2xl p-6 border border-[rgba(136,146,176,0.15)]">
          <h2 className="text-base font-semibold text-[#f0f4ff] mb-1" style={{ fontFamily: FONT_DISPLAY }}>Manage Subscription</h2>
          <p className="text-sm text-[#5a6480] mb-4">Update payment method, view invoices, or cancel your subscription.</p>
          <Button
            variant="ghost"
            loading={pending === 'portal'}
            disabled={pending !== null}
            onClick={handlePortal}
          >
            Open Customer Portal
          </Button>
        </div>
      )}
    </div>
  );
}
