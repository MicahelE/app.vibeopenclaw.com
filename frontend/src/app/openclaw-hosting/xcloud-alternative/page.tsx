import type { Metadata } from 'next';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, StatBar, FeatureGrid, ComparisonTable, FaqAccordion, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, serviceLd, jsonLd, type Faq } from '@/components/marketing/schema';
import { PLANS } from '@/content/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/openclaw-hosting/xcloud-alternative';

export const metadata: Metadata = {
  title: 'xCloud Alternative for OpenClaw Hosting | VibeOpenClaw',
  description:
    'Looking for an xCloud alternative for OpenClaw? VibeOpenClaw is an agent-specialized host: runs OpenClaw and Hermes, per-agent Docker isolation, AES-256-GCM keys, flat $24/$48.',
  keywords: ['xcloud alternative', 'xcloud.host alternative', 'alternative to xcloud openclaw', 'openclaw hosting alternative'],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}${PATH}`,
    title: 'xCloud Alternative for OpenClaw Hosting',
    description: 'An agent-specialized xCloud alternative: VibeOpenClaw runs both OpenClaw and Hermes with per-agent Docker isolation, AES-256-GCM keys, and flat two-tier pricing.',
  },
};

const FAQ: Faq[] = [
  {
    q: 'Is VibeOpenClaw a good xCloud alternative?',
    a: 'If your goal is specifically AI agent hosting, yes. xCloud is a broad VPS host that runs WordPress, Laravel, n8n and more, and it also has OpenClaw and Hermes pages. VibeOpenClaw does one thing: it runs OpenClaw and Hermes agents. You get per-agent Docker isolation, AES-256-GCM encrypted provider keys, true BYOK across 13 providers, and a flat two-tier price ($24 Pro / $48 Premium) instead of VPS-size tiers. If you want a general server for many app types, xCloud is the broader tool; if you only want agents, VibeOpenClaw is purpose-built.',
  },
  {
    q: 'Can I move from xCloud to VibeOpenClaw?',
    a: 'Yes, and there is little to migrate because both platforms are BYOK. You keep your own model provider keys, your own model choice, and your channel bots. To switch, sign up for VibeOpenClaw, add your provider key on the API Keys page, click New Agent and pick OpenClaw, then paste your existing Telegram, Discord, or Slack bot token. Your agent boots in a Docker-isolated container in about 30 seconds. No data is locked in inference proxies on either side, so there is no vendor billing to unwind.',
  },
  {
    q: 'How does pricing compare to xCloud?',
    a: 'VibeOpenClaw uses flat, agent-based pricing: $24/month for Pro (1 agent, 2 GB RAM, Telegram & Discord) and $48/month for Premium (up to 3 OpenClaw or Hermes agents, 4 GB RAM each, all channels including Slack). As a general VPS host, xCloud prices by server size, starting around $24/month and scaling up toward roughly $225/month for larger VPS plans (June 2026). Both are BYOK, so you pay your model provider directly for inference in either case — VibeOpenClaw never marks up inference.',
  },
  {
    q: 'Does VibeOpenClaw host Hermes too, or only OpenClaw?',
    a: 'Both. VibeOpenClaw is the managed host that runs both OpenClaw and Hermes. On Premium you can run either type, or both side-by-side, each in its own isolated container. xCloud also has OpenClaw and Hermes pages, so this is about how the two run them — VibeOpenClaw is agent-specialized with explicit per-agent Docker isolation and encrypted keys.',
  },
  {
    q: 'What do I keep if I switch from xCloud?',
    a: 'Everything that is genuinely yours: your provider API keys (you re-add them, encrypted with AES-256-GCM), your model provider and model choice, and your messaging channels via your existing bot tokens. Because there is no proxy or inference markup on either side, your AI spend and billing relationship with OpenAI, Anthropic, Google and others stays exactly as it was.',
  },
];

const VS_XCLOUD: (string | boolean)[][] = [
  ['Built for AI agents specifically', true, false],
  ['Runs both OpenClaw and Hermes', true, true],
  ['Per-agent Docker isolation', true, false],
  ['Encrypted keys (AES-256-GCM)', true, false],
  ['Flat agent-based pricing', '$24 / $48', 'By VPS size'],
  ['True BYOK (no inference markup)', true, true],
];

const FEATURES = [
  { title: 'Agent-specialized, not a broad panel', body: 'No WordPress, Laravel, or n8n controls to ignore. The whole platform is built around deploying and running OpenClaw and Hermes agents.' },
  { title: 'Both agents, one platform', body: 'Run OpenClaw and Hermes side-by-side on Premium. Pick the framework per agent without leaving the dashboard.' },
  { title: 'Per-agent Docker isolation', body: 'Every agent gets its own container and RAM, so a problem in one agent cannot reach another agent’s data or keys.' },
  { title: 'Encrypted at rest', body: 'Provider keys are stored with AES-256-GCM and decrypted only in-process for model calls — never logged, never re-displayed.' },
  { title: 'Flat, predictable pricing', body: 'Two tiers — $24 Pro and $48 Premium — instead of choosing and resizing a VPS. You always know the bill.' },
  { title: 'True BYOK across 13 providers', body: 'Bring keys for OpenAI, Anthropic, Google, and 10 more, and pay them directly. We never proxy or mark up inference.' },
];

export default function XCloudAlternativePage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: 'xCloud Alternative' }]} />

      <Hero
        eyebrow="xCloud Alternative"
        title="Looking for an xCloud alternative?"
        subtitle={
          <>
            xCloud is a solid, broad VPS host. But if you specifically want an agent-specialized platform that runs{' '}
            <strong className="text-[#f0f4ff]">both OpenClaw and Hermes</strong> with per-agent Docker isolation and
            encrypted keys, VibeOpenClaw is purpose-built for agents — from{' '}
            <strong className="text-[#f0f4ff]">${PLANS.pro.monthly}/mo</strong>.
          </>
        }
      />

      <StatBar
        stats={[
          { value: '~30s', label: 'to first agent' },
          { value: '2', label: 'frameworks: OpenClaw + Hermes' },
          { value: '13', label: 'BYOK model providers' },
          { value: '$24 / $48', label: 'flat two-tier pricing' },
        ]}
      />

      <H2 id="why">Why people look for an xCloud alternative for OpenClaw</H2>
      <P>
        xCloud is a capable, general-purpose host — it runs WordPress, Laravel, n8n, and more, deploys in about five
        minutes across 30+ locations, and now ships OpenClaw and Hermes pages too. That breadth is a real strength if you
        manage many kinds of apps. But it is also why some teams who <em>only</em> want AI agents go looking for
        something narrower. Here is when an alternative tends to make sense:
      </P>
      <ul className="list-disc pl-6 space-y-2 text-[#c8d0e0]">
        <li>You only want AI agents — not a WordPress, Laravel, or n8n control panel you will never open.</li>
        <li>You want one place to run <strong className="text-[#f0f4ff]">both OpenClaw and Hermes</strong>, picked per agent.</li>
        <li>You want explicit per-agent isolation and encrypted secrets — dedicated Docker containers plus AES-256-GCM key storage.</li>
        <li>You prefer simple, flat agent-based pricing over choosing and resizing a VPS by size.</li>
      </ul>
      <P>
        None of this is a knock on xCloud — it is a broad platform doing broad things well. It is simply a different
        shape of product than an agent-specialized host.
      </P>

      <H2 id="instead">What VibeOpenClaw gives you instead</H2>
      <P>
        VibeOpenClaw does one job: deploy and run OpenClaw and Hermes agents. Because that is the entire scope, the
        guarantees are concrete rather than general.
      </P>
      <FeatureGrid features={FEATURES} />

      <H2 id="comparison">VibeOpenClaw vs xCloud at a glance</H2>
      <P>
        A quick side-by-side for the agent-hosting angle specifically (figures as of June 2026). For a full, neutral,
        feature-by-feature breakdown, see the dedicated comparison page linked below.
      </P>
      <ComparisonTable cols={['VibeOpenClaw', 'xCloud']} rows={VS_XCLOUD} highlightCol={0} />
      <P>
        Want the complete head-to-head?{' '}
        <a href="/compare/vibeopenclaw-vs-xcloud" className="text-[#00e5cc] hover:underline">VibeOpenClaw vs xCloud</a>{' '}
        covers each platform fairly, including where xCloud’s breadth wins.
      </P>

      <H2 id="keep">What you keep when you switch</H2>
      <P>
        Switching is low-risk because both platforms are BYOK — nothing important is locked behind a proxy. When you
        move from xCloud to VibeOpenClaw, you carry over:
      </P>
      <ul className="list-disc pl-6 space-y-2 text-[#c8d0e0]">
        <li><strong className="text-[#f0f4ff]">Your provider keys.</strong> Re-add them once; they are encrypted at rest with AES-256-GCM and pay your providers directly.</li>
        <li><strong className="text-[#f0f4ff]">Your model provider and model.</strong> Keep OpenAI, Anthropic, Google, or any of the 13 supported providers — no forced switch.</li>
        <li><strong className="text-[#f0f4ff]">Your channels.</strong> Reuse your existing Telegram, Discord, or Slack bot tokens.</li>
        <li><strong className="text-[#f0f4ff]">One-click deploy.</strong> You still get a fast, form-driven setup — no Docker, SSH, or YAML on either side.</li>
      </ul>

      <H2 id="switch">How to switch in about 30 seconds</H2>
      <ol className="list-decimal pl-6 space-y-2 text-[#c8d0e0]">
        <li>Sign up for VibeOpenClaw.</li>
        <li>Add your model provider key on the API Keys page (OpenAI, Anthropic, Google, and 10 more).</li>
        <li>Click <em>New Agent</em>, choose <strong className="text-[#f0f4ff]">OpenClaw</strong> (or Hermes on Premium), and pick your model.</li>
        <li>Paste your existing Telegram, Discord, or Slack bot token to point your channel at the new agent.</li>
        <li>Click Create. Your agent boots in a Docker-isolated container in about 30 seconds and starts answering.</li>
      </ol>
      <P>
        Prefer to run Hermes instead of — or alongside — OpenClaw? The same flow applies; see{' '}
        <a href="/hermes-agent-hosting" className="text-[#00e5cc] hover:underline">Hermes agent hosting</a>, or start from{' '}
        <a href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">managed OpenClaw hosting</a>.
      </P>

      <FaqAccordion faqs={FAQ} />

      <Cta title="Try the agent-specialized alternative" body="Run OpenClaw and Hermes with per-agent Docker isolation, AES-256-GCM keys, and BYOK across 13 providers — flat $24/$48, live in ~30 seconds." />

      <Sources
        items={[
          { label: 'OpenClaw — official repository', url: 'https://github.com/openclaw/openclaw' },
          { label: 'xCloud — managed cloud hosting platform', url: 'https://xcloud.host' },
          { label: 'VibeOpenClaw vs xCloud — full comparison', url: `${SITE_URL}/compare/vibeopenclaw-vs-xcloud` },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'OpenClaw Hosting', path: '/openclaw-hosting' },
            { name: 'xCloud Alternative', path: PATH },
          ]),
          serviceLd({
            name: 'OpenClaw Hosting — xCloud Alternative',
            description: metadata.description as string,
            path: PATH,
            lowPrice: PLANS.pro.monthly,
            highPrice: PLANS.premium.monthly,
          }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
