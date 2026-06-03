import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, FeatureGrid, FaqAccordion, PricingCards, Cta, H2, P, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, serviceLd, jsonLd, type Faq } from '@/components/marketing/schema';
import { PLANS } from '@/content/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/managed-ai-agent-hosting';

export const metadata: Metadata = {
  title: 'Managed AI Agent Hosting — OpenClaw & Hermes | VibeOpenClaw',
  description:
    'Managed hosting for open-source AI agents from $24/mo. Deploy OpenClaw or Hermes in one click with Docker isolation, true BYOK, and Telegram/Discord/Slack — no servers to run.',
  keywords: ['managed ai agent hosting', 'ai agent hosting', 'host ai agents', 'ai agent platform', 'deploy ai agents'],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}${PATH}`,
    title: 'Managed AI Agent Hosting — OpenClaw & Hermes',
    description: 'Deploy OpenClaw or Hermes AI agents in one click with Docker isolation and true BYOK. From $24/mo.',
  },
};

const FAQ: Faq[] = [
  {
    q: 'What is managed AI agent hosting?',
    a: 'It’s a service that runs your AI agent for you — provisioning, deployment, SSL, updates, backups, and 24/7 uptime — instead of you renting a VPS and operating Docker yourself. VibeOpenClaw provides this for two open-source agents: OpenClaw and Hermes.',
  },
  {
    q: 'Which agents can I host?',
    a: 'OpenClaw (an open-source Node.js personal-assistant platform) and Hermes (Nous Research’s self-improving Python agent). VibeOpenClaw is the only managed host that runs both, side-by-side if you want.',
  },
  {
    q: 'How much does it cost?',
    a: 'Pro is $24/month (1 OpenClaw agent, 2 GB RAM, Telegram & Discord). Premium is $48/month (up to 3 OpenClaw or Hermes agents, 4 GB RAM each, all channels including Slack, priority support). BYOK across 13 providers; you pay your model provider directly.',
  },
  {
    q: 'What makes VibeOpenClaw different?',
    a: 'Three things: it runs both OpenClaw and Hermes, every agent is isolated in its own Docker container, and your provider keys are encrypted at rest (AES-256-GCM) with no markup on inference.',
  },
  {
    q: 'Do I need any DevOps skills?',
    a: 'No — there’s no Docker, SSH, or server management. Sign up, add a key, pick an agent, and deploy in about 30 seconds.',
  },
];

const FEATURES = [
  { title: 'Two agents, one platform', body: 'Deploy OpenClaw, Hermes, or both — the only managed host that runs both open-source agents.' },
  { title: 'One-click deploy', body: 'Live in ~30 seconds in a Docker-isolated container. No image to build, no server to operate.' },
  { title: 'True BYOK', body: 'Bring your own keys across 13 providers; pay them directly. We never proxy or mark up inference.' },
  { title: 'Isolated & encrypted', body: 'Per-agent Docker isolation and AES-256-GCM key storage keep each agent — and your keys — contained.' },
];

export default function ManagedAgentHostingPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Managed AI Agent Hosting' }]} />

      <Hero
        eyebrow="Managed AI Agent Hosting"
        title="Managed hosting for open-source AI agents"
        subtitle={
          <>
            Deploy OpenClaw or Hermes in one click — Docker isolation, true BYOK, and channels wired up,
            from <strong className="text-[#f0f4ff]">${PLANS.pro.monthly}/mo</strong>. No servers to run.
          </>
        }
      />

      <FeatureGrid features={FEATURES} />

      <H2 id="agents">Pick your agent</H2>
      <div className="grid md:grid-cols-2 gap-4 my-6">
        <Link href="/openclaw-hosting" className="block rounded-2xl border border-[rgba(255,77,77,0.25)] bg-[rgba(255,77,77,0.04)] p-6 hover:-translate-y-1 transition-all">
          <h3 className="text-xl font-bold text-[#ff4d4d] mb-2" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>OpenClaw Hosting →</h3>
          <p className="text-sm text-[#c8d0e0]">A polished multi-channel personal assistant with a skills marketplace. From $24/mo.</p>
        </Link>
        <Link href="/hermes-agent-hosting" className="block rounded-2xl border border-[rgba(0,229,204,0.25)] bg-[rgba(0,229,204,0.04)] p-6 hover:-translate-y-1 transition-all">
          <h3 className="text-xl font-bold text-[#00e5cc] mb-2" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Hermes Agent Hosting →</h3>
          <p className="text-sm text-[#c8d0e0]">A self-improving agent that learns skills from experience, with MCP + cron. On Premium at $48/mo.</p>
        </Link>
      </div>
      <P>Not sure which? The <a href="/compare/openclaw-vs-hermes" className="text-[#00e5cc] hover:underline">OpenClaw vs Hermes comparison</a> breaks down the differences.</P>

      <H2 id="pricing">Pricing</H2>
      <PricingCards />

      <FaqAccordion faqs={FAQ} />

      <Cta title="Deploy an AI agent" body="OpenClaw or Hermes, isolated and BYOK, from $24/mo — live in about 30 seconds." />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Managed AI Agent Hosting', path: PATH }]),
          serviceLd({ name: 'Managed AI Agent Hosting', description: metadata.description as string, path: PATH, lowPrice: PLANS.pro.monthly, highPrice: PLANS.premium.monthly }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
