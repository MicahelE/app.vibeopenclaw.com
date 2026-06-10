'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { confirmCheckout } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { capture } from '@/lib/analytics';
import { ButtonLink, Spinner, FONT_DISPLAY } from '@/components/ui';

export default function SuccessClient({ checkoutId }: { checkoutId?: string }) {
  const router = useRouter();
  const { refreshUser, isLoading, user } = useAuth();
  const [status, setStatus] = useState<'checking' | 'active' | 'pending' | 'error'>(
    checkoutId ? 'checking' : 'error'
  );
  const [message, setMessage] = useState(
    checkoutId ? 'Confirming your Polar checkout...' : 'Missing checkout ID. Open billing and start checkout again.'
  );

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/');
      return;
    }
    if (!checkoutId) return;

    confirmCheckout(checkoutId)
      .then(async (res) => {
        if (res.active) {
          await refreshUser();
          capture('checkout_succeeded');
          setStatus('active');
          setMessage('Payment confirmed. Redirecting to your dashboard...');
          setTimeout(() => router.push('/dashboard'), 2500);
          return;
        }
        setStatus('pending');
        setMessage(res.detail || 'Checkout is not complete yet.');
      })
      .catch((err: unknown) => {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Could not confirm checkout.');
      });
  }, [checkoutId, isLoading, refreshUser, router, user]);

  return (
    <div className="min-h-screen bg-[#050810] text-[#f0f4ff] relative flex items-center justify-center p-6">
      <div className="stars" />
      <div className="nebula" />
      <div className="relative z-10 glass-card rounded-2xl p-8 border border-[rgba(136,146,176,0.15)] max-w-md w-full text-center">
        <div className="mb-5 flex justify-center">
          {status === 'checking' ? (
            <Spinner size="lg" />
          ) : (
            <div
              className={`w-10 h-10 rounded-full border-2 ${
                status === 'active' ? 'border-[#00e5cc]' : 'border-[#ff4d4d]'
              }`}
            />
          )}
        </div>
        <h1 className="text-xl font-bold mb-2" style={{ fontFamily: FONT_DISPLAY }}>
          {status === 'active' ? 'Payment Confirmed' : status === 'error' ? 'Payment Check Failed' : 'Checking Payment'}
        </h1>
        <p className="text-sm text-[#8892b0] mb-6">{message}</p>
        {status === 'pending' && <ButtonLink href="/dashboard">Go to dashboard</ButtonLink>}
        {status === 'error' && <ButtonLink href="/dashboard/billing">Back to billing</ButtonLink>}
      </div>
    </div>
  );
}
