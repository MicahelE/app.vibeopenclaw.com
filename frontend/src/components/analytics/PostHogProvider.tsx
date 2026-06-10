'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { capturePageview } from '@/lib/analytics';

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

let initialised = false;

function initPostHog() {
  if (initialised || !KEY || typeof window === 'undefined') return;
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: false, // we fire $pageview manually on route change (App Router)
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
    session_recording: {
      // Never record secrets: password + API-key inputs are masked.
      maskAllInputs: false,
      maskInputOptions: { password: true },
    },
    // Mask any element explicitly marked .ph-no-capture (see token/key inputs).
    mask_all_text: false,
  });
  initialised = true;
}

/** Fires $pageview on every client-side navigation. Wrapped in Suspense for useSearchParams. */
function PageviewTracker() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const qs = search?.toString();
    capturePageview(window.location.origin + pathname + (qs ? `?${qs}` : ''));
  }, [pathname, search]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </>
  );
}
