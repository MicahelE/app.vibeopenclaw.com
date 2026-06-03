import type { Metadata } from 'next';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, StatBar, FeatureGrid, ComparisonTable, FaqAccordion, PricingCards, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, serviceLd, jsonLd, type Faq } from '@/components/marketing/schema';
import { PLANS } from '@/content/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/hermes-agent-hosting';

export const metadata: Metadata = {
  title: 'Managed Hermes Agent Hosting — One-Click Deploy | VibeOpenClaw',
  description:
    'Fully managed hosting for Nous Research’s Hermes Agent from $48/mo. One-click deploy, Docker isolation, true BYOK, MCP + cron, and Telegram/Discord/Slack — no servers to run.',
  keywords: ['hermes agent hosting', 'managed hermes hosting', 'deploy hermes agent', 'hermes agent cloud', 'host hermes agent'],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}${PATH}`,
    title: 'Managed Hermes Agent Hosting — One-Click Deploy',
    description: 'Managed hosting for Hermes Agent from $48/mo with Docker isolation and true BYOK. No Docker, no SSH.',
  },
};

const FAQ: Faq[] = [
  {
    q: 'What is Hermes Agent?',
    a: 'Hermes Agent is an open-source, self-improving AI agent from Nous Research, written in Python (178k+ GitHub stars as of June 2026). Unlike a plain chatbot, it has a learning loop that creates and improves its own skills from experience, with first-class MCP support and cron-scheduled tasks.',
  },
  {
    q: 'What does managed Hermes hosting include?',
    a: 'We provision the container, build the Hermes image, seed the config, encrypt your keys, set permissions, and keep it running with automatic restarts. You pick Hermes, choose a model, paste your channel token, and it’s live in about 30 seconds — no Docker, BuildKit, or SSH on your side.',
  },
  {
    q: 'How much does Hermes hosting cost?',
    a: 'Hermes runs on the Premium plan at $48/month, which includes up to 3 agents (any mix of OpenClaw or Hermes) at 4 GB RAM each, all channels including Slack, priority support, and usage analytics. You bring your own model keys and pay the provider directly — no inference markup.',
  },
  {
    q: 'Why is Hermes on the Premium plan?',
    a: 'Hermes is heavier than OpenClaw — its learning loop and skill execution want more memory — so we run it on Premium’s 4 GB-per-agent tier rather than Pro’s 2 GB.',
  },
  {
    q: 'Which model providers can Hermes use?',
    a: 'All 13 BYOK providers: OpenAI, Anthropic, Google, Groq, xAI, Mistral, DeepSeek, Together, Fireworks, Perplexity, OpenRouter, Cohere, and NVIDIA.',
  },
  {
    q: 'What channels does Hermes support?',
    a: 'Hermes connects through its messaging gateway to Telegram, Discord, and Slack on VibeOpenClaw. It runs as a gateway rather than exposing a public HTTP endpoint.',
  },
  {
    q: 'Can I run OpenClaw and Hermes together?',
    a: 'Yes. Premium lets you run up to 3 agents in any mix, so you can host OpenClaw and Hermes side-by-side and point both at the same encrypted provider keys.',
  },
  {
    q: 'Can I migrate a self-hosted Hermes setup?',
    a: 'Yes. Deploy a managed Hermes agent, point it at your provider keys, and move over your configuration — you skip the Docker BuildKit/buildx setup that trips up most DIY installs.',
  },
  {
    q: 'How is my Hermes agent isolated?',
    a: 'Each Hermes agent runs in its own Docker container with dedicated RAM and AES-256-GCM-encrypted keys, isolated from every other agent on the platform.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes — Premium is month-to-month and cancellable from the billing page; your agents run through the end of the paid period.',
  },
];

const FEATURES = [
  { title: 'Self-improving agent', body: 'Hermes learns and refines its own skills from experience — a real autonomous assistant, not a one-shot chatbot.' },
  { title: 'MCP + cron built in', body: 'First-class Model Context Protocol support plus cron-scheduled tasks for background automation.' },
  { title: 'One-click managed deploy', body: 'We handle the Docker BuildKit image, config seeding, and permissions that derail most DIY Hermes installs. Live in ~30 seconds.' },
  { title: 'True BYOK', body: 'Bring your own provider keys across 13 providers and pay them directly — we never mark up inference.' },
  { title: 'Docker isolation + encryption', body: 'Dedicated container and RAM per agent; keys encrypted at rest with AES-256-GCM.' },
  { title: 'Run alongside OpenClaw', body: 'Premium runs both agents side-by-side — the only managed host that does OpenClaw and Hermes.' },
];

const VS: (string | boolean)[][] = [
  ['Time to first agent', '~30 seconds', 'Hours (BuildKit + config)'],
  ['Docker BuildKit / buildx setup', 'Handled', 'You configure'],
  ['Encrypted key storage', 'AES-256-GCM', 'Your responsibility'],
  ['MCP + cron', 'Ready', 'You wire it'],
  ['24/7 uptime', 'On our servers', 'Your box must stay on'],
  ['Runs OpenClaw too', true, true],
];

export default function HermesHostingPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Hermes Agent Hosting' }]} />

      <Hero
        eyebrow="Managed Hermes Agent Hosting"
        title="Fully managed Hermes Agent hosting"
        subtitle={
          <>
            Deploy Nous Research’s self-improving Hermes Agent in one click — no Docker BuildKit, no SSH.
            Per-agent isolation, true BYOK, MCP + cron, on the Premium plan at{' '}
            <strong className="text-[#f0f4ff]">${PLANS.premium.monthly}/mo</strong>.
          </>
        }
      />

      <StatBar
        stats={[
          { value: '~30s', label: 'to first agent' },
          { value: '178k+', label: 'Hermes GitHub stars' },
          { value: '13', label: 'BYOK model providers' },
          { value: '$48', label: 'Premium / mo' },
        ]}
      />

      <H2 id="features">A self-improving agent, fully operated</H2>
      <FeatureGrid features={FEATURES} />

      <H2 id="self-vs-managed">Managed vs DIY Hermes</H2>
      <P>Self-hosting Hermes means wrestling Docker BuildKit/buildx, the image build, config seeding, and host UID/permission mismatches — the exact failure modes that derail first-time installs. Managed hosting makes them disappear.</P>
      <ComparisonTable cols={['VibeOpenClaw (managed)', 'Self-hosted (DIY)']} rows={VS} highlightCol={0} />

      <H2 id="pricing">Pricing</H2>
      <P>Hermes runs on Premium — up to 3 agents (OpenClaw or Hermes) at 4 GB each, all channels, priority support. BYOK across 13 providers; you pay the provider directly.</P>
      <PricingCards />

      <P>New to the two agents? Read the <a href="/compare/openclaw-vs-hermes" className="text-[#00e5cc] hover:underline">OpenClaw vs Hermes comparison</a> or the <a href="/blog/how-to-deploy-hermes-agent" className="text-[#00e5cc] hover:underline">Hermes deployment guide</a>.</P>

      <FaqAccordion faqs={FAQ} />

      <Cta title="Deploy your Hermes agent" body="One-click managed Hermes with Docker isolation and BYOK — on Premium at $48/mo." />

      <Sources
        items={[
          { label: 'Hermes Agent — official repository (178k+ stars, June 2026)', url: 'https://github.com/NousResearch/hermes-agent' },
          { label: 'Model Context Protocol (MCP)', url: 'https://modelcontextprotocol.io' },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Hermes Agent Hosting', path: PATH }]),
          serviceLd({ name: 'Managed Hermes Agent Hosting', description: metadata.description as string, path: PATH, lowPrice: PLANS.premium.monthly, highPrice: PLANS.premium.monthly }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
