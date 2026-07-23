import type { Metadata } from 'next';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { H2, P, FeatureGrid, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, jsonLd } from '@/components/marketing/schema';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/privacy';

export const metadata: Metadata = {
  title: 'Privacy Policy | VibeOpenClaw',
  description: 'What VibeOpenClaw collects, why, which sub-processors we use, and how to request deletion of your data.',
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}${PATH}`,
    title: 'Privacy Policy | VibeOpenClaw',
    description: 'What VibeOpenClaw collects, why, which sub-processors we use, and how to request deletion of your data.',
  },
};

const SUB_PROCESSORS = [
  { title: 'Polar.sh', body: 'Payment processing and subscription billing. Handles your billing details and sends billing-related emails.' },
  { title: 'PostHog', body: 'Product analytics and session replay, so we can see how the app is used and fix what’s broken. Password fields are masked; most other on-screen content is not.' },
  { title: 'Google Analytics', body: 'Aggregate traffic analytics (page views, referrers) for the marketing site.' },
  { title: 'Your model provider', body: 'When you use BYOK, your agent talks directly to the LLM provider you configured (OpenAI, Anthropic, etc.) using your own key. We don’t see or store your prompts beyond what’s needed to relay the request.' },
];

export default function PrivacyPage() {
  return (
    <MarketingShell width={760}>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Privacy Policy' }]} />

      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
          Privacy Policy
        </h1>
        <p className="text-sm text-[#5a6480]">Last updated: July 23, 2026</p>
      </header>

      <P>
        This page explains what VibeOpenClaw collects when you use the app, why, who we share it with, and how
        to get it deleted. We try to write it the way we&apos;d want to read it: plainly, and without collecting more
        than we need.
      </P>

      <H2>What we collect</H2>
      <P>
        <strong className="text-[#f0f4ff]">Account data:</strong> your email address and a bcrypt hash of your
        password (we never store your password itself). Your plan tier and subscription status, linked to a
        customer ID from our payment processor, Polar.sh.
      </P>
      <P>
        <strong className="text-[#f0f4ff]">Agent configuration:</strong> when you deploy an agent, we store its
        configuration, including any model-provider API keys you add (encrypted at rest with AES-256-GCM) and any
        messaging-channel bot tokens (Telegram, Discord, Slack) you connect.
      </P>
      <P>
        <strong className="text-[#f0f4ff]">Usage data:</strong> counts of API calls your agents make, for billing
        and plan limits. We don&apos;t currently store the content of your agent&apos;s conversations or prompts &mdash;
        that traffic is relayed through our server to your model provider without being written to our database.
      </P>

      <H2>Analytics &amp; session replay</H2>
      <P>
        We use PostHog to understand how the app is used, including session replay of your interactions with the
        VibeOpenClaw dashboard. Password fields are masked; other on-screen text and inputs are generally not
        masked unless we&apos;ve explicitly excluded them. We also use Google Analytics for aggregate traffic
        stats on the marketing site. Neither tool has access to your agent&apos;s conversation content.
      </P>

      <H2>Sub-processors</H2>
      <P>Third-party services that process data on our behalf:</P>
      <FeatureGrid features={SUB_PROCESSORS} />

      <H2>Data retention</H2>
      <P>
        We keep your account and agent data for as long as your account is active. If you delete your account, we
        delete your stored data, including agent configuration and any provider keys or channel tokens on file.
        Billing records are retained by Polar.sh per their own retention practices.
      </P>

      <H2>Your choices</H2>
      <P>
        You can update or remove your agent&apos;s provider keys and channel tokens at any time from the dashboard.
        To request a copy of your data or full account deletion, email us and we&apos;ll act on it promptly.
      </P>

      <H2>Contact</H2>
      <P>
        Questions about this policy or your data:{' '}
        <a href="mailto:privacy@vibeopenclaw.com" className="text-[#00e5cc] hover:underline">privacy@vibeopenclaw.com</a>
      </P>

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Privacy Policy', path: PATH }]),
        )}
      />
    </MarketingShell>
  );
}
