import type { Metadata } from 'next';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, StatBar, FeatureGrid, ComparisonTable, FaqAccordion, PricingCards, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, serviceLd, jsonLd, type Faq } from '@/components/marketing/schema';
import { PLANS } from '@/content/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/openclaw-hosting';

export const metadata: Metadata = {
  title: 'Managed OpenClaw Hosting — Deploy in One Click | VibeOpenClaw',
  description:
    'Fully managed OpenClaw hosting from $24/mo. One-click deploy, per-agent Docker isolation, true BYOK (no inference markup), and Telegram/Discord/Slack — no servers to run.',
  keywords: ['managed openclaw hosting', 'openclaw hosting', 'deploy openclaw', 'openclaw cloud hosting', 'host openclaw'],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}${PATH}`,
    title: 'Managed OpenClaw Hosting — Deploy in One Click',
    description: 'Fully managed OpenClaw hosting from $24/mo with per-agent Docker isolation and true BYOK. No Docker, no SSH, no servers to run.',
  },
};

const FAQ: Faq[] = [
  {
    q: 'What is managed OpenClaw hosting?',
    a: 'Managed OpenClaw hosting means a provider runs your OpenClaw agent for you — provisioning, installation, SSL, updates, backups, and 24/7 uptime — so you skip the Docker, SSH, and server maintenance. On VibeOpenClaw you sign up, pick OpenClaw, add your model provider key and channel tokens, and your agent is live in a Docker-isolated container in about 30 seconds.',
  },
  {
    q: 'How much does OpenClaw hosting cost on VibeOpenClaw?',
    a: 'The Pro plan is $24/month for 1 OpenClaw agent with 2 GB RAM and Telegram & Discord. The Premium plan is $48/month for up to 3 OpenClaw or Hermes agents with 4 GB RAM each, all channels including Slack, priority support, and usage analytics. You bring your own model API keys, so you only pay the provider directly for inference — we never mark it up.',
  },
  {
    q: 'Do I need Docker or technical skills?',
    a: 'No. We handle the container, image build, configuration, SSL, and restarts. You never touch a terminal, a YAML file, or a server. If you can fill in a form, you can deploy an OpenClaw agent.',
  },
  {
    q: 'What does BYOK mean and why does it matter?',
    a: 'BYOK is "bring your own keys." You add your own provider API keys (OpenAI, Anthropic, Google, and 10 more) and pay those providers directly for usage. We never proxy or mark up inference, so your AI costs stay transparent and you keep full control of your spend. Keys are encrypted at rest with AES-256-GCM.',
  },
  {
    q: 'Which model providers are supported?',
    a: 'Thirteen, all first-class via BYOK: OpenAI, Anthropic, Google, Groq, xAI, Mistral, DeepSeek, Together, Fireworks, Perplexity, OpenRouter, Cohere, and NVIDIA.',
  },
  {
    q: 'Which messaging channels does OpenClaw support here?',
    a: 'On VibeOpenClaw, OpenClaw agents connect to Telegram and Discord on the Pro plan, plus Slack on Premium. (OpenClaw the open-source framework supports 20+ channels; our managed service exposes Telegram, Discord, and Slack today.)',
  },
  {
    q: 'How is each agent isolated?',
    a: 'Every agent runs in its own dedicated Docker container with its own RAM. One agent cannot read another agent’s memory or keys, so the blast radius of any single misconfiguration or compromised skill is limited to that one agent.',
  },
  {
    q: 'How fast is deployment?',
    a: 'About 30 seconds. The container starts immediately after you submit the new-agent form — server provisioning, OpenClaw install, SSL, and configuration are all handled for you.',
  },
  {
    q: 'Can I run more than one agent?',
    a: 'Yes. Pro includes 1 agent; Premium includes up to 3, and they can be any mix of OpenClaw and Hermes.',
  },
  {
    q: 'Can I also host Hermes Agent?',
    a: 'Yes — VibeOpenClaw is the managed host that runs both OpenClaw and Hermes. Premium lets you run either type, or both side-by-side. See the OpenClaw vs Hermes comparison to choose.',
  },
  {
    q: 'Is my data private?',
    a: 'Your agent runs in an isolated container, your provider keys are encrypted at rest (AES-256-GCM) and only decrypted in-process to make model calls, and keys are never shown in full again after entry or written to logs.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Plans are month-to-month and you can cancel from the billing page; your agents keep running through the end of the paid period.',
  },
];

const SELF_VS_MANAGED: (string | boolean)[][] = [
  ['Time to first agent', '~30 seconds', 'Hours of Docker + SSH'],
  ['Docker / SSH / DevOps', false, true],
  ['SSL & HTTPS', 'Automatic', 'You configure'],
  ['Updates & restarts', 'Managed', 'You run them'],
  ['Per-agent isolation', 'Built-in', 'You design it'],
  ['Encrypted key storage', 'AES-256-GCM', 'Your responsibility'],
  ['24/7 uptime', 'On our servers', 'Your box must stay on'],
  ['Support', 'Email / priority', 'Forums & your own time'],
];

const VS_COMPETITORS: (string | boolean)[][] = [
  ['From price', '$24/mo', '$24/mo', '$19/mo', '$5–15/mo + time'],
  ['Hosts OpenClaw', true, true, true, true],
  ['Hosts Hermes too', true, true, false, true],
  ['True BYOK (no inference markup)', true, true, true, true],
  ['Per-agent Docker isolation', true, false, true, false],
  ['Encrypted keys (AES-256-GCM)', true, false, false, false],
  ['No servers/Docker to manage', true, true, true, false],
];

const FEATURES = [
  { title: 'One-click deploy', body: 'Pick OpenClaw, choose a model, paste your channel token, click Create. Live in ~30 seconds — no image to build, nothing to chown.' },
  { title: 'True BYOK', body: 'Add your own provider keys and pay the provider directly. We never proxy or mark up inference; your AI spend stays transparent.' },
  { title: 'Per-agent Docker isolation', body: 'Each agent gets its own container and RAM, so a problem in one agent can’t reach another’s data or keys.' },
  { title: 'Encrypted at rest', body: 'Provider keys are stored with AES-256-GCM and only decrypted in-process for model calls — never logged, never re-displayed.' },
  { title: 'Channels included', body: 'Telegram and Discord on Pro; add Slack on Premium. Your agent runs 24/7 on our servers, not your laptop.' },
  { title: 'Both agents, one platform', body: 'Run OpenClaw and Hermes side-by-side on Premium — the only managed host that does both.' },
];

export default function OpenClawHostingPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting' }]} />

      <Hero
        eyebrow="Managed OpenClaw Hosting"
        title="Fully managed OpenClaw hosting"
        subtitle={
          <>
            Deploy your OpenClaw AI assistant in one click — no Docker, no SSH, no server to run.
            Per-agent Docker isolation, true BYOK with no inference markup, and Telegram/Discord/Slack,
            from <strong className="text-[#f0f4ff]">${PLANS.pro.monthly}/mo</strong>.
          </>
        }
      />

      <StatBar
        stats={[
          { value: '~30s', label: 'to first agent' },
          { value: '376k+', label: 'OpenClaw GitHub stars' },
          { value: '13', label: 'BYOK model providers' },
          { value: '$24', label: 'starting price / mo' },
        ]}
      />

      <H2 id="setup">From sign-up to AI assistant in 3 steps</H2>
      <ol className="list-decimal pl-6 space-y-2 text-[#c8d0e0]">
        <li>Sign up and add a model provider key on the API Keys page (OpenAI, Anthropic, Google, and 10 more).</li>
        <li>Click <em>New Agent</em>, choose <strong className="text-[#f0f4ff]">OpenClaw</strong>, pick your model, and paste your Telegram or Discord bot token.</li>
        <li>Click Create. Your agent boots in a Docker-isolated container in ~30 seconds and starts answering on your channel.</li>
      </ol>

      <H2 id="features">Run a real AI agent without the ops headaches</H2>
      <FeatureGrid features={FEATURES} />

      <H2 id="self-vs-managed">Self-hosting vs managed</H2>
      <P>Self-hosting OpenClaw is free in license but expensive in time: Docker, port forwarding, SSL, patching, backups, and a machine that has to stay on 24/7. Managed hosting trades a low monthly fee for all of that disappearing.</P>
      <ComparisonTable cols={['VibeOpenClaw (managed)', 'Self-hosted (DIY)']} rows={SELF_VS_MANAGED} highlightCol={0} />

      <H2 id="vs-others">VibeOpenClaw vs other managed hosts</H2>
      <P>Most managed OpenClaw hosts get you a one-click deploy. Two things set VibeOpenClaw apart: we run <strong className="text-[#f0f4ff]">both OpenClaw and Hermes</strong>, and every agent gets its own Docker container with keys encrypted at rest. Here’s how the options compare (figures as of June 2026 — see the comparison pages for detail).</P>
      <ComparisonTable cols={['VibeOpenClaw', 'xCloud', 'MyClaw', 'DIY VPS']} rows={VS_COMPETITORS} highlightCol={0} />
      <P>
        Prefer a head-to-head? See <a href="/compare/vibeopenclaw-vs-xcloud" className="text-[#00e5cc] hover:underline">VibeOpenClaw vs xCloud</a> and{' '}
        <a href="/compare/vibeopenclaw-vs-myclaw" className="text-[#00e5cc] hover:underline">VibeOpenClaw vs MyClaw</a>, or the full{' '}
        <a href="/blog/best-openclaw-hosting-providers-2026" className="text-[#00e5cc] hover:underline">best OpenClaw hosting providers</a> rundown.
      </P>

      <H2 id="pricing">Simple pricing</H2>
      <P>Two plans, month-to-month, BYOK across 13 providers. You pay your model provider directly for inference — we never mark it up.</P>
      <PricingCards />

      <FaqAccordion faqs={FAQ} />

      <Cta title="Deploy your OpenClaw agent" body="One-click deploy, Docker isolation, BYOK across 13 providers, and channels wired up — from $24/mo." />

      <Sources
        items={[
          { label: 'OpenClaw — official repository (376k+ stars, June 2026)', url: 'https://github.com/openclaw/openclaw' },
          { label: 'ClawHub — OpenClaw skills marketplace', url: 'https://clawhub.com' },
          { label: 'Model Context Protocol (MCP)', url: 'https://modelcontextprotocol.io' },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: PATH }]),
          serviceLd({ name: 'Managed OpenClaw Hosting', description: metadata.description as string, path: PATH, lowPrice: PLANS.pro.monthly, highPrice: PLANS.premium.monthly }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
