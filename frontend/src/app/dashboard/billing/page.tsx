'use client';

import { useState } from 'react';
import { createCheckout, createPortal } from '@/lib/api';

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubscribe(plan: string) {
    setError('');
    setLoading(true);
    try {
      const data = await createCheckout(plan);
      if (data.checkout_url) window.location.href = data.checkout_url;
    } catch (err: any) {
      setError(err.message || 'Failed to start checkout');
    } finally {
      setLoading(false);
    }
  }

  async function handlePortal() {
    setError('');
    setLoading(true);
    try {
      const data = await createPortal();
      if (data.portal_url) window.location.href = data.portal_url;
    } catch (err: any) {
      setError(err.message || 'Failed to open portal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-[#f0f4ff] mb-6" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Billing</h1>

      {error && (
        <div className="bg-[rgba(255,77,77,0.15)] text-[#ff4d4d] p-3 rounded-xl mb-4 text-sm border border-[rgba(255,77,77,0.3)]">{error}</div>
      )}

      <div className="grid md:grid-cols-2 gap-5 mb-8 max-w-2xl">
        <div className="glass-card rounded-2xl p-8 transition-all hover:-translate-y-1 hover:border-[rgba(255,77,77,0.2)]">
          <h2 className="text-lg font-semibold text-[#f0f4ff] mb-2" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Pro</h2>
          <p className="text-3xl font-bold text-[#f0f4ff] mb-1">$60<span className="text-sm font-normal text-[#5a6480]">/mo</span></p>
          <ul className="space-y-2.5 text-sm text-[#8892b0] mb-6 mt-4">
            {['1 AI Agent', '1.5 GB RAM', 'BYOK', 'Discord & Telegram', 'Email Support'].map((item, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#00e5cc] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe('pro')}
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,77,0.35)] active:translate-y-0"
            style={{
              fontFamily: '"Clash Display", system-ui, sans-serif',
              background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)',
              boxShadow: '0 4px 20px rgba(255,77,77,0.25)',
            }}
          >
            Subscribe to Pro
          </button>
        </div>

        <div className="glass-card rounded-2xl p-8 relative overflow-hidden transition-all hover:-translate-y-1 hover:border-[rgba(255,77,77,0.2)]">
          <div className="absolute top-0 right-0 bg-[#ff4d4d] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Popular</div>
          <h2 className="text-lg font-semibold text-[#f0f4ff] mb-2" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Premium</h2>
          <p className="text-3xl font-bold text-[#f0f4ff] mb-1">$100<span className="text-sm font-normal text-[#5a6480]">/mo</span></p>
          <ul className="space-y-2.5 text-sm text-[#8892b0] mb-6 mt-4">
            {['3 AI Agents', '3 GB RAM each', 'BYOK', 'All Channels + Slack', 'Priority Support', 'Usage Analytics'].map((item, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#00e5cc] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe('premium')}
            disabled={loading}
            className="w-full py-3 rounded-xl text-[#050810] font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)] active:translate-y-0 bg-white"
            style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
          >
            Subscribe to Premium
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-[rgba(136,146,176,0.15)]">
        <h2 className="text-base font-semibold text-[#f0f4ff] mb-1" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Manage Subscription</h2>
        <p className="text-sm text-[#5a6480] mb-4">Update payment method, view invoices, or cancel your subscription.</p>
        <button
          onClick={handlePortal}
          disabled={loading}
          className="px-4 py-2.5 border border-[rgba(136,146,176,0.2)] rounded-xl text-[#8892b0] text-sm hover:text-[#f0f4ff] hover:border-[rgba(136,146,176,0.4)] transition-colors"
        >
          Open Customer Portal
        </button>
      </div>
    </div>
  );
}
