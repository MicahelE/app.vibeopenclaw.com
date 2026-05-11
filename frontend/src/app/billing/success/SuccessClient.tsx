'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { confirmCheckout } from '@/lib/api';
import { useAuth } from '@/lib/auth';

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
          setStatus('active');
          setMessage('Payment confirmed. Redirecting to your dashboard...');
          setTimeout(() => router.push('/dashboard'), 900);
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
        <div className={`w-10 h-10 mx-auto mb-5 rounded-full border-2 ${
          status === 'active' ? 'border-[#00e5cc]' : status === 'error' ? 'border-[#ff4d4d]' : 'border-[#8892b0] border-t-transparent animate-spin'
        }`} />
        <h1 className="text-xl font-bold mb-2" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
          {status === 'active' ? 'Payment Confirmed' : status === 'error' ? 'Payment Check Failed' : 'Checking Payment'}
        </h1>
        <p className="text-sm text-[#8892b0] mb-6">{message}</p>
        {status !== 'checking' && status !== 'active' && (
          <Link
            href="/dashboard/billing"
            className="inline-flex px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
            style={{
              fontFamily: '"Clash Display", system-ui, sans-serif',
              background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)',
            }}
          >
            Back to Billing
          </Link>
        )}
      </div>
    </div>
  );
}
