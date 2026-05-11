import { POLAR_PRODUCT_PREMIUM, POLAR_PRODUCT_PRO } from './polar';

export type BillingPlan = 'pro' | 'premium';

export function normalizePlan(plan: unknown): BillingPlan {
  return String(plan).toLowerCase() === 'premium' ? 'premium' : 'pro';
}

export function planTier(plan: BillingPlan): 'PRO' | 'PREMIUM' {
  return plan === 'premium' ? 'PREMIUM' : 'PRO';
}

export function productForPlan(plan: BillingPlan): string {
  return plan === 'premium' ? POLAR_PRODUCT_PREMIUM : POLAR_PRODUCT_PRO;
}

export function planForProduct(productId: string | null | undefined): BillingPlan | null {
  if (productId && productId === POLAR_PRODUCT_PREMIUM) return 'premium';
  if (productId && productId === POLAR_PRODUCT_PRO) return 'pro';
  return null;
}

export function hasActiveSubscription(user: { subscription_status?: string | null }) {
  return user.subscription_status === 'ACTIVE';
}
