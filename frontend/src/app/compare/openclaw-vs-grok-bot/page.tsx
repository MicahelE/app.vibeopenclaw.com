import type { Metadata } from 'next';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, StatBar, ComparisonTable, FaqAccordion, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, articleLd, jsonLd, type Faq } from '@/components/marketing/schema';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/compare/openclaw-vs-grok-bot';
const PUBLISHED = '2026-09-12';

export const metadata: Metadata = {
  title: 'OpenClaw vs Grok Bot: Open-Source vs SpaceXAI’s Agent',
  description:
    'OpenClaw vs Grok Bot — SpaceXAI’s new agent, built around Grok and reported as a direct answer to OpenClaw, compared on model choice, data control, and how it’s deployed.',
  keywords: ['openclaw vs grok bot', 'grok bot vs openclaw', 'grok bot openclaw comparison', 'spacexai grok bot', 'openclaw alternative grok'],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    type: 'article',
    url: `${SITE_URL}${PATH}`,
    title: 'OpenClaw vs Grok Bot: Open-Source vs SpaceXAI’s Agent',
    description: 'How the open-source, BYOK OpenClaw compares to SpaceXAI’s Grok Bot, built around Grok models.',
  },
};

const FAQ: Faq[] = [
  {
    q: 'What is Grok Bot?',
    a: 'Grok Bot is an AI agent from SpaceXAI (Elon Musk’s xAI, tied to SpaceX and Cursor per recent reporting from CNET and VentureBeat), built around xAI’s Grok models. CNET listed it among a wave of new agents alongside OpenClaw, Sai by Simular, Claude Computer Use, Manus, and OpenAI Operator.',
  },
  {
    q: 'Is Grok Bot built on OpenClaw?',
    a: 'No. Grok Bot is SpaceXAI’s own product. VentureBeat described it as "like OpenClaw, but super easy, reliable, and less scary to use" — positioning it as a friendlier, closed alternative to the open-source original rather than something built on it.',
  },
  {
    q: 'Can I use Grok models with OpenClaw instead of Grok Bot?',
    a: 'Yes. xAI lists OpenClaw as a supported integration, so you can add xAI as one of VibeOpenClaw’s 13 BYOK providers and run your OpenClaw agent on Grok models directly — without adopting Grok Bot as a separate, closed product.',
  },
  {
    q: 'What’s the real difference between OpenClaw and Grok Bot?',
    a: 'Openness and model choice. OpenClaw is open-source and works with any of 13 model providers (including Grok) — you choose the model and where the agent runs. Grok Bot is a closed SpaceXAI product built specifically around Grok, so you’re tied to one vendor’s model and infrastructure.',
  },
  {
    q: 'Which should I use?',
    a: 'If you want the flexibility to switch models or providers, keep your data on infrastructure you control, and reach 20+ messaging channels, OpenClaw (self-hosted or on a managed platform like VibeOpenClaw) is the more flexible pick. If you specifically want Grok’s models in an all-in-one closed package and don’t need provider flexibility, Grok Bot is the vendor-native option.',
  },
];

const ROWS: (string | boolean)[][] = [
  ['Publisher', 'Open-source community', 'SpaceXAI (xAI / SpaceX)'],
  ['Source model', 'Open source', 'Closed / proprietary'],
  ['Model choice', '13 BYOK providers, including Grok', 'Grok only'],
  ['Can self-host or choose your own host', true, false],
  ['Messaging channels', '20+ (Telegram, Discord, Slack, WhatsApp, …)', 'Not publicly detailed'],
  ['Data stays on infrastructure you control', true, false],
  ['GitHub stars', '376k+', 'Not applicable (closed source)'],
  ['Deploy time on VibeOpenClaw', '~30 seconds', 'Not applicable'],
];

export default function OpenClawVsGrokBotPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Compare', path: '/compare' }, { name: 'OpenClaw vs Grok Bot' }]} />

      <Hero
        eyebrow="Comparison"
        title="OpenClaw vs Grok Bot"
        subtitle={
          <>
            SpaceXAI’s new <strong className="text-[#f0f4ff]">Grok Bot</strong>, built around xAI’s Grok models, has
            been widely covered — including by CNET and VentureBeat — as a direct answer to{' '}
            <strong className="text-[#f0f4ff]">OpenClaw</strong>. Here’s how the open-source original compares to
            the closed, Grok-native agent.
          </>
        }
      />

      <StatBar
        stats={[
          { value: '376k+', label: 'OpenClaw GitHub stars' },
          { value: '13', label: 'BYOK model providers' },
          { value: '~30s', label: 'to deploy on VibeOpenClaw' },
          { value: '1', label: 'model family behind Grok Bot' },
        ]}
      />

      <H2 id="verdict">The short version</H2>
      <P>
        Grok Bot is SpaceXAI’s closed agent, built specifically around Grok. VentureBeat described it as{' '}
        <em>“like OpenClaw, but super easy, reliable, and less scary to use”</em> — a friendlier on-ramp, but one
        vendor, one model family, and infrastructure you don’t control. OpenClaw is the open-source original:
        you choose from 13 BYOK model providers (Grok included), and you choose where it runs — self-hosted or on
        a managed platform like VibeOpenClaw.
      </P>

      <H2 id="table">Head-to-head</H2>
      <P>Based on public reporting as of September 2026 — see sources below.</P>
      <ComparisonTable cols={['OpenClaw', 'Grok Bot']} rows={ROWS} highlightCol={0} />

      <H2 id="grok-in-openclaw">Grok, without giving up model choice</H2>
      <P>
        You don’t have to choose Grok Bot to get Grok. xAI lists OpenClaw as a supported integration for
        SuperGrok and X Premium subscribers, so on VibeOpenClaw you can add xAI as one of your BYOK providers and
        run your OpenClaw agent on Grok models — while keeping the option to switch to OpenAI, Anthropic, Google,
        or 10 other providers whenever you want, and without moving your agent onto SpaceXAI’s infrastructure.
      </P>

      <H2 id="related">Comparing another big-tech agent?</H2>
      <P>
        See how OpenClaw stacks up against{' '}
        <a href="/compare/openclaw-vs-meta-muse" className="text-[#00e5cc] hover:underline">Meta Muse</a>,{' '}
        <a href="/compare/openclaw-vs-gemini-spark" className="text-[#00e5cc] hover:underline">Google Gemini Spark</a>, or read the{' '}
        <a href="/compare/openclaw-vs-big-tech-ai-agents" className="text-[#00e5cc] hover:underline">combined comparison</a> of all three.
      </P>

      <H2 id="why-open">Why that matters</H2>
      <ul className="list-disc pl-6 space-y-2 text-[#c8d0e0]">
        <li>Model choice — 13 BYOK providers instead of being locked to Grok specifically.</li>
        <li>Data control — your agent and provider keys live on infrastructure you choose, not SpaceXAI’s.</li>
        <li>Portability — self-host, or move between managed hosts, without losing your agent or its setup.</li>
        <li>Channel reach — 20+ messaging channels (Telegram, Discord, Slack, WhatsApp) vs a single vendor app.</li>
      </ul>

      <H2 id="choose">Where VibeOpenClaw fits</H2>
      <P>
        VibeOpenClaw runs OpenClaw (and Hermes) for you with the same open BYOK model choice — Grok included —
        minus the Docker, SSL, and server work of self-hosting. Deploy in about 30 seconds, with per-agent Docker
        isolation and AES-256-GCM-encrypted keys.
      </P>

      <FaqAccordion faqs={FAQ} />

      <Cta title="Run Grok inside an open-source agent" body="Add xAI as a BYOK provider and deploy OpenClaw in ~30 seconds — no platform lock-in, from $24/mo." />

      <Sources
        items={[
          { label: 'CNET — SpaceXAI Joins the AI Agent Game With Grok Bot', url: 'https://www.cnet.com/tech/services-and-software/ai/spacexais-grok-bot/' },
          { label: 'VentureBeat — SpaceXAI’s Grok Bot turns agents into persistent digital assistants', url: 'https://venturebeat.com/orchestration/spacexais-grok-bot/' },
          { label: 'xAI — Use Grok in OpenClaw', url: 'https://x.ai/news' },
          { label: 'OpenClaw — official repository (376k+ stars)', url: 'https://github.com/openclaw/openclaw' },
          { label: 'Broader comparison', url: `${SITE_URL}/compare/openclaw-vs-big-tech-ai-agents` },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Compare', path: '/compare' },
            { name: 'OpenClaw vs Grok Bot', path: PATH },
          ]),
          articleLd({
            headline: 'OpenClaw vs Grok Bot: Open-Source vs SpaceXAI’s Agent',
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
