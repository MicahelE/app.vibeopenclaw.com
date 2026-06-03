import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, P, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, jsonLd } from '@/components/marketing/schema';
import { INTEGRATIONS } from '@/content/integrations';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';

export const metadata: Metadata = {
  title: 'OpenClaw Integrations | VibeOpenClaw',
  description: 'Run a managed OpenClaw agent that works with n8n, Zapier, Notion, GitHub, Gmail, Slack, and more — via OpenClaw skills. Hosted, isolated, BYOK from $24/mo.',
  alternates: { canonical: `${SITE_URL}/openclaw-hosting/integrations` },
};

export default function IntegrationsIndex() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: 'Integrations' }]} />
      <Hero eyebrow="OpenClaw" title="OpenClaw integrations" subtitle="Connect your hosted OpenClaw agent to the tools you already use — via OpenClaw skills, webhooks, and MCP." />

      <P>OpenClaw connects to external tools through its skills system (and MCP/webhooks where supported). On VibeOpenClaw we host the agent for you — you just configure the skill. Pick a tool to get started:</P>

      <ul className="grid md:grid-cols-2 gap-3 mt-6">
        {INTEGRATIONS.map((i) => (
          <li key={i.slug}>
            <Link href={`/openclaw-hosting/integrations/${i.slug}`} className="block rounded-xl border border-[rgba(136,146,176,0.15)] bg-[rgba(10,15,26,0.4)] p-5 hover:border-[rgba(136,146,176,0.3)] transition-all">
              <span className="font-semibold text-[#f0f4ff]">OpenClaw + {i.name} →</span>
              <span className="block text-sm text-[#8892b0] mt-0.5">{i.what}</span>
            </Link>
          </li>
        ))}
      </ul>

      <JsonLd data={jsonLd(breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: 'Integrations', path: '/openclaw-hosting/integrations' }]))} />
    </MarketingShell>
  );
}
