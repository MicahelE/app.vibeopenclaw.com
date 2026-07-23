import type { Metadata } from 'next';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { H2, P, FeatureGrid, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, jsonLd } from '@/components/marketing/schema';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/security';

export const metadata: Metadata = {
  title: 'Security | VibeOpenClaw',
  description: 'How VibeOpenClaw protects your account, provider keys, and agents: encryption at rest, per-agent Docker isolation, and true BYOK.',
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}${PATH}`,
    title: 'Security | VibeOpenClaw',
    description: 'How VibeOpenClaw protects your account, provider keys, and agents.',
  },
};

const CONTROLS = [
  { title: 'Keys encrypted at rest', body: 'Model-provider API keys you add are encrypted at rest with AES-256-GCM before being stored.' },
  { title: 'Per-agent Docker isolation', body: 'Every agent runs in its own Docker container, separate from other users’ agents and from the host.' },
  { title: 'Hashed passwords', body: 'Account passwords are hashed with bcrypt (cost factor 12) — we never store or can recover your plaintext password.' },
  { title: 'HTTPS everywhere', body: 'All traffic to the app and to your agent’s public endpoint is served over HTTPS.' },
  { title: 'Token-based sessions', body: 'Sign-in uses signed JWT session tokens rather than server-side session state.' },
  { title: 'True BYOK', body: 'You bring your own model-provider keys. We route your agent’s requests to your provider — we don’t proxy, log, or mark up your inference traffic.' },
];

export default function SecurityPage() {
  return (
    <MarketingShell width={760}>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Security' }]} />

      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
          Security
        </h1>
        <p className="text-sm text-[#5a6480]">Last updated: July 23, 2026</p>
      </header>

      <P>
        This page lists the concrete security controls VibeOpenClaw runs today. We&apos;d rather list six things
        that are actually true than a longer list that isn&apos;t.
      </P>

      <H2>Controls in place</H2>
      <FeatureGrid features={CONTROLS} />

      <H2>Responsible disclosure</H2>
      <P>
        If you find a security issue, we want to know. Email{' '}
        <a href="mailto:security@vibeopenclaw.com" className="text-[#00e5cc] hover:underline">security@vibeopenclaw.com</a>{' '}
        with details and, if possible, steps to reproduce. We&apos;ll respond and work with you on a fix before any
        public disclosure.
      </P>

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Security', path: PATH }]),
        )}
      />
    </MarketingShell>
  );
}
