'use client';

import posthog from 'posthog-js';

// Typed, safe wrappers around PostHog. Every call no-ops if PostHog wasn't
// initialised (no env key) or runs on the server, so callers never need to guard.

function ready(): boolean {
  return typeof window !== 'undefined' && posthog.__loaded === true;
}

/** Funnel events we explicitly track. Keep names stable — dashboards depend on them. */
export type AnalyticsEvent =
  | 'signup_submitted'
  | 'signup_succeeded'
  | 'login_succeeded'
  | 'agent_create_started'
  | 'agent_created'
  | 'apikey_added'
  | 'apikey_tested'
  | 'checkout_started'
  | 'checkout_succeeded';

export function capture(event: AnalyticsEvent, props?: Record<string, unknown>) {
  if (!ready()) return;
  posthog.capture(event, props);
}

export function identifyUser(id: string, props?: Record<string, unknown>) {
  if (!ready()) return;
  posthog.identify(id, props);
}

export function resetAnalytics() {
  if (!ready()) return;
  posthog.reset();
}

export function capturePageview(url: string) {
  if (!ready()) return;
  posthog.capture('$pageview', { $current_url: url });
}
