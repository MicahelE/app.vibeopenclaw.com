import type { Metadata } from 'next';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, ComparisonTable, FaqAccordion, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, articleLd, jsonLd, type Faq } from '@/components/marketing/schema';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/compare/vibeopenclaw-vs-railway';
const PUBLISHED = '2026-06-03';

export const metadata: Metadata = {
  title: 'VibeOpenClaw vs Railway: OpenClaw Hosting Compared',
  description:
    'VibeOpenClaw vs Railway for OpenClaw: a managed agent host versus a code-first PaaS you self-deploy on. Compare setup, isolation, encrypted keys, pricing, and ops.',
  keywords: ['vibeopenclaw vs railway', 'openclaw on railway', 'railway openclaw hosting', 'openclaw hosting comparison'],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    type: 'article',
    url: `${SITE_URL}${PATH}`,
    title: 'VibeOpenClaw vs Railway: OpenClaw Hosting Compared',
    description: 'A neutral head-to-head: VibeOpenClaw, a purpose-built managed OpenClaw host, versus Railway, a developer PaaS where you deploy and run OpenClaw yourself.',
  },
};

const FAQ: Faq[] = [
  {
    q: 'What is the core difference between VibeOpenClaw and Railway for OpenClaw?',
    a: 'VibeOpenClaw is a purpose-built managed host for OpenClaw and Hermes — you pick an agent, add a model key and a channel token, and it deploys in about 30 seconds with no server to configure. Railway is a general usage-based PaaS: you deploy OpenClaw yourself as a service from a repo or Docker image. Railway is convenient for developers, but the deployment is still yours to configure, update, and monitor.',
  },
  {
    q: 'How does pricing compare?',
    a: 'VibeOpenClaw uses flat tiers — Pro at $24/mo and Premium at $48/mo — so your hosting bill is predictable, and you bring your own model keys with no inference markup. Railway is usage-based, from around $5/mo plus what you consume in compute, memory, and bandwidth. Railway can start cheaper for a tiny service, but the bill scales with usage and you still own the deployment work.',
  },
  {
    q: 'Do I have to manage the deployment on Railway?',
    a: 'Yes. On Railway you set up the OpenClaw service yourself from a repo or Docker image, then handle configuration, environment variables, updates, and monitoring. VibeOpenClaw manages all of that for you — each agent runs in its own Docker container, keys are encrypted at rest, and there is no infrastructure for you to maintain.',
  },
  {
    q: 'What about security and key handling?',
    a: 'On VibeOpenClaw every agent runs in its own dedicated Docker container, and your provider API keys are encrypted at rest with AES-256-GCM and only decrypted in-process for model calls. On Railway, isolation and key handling depend on how you architect your services and set your environment variables — it gives you the building blocks, but the security posture is yours to design.',
  },
  {
    q: 'Which should I choose?',
    a: 'Choose VibeOpenClaw if you want managed OpenClaw or Hermes agents that deploy fast with per-agent isolation, encrypted keys, and flat pricing — no config required. Choose Railway if you want a code-first PaaS, enjoy managing your own deployment, and want to run OpenClaw alongside other services you control. Both are legitimate paths; they differ in how much ops you want to own.',
  },
];

// First column is the row label; remaining columns map to cols = [VibeOpenClaw, Railway].
const ROWS: (string | boolean)[][] = [
  ['From price', '$24/mo flat', 'from ~$5/mo + usage'],
  ['Purpose-built for OpenClaw', true, false],
  ['Hosts OpenClaw and Hermes', true, 'Self-deploy'],
  ['Setup model', 'No config — pick + deploy', 'You deploy from repo / Docker'],
  ['Per-agent Docker isolation', '✓', 'You architect it'],
  ['Encrypted keys (AES-256-GCM)', true, false],
  ['BYOK, no inference markup', true, 'BYOK via env vars'],
  ['Deploy time', '~30s', 'Build + configure yourself'],
  ['Who runs updates / monitoring', 'Managed for you', 'You do'],
  ['Pricing model', 'Flat 2-tier', 'Usage-based'],
];

export default function VibeOpenClawVsRailwayPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Compare', path: '/compare' }, { name: 'VibeOpenClaw vs Railway' }]} />

      <Hero
        eyebrow="Comparison"
        title="VibeOpenClaw vs Railway"
        subtitle={
          <>
            Two very different ways to run OpenClaw. VibeOpenClaw is a{' '}
            <strong className="text-[#f0f4ff]">purpose-built managed host</strong> that deploys agents in ~30
            seconds; Railway is a developer PaaS where you deploy and operate OpenClaw yourself. Here’s a fair,
            factual side-by-side (verified June 2026).
          </>
        }
      />

      <H2 id="verdict">The short verdict</H2>
      <P>
        The choice here isn’t really about price — it’s about how much you want to own. VibeOpenClaw is built
        specifically for AI agents: it runs <strong className="text-[#f0f4ff]">both OpenClaw and Hermes</strong>,
        gives each agent its own Docker container, encrypts provider keys at rest with AES-256-GCM, and boots a new
        agent in about 30 seconds. You don’t configure a server, write a Dockerfile, or wire up monitoring — you
        pick an agent type, add a model key and a channel token, and it runs.
      </P>
      <P>
        Railway is a general-purpose, usage-based PaaS. It’s a genuinely pleasant developer experience: you deploy
        OpenClaw as a service from a repo or a Docker image, set your environment variables, and Railway handles the
        platform plumbing. But OpenClaw isn’t a first-class product there — it’s just another service you’re
        running. The deployment, updates, isolation design, and monitoring are yours. If you want a code-first
        platform and enjoy managing your own deploy, that control is exactly the point. If you’d rather skip the ops
        entirely, the specialized managed host is the cleaner fit.
      </P>

      <H2 id="table">Head-to-head</H2>
      <P>Figures verified as of June 2026. Where a cell isn’t a simple yes/no, we spell out the detail.</P>
      <ComparisonTable cols={['VibeOpenClaw', 'Railway']} rows={ROWS} highlightCol={0} />

      <H2 id="pricing">Pricing, side by side</H2>
      <P>
        VibeOpenClaw keeps it flat: <strong className="text-[#f0f4ff]">Pro at $24/mo</strong> (one agent, Telegram
        and Discord) and <strong className="text-[#f0f4ff]">Premium at $48/mo</strong> (up to three OpenClaw or
        Hermes agents, all channels including Slack). Because you bring your own keys across 13 model providers,
        your only variable cost is what you pay those providers directly — there’s no inference markup.
      </P>
      <P>
        Railway is usage-based, starting from around $5/mo and then charging for the compute, memory, and bandwidth
        your service actually consumes. For a small, idle service that can be inexpensive; for an always-on agent it
        will track your usage. The bigger difference is the work behind the bill: on Railway you’re paying for raw
        platform capacity and doing the deployment and operations yourself, whereas VibeOpenClaw’s flat price
        bundles the managed agent runtime.
      </P>

      <H2 id="setup-isolation">Setup, isolation, and ops</H2>
      <P>
        On VibeOpenClaw the new-agent flow is built for speed and safety: pick OpenClaw or Hermes, choose a model,
        paste a channel token, and the agent comes up in a dedicated Docker container in about 30 seconds. Each
        agent is isolated from every other agent, so one misconfiguration or compromised skill can’t reach another
        agent’s memory or keys, and those keys are encrypted at rest with AES-256-GCM. Updates and monitoring are
        handled for you.
      </P>
      <P>
        On Railway you’re the operator. You deploy OpenClaw from a repo or Docker image, define environment
        variables (including your provider keys), and decide how services are isolated from one another. That’s a
        lot of flexibility — you can run OpenClaw next to databases, queues, and other apps on the same platform —
        but the isolation model, secret handling, update cadence, and uptime are your responsibility. Both
        approaches are valid; it comes down to whether you want to manage a deployment or just run agents.
      </P>

      <H2 id="choose-us">Choose VibeOpenClaw if…</H2>
      <ul className="list-disc pl-6 space-y-2 text-[#c8d0e0]">
        <li>You want managed <strong className="text-[#f0f4ff]">OpenClaw and Hermes</strong> agents with no server to run.</li>
        <li>Fast, repeatable deploys matter — agents live in ~30 seconds, no config.</li>
        <li>You value per-agent Docker isolation and AES-256-GCM-encrypted keys.</li>
        <li>You prefer flat, predictable pricing ($24 or $48/mo) over usage-based billing.</li>
        <li>You’d rather not own updates, monitoring, or the deployment yourself.</li>
      </ul>

      <H2 id="choose-railway">Choose Railway if…</H2>
      <ul className="list-disc pl-6 space-y-2 text-[#c8d0e0]">
        <li>You want a code-first PaaS and enjoy managing your own deployment.</li>
        <li>You’re comfortable deploying OpenClaw from a repo or Docker image.</li>
        <li>You want to run OpenClaw alongside other services (databases, APIs, jobs) on one platform.</li>
        <li>Usage-based pricing fits your workload better than flat tiers.</li>
        <li>You prefer full control over configuration, isolation, and the update cadence.</li>
      </ul>

      <H2 id="links">Go deeper</H2>
      <P>
        Want the full picture on the managed side? See{' '}
        <a href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">managed OpenClaw hosting</a>, or read the{' '}
        <a href="/blog/best-openclaw-hosting-providers-2026" className="text-[#00e5cc] hover:underline">best OpenClaw hosting providers for 2026</a> rundown
        to see where managed hosts and self-deploy platforms land among the alternatives.
      </P>

      <FaqAccordion faqs={FAQ} />

      <Cta title="Deploy OpenClaw or Hermes in ~30 seconds" body="Per-agent Docker isolation, AES-256-GCM encrypted keys, and BYOK across 13 providers — no server to run, from $24/mo." />

      <Sources
        items={[
          { label: 'Railway — usage-based PaaS pricing (verified June 2026)', url: 'https://railway.com/pricing' },
          { label: 'VibeOpenClaw — managed OpenClaw hosting', url: `${SITE_URL}/openclaw-hosting` },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Compare', path: '/compare' },
            { name: 'VibeOpenClaw vs Railway', path: PATH },
          ]),
          articleLd({
            headline: 'VibeOpenClaw vs Railway: OpenClaw Hosting Compared',
            description: metadata.description as string,
            path: PATH,
            datePublished: PUBLISHED,
          }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
