// Single source of truth for plan pricing + specs.
// The DISPLAYED price lives here; the CHARGED price lives on the Polar product
// (keyed by POLAR_PRODUCT_PRO / POLAR_PRODUCT_PREMIUM). Keep the two in sync —
// when you change a number here, update the matching Polar product price.

export type PlanId = 'pro' | 'premium';

export interface Plan {
  id: PlanId;
  tier: 'PRO' | 'PREMIUM';
  name: string;
  /** Monthly price in whole USD. */
  monthly: number;
  ram: string;
  agents: number;
  /** Short feature bullets shown on pricing cards. */
  features: string[];
  /** Channels available on this plan. */
  channels: string;
}

export const PLANS: Record<PlanId, Plan> = {
  pro: {
    id: 'pro',
    tier: 'PRO',
    name: 'Pro',
    monthly: 24,
    ram: '2 GB',
    agents: 1,
    channels: 'Telegram & Discord',
    features: ['1 OpenClaw Agent', '2 GB RAM', 'BYOK — Bring Your Own Keys', 'Telegram & Discord', 'Email Support'],
  },
  premium: {
    id: 'premium',
    tier: 'PREMIUM',
    name: 'Premium',
    monthly: 48,
    ram: '4 GB',
    agents: 3,
    channels: 'All channels incl. Slack',
    features: ['3 OpenClaw or Hermes Agents', '4 GB RAM each', 'BYOK — Bring Your Own Keys', 'All Channels + Slack', 'Priority Support', 'Usage Analytics'],
  },
};

/** Lowest plan price — for "from $X/mo" copy. */
export const STARTING_PRICE = PLANS.pro.monthly;

/** "$24" */
export function priceUSD(plan: PlanId): string {
  return `$${PLANS[plan].monthly}`;
}

/** "$24/mo" */
export function priceMonthly(plan: PlanId): string {
  return `$${PLANS[plan].monthly}/mo`;
}
