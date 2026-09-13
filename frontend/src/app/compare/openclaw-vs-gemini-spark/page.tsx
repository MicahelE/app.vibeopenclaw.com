import type { Metadata } from 'next';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, StatBar, ComparisonTable, FaqAccordion, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, articleLd, jsonLd, type Faq } from '@/components/marketing/schema';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/compare/openclaw-vs-gemini-spark';
const PUBLISHED = '2026-09-13';

export const metadata: Metadata = {
  title: 'OpenClaw vs Gemini Spark: Open-Source vs Google’s Agent',
  description:
    'OpenClaw vs Gemini Spark — Google’s always-on AI agent, reported by The Verge as Google’s answer to OpenClaw, compared on model choice, data control, and where each one runs.',
  keywords: ['openclaw vs gemini spark', 'gemini spark vs openclaw', 'google gemini spark alternative', 'is gemini spark better than openclaw', 'gemini spark open source alternative'],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    type: 'article',
    url: `${SITE_URL}${PATH}`,
    title: 'OpenClaw vs Gemini Spark: Open-Source vs Google’s Agent',
    description: 'How the open-source, BYOK OpenClaw compares to Google’s Gemini Spark, an always-on agent built around the Gemini model family.',
  },
};

const FAQ: Faq[] = [
  {
    q: 'What is Gemini Spark?',
    a: 'Gemini Spark is Google’s always-on personal AI agent, reported under the working codename "Remy" before its public unveiling. The Verge described it as an agent that can write emails and track schedules, and Business Insider reported internal descriptions framing it as elevating the Gemini assistant into a full agent.',
  },
  {
    q: 'Is Gemini Spark built on OpenClaw?',
    a: 'No. Gemini Spark is Google’s own closed product, but The Verge headlined its launch as "Google is launching its own version of OpenClaw" — positioning it as Google’s direct answer rather than something built on OpenClaw’s codebase.',
  },
  {
    q: 'Is Gemini Spark better than OpenClaw?',
    a: 'It depends what you need. Gemini Spark is tightly integrated with Google’s own ecosystem (Gmail, Calendar, and the Gemini model family) with no setup required. OpenClaw is open-source, works with 13 BYOK model providers instead of only Google’s, connects to 20+ messaging channels, and can run on infrastructure you choose. Gemini Spark trades that flexibility for a polished, single-vendor experience inside Google’s products.',
  },
  {
    q: 'Can I use Google’s Gemini models with OpenClaw instead of Gemini Spark?',
    a: 'Yes. Google is one of VibeOpenClaw’s 13 BYOK model providers, so you can run your OpenClaw agent on Gemini models directly with your own API key — without adopting Gemini Spark as a separate, closed product tied to your Google account.',
  },
  {
    q: 'Which should I use?',
    a: 'If you live inside Gmail and Google Calendar and want an agent that just works with no setup, Gemini Spark is the native option. If you want to choose your model (Gemini included), reach 20+ messaging channels, and keep your agent and data on infrastructure you control, OpenClaw — self-hosted or on VibeOpenClaw — is the more flexible pick.',
  },
];

const ROWS: (string | boolean)[][] = [
  ['Publisher', 'Open-source community', 'Google'],
  ['Source model', 'Open source', 'Closed / proprietary'],
  ['Model choice', '13 BYOK providers, including Google', 'Gemini models only'],
  ['Tied to a Google account', false, true],
  ['Can self-host or choose your own host', true, false],
  ['Messaging channels', '20+ (Telegram, Discord, Slack, WhatsApp, …)', 'Google ecosystem (Gmail, Calendar, …)'],
  ['Data stays on infrastructure you control', true, false],
  ['GitHub stars', '376k+', 'Not applicable (closed source)'],
  ['Deploy time on VibeOpenClaw', '~30 seconds', 'Not applicable'],
];

export default function OpenClawVsGeminiSparkPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Compare', path: '/compare' }, { name: 'OpenClaw vs Gemini Spark' }]} />

      <Hero
        eyebrow="Comparison"
        title="OpenClaw vs Gemini Spark"
        subtitle={
          <>
            Google’s always-on agent, <strong className="text-[#f0f4ff]">Gemini Spark</strong>, was headlined by
            The Verge as Google’s own version of <strong className="text-[#f0f4ff]">OpenClaw</strong>. Here’s how
            the open-source original compares to Google’s closed, account-bound agent.
          </>
        }
      />

      <StatBar
        stats={[
          { value: '376k+', label: 'OpenClaw GitHub stars' },
          { value: '13', label: 'BYOK model providers' },
          { value: '~30s', label: 'to deploy on VibeOpenClaw' },
          { value: '20+', label: 'messaging channels' },
        ]}
      />

      <H2 id="verdict">The short version</H2>
      <P>
        Gemini Spark is Google’s polished, closed agent — pre-wired into Gmail, Calendar, and the rest of Google’s
        ecosystem, built around the Gemini model family, with no setup required. OpenClaw is the open-source
        original it’s measured against: you choose from 13 BYOK model providers (Google included), connect to
        20+ messaging channels, and choose where it runs. Gemini Spark trades that flexibility for convenience
        inside Google’s own products.
      </P>

      <H2 id="table">Head-to-head</H2>
      <P>Based on public reporting (The Verge, Business Insider) as of September 2026 — see sources below.</P>
      <ComparisonTable cols={['OpenClaw', 'Gemini Spark']} rows={ROWS} highlightCol={0} />

      <H2 id="related">Comparing another big-tech agent?</H2>
      <P>
        See how OpenClaw stacks up against{' '}
        <a href="/compare/openclaw-vs-meta-muse" className="text-[#00e5cc] hover:underline">Meta Muse</a>,{' '}
        <a href="/compare/openclaw-vs-grok-bot" className="text-[#00e5cc] hover:underline">SpaceXAI’s Grok Bot</a>, or read the{' '}
        <a href="/compare/openclaw-vs-big-tech-ai-agents" className="text-[#00e5cc] hover:underline">combined comparison</a> of all three.
      </P>

      <H2 id="why-open">Why open-source and BYOK matter here</H2>
      <ul className="list-disc pl-6 space-y-2 text-[#c8d0e0]">
        <li>Pick the model — OpenAI, Anthropic, xAI, and 10 more — instead of only Google’s Gemini family.</li>
        <li>Your agent isn’t tied to a Google account or subject to Google’s platform terms.</li>
        <li>Reach 20+ messaging channels, including Telegram, Discord, Slack, and WhatsApp.</li>
        <li>Self-host or move between managed hosts without losing your agent or its configuration.</li>
      </ul>

      <H2 id="choose">Where VibeOpenClaw fits</H2>
      <P>
        VibeOpenClaw runs the open-source OpenClaw (and Hermes) for you — same BYOK model choice, Gemini included,
        and no platform lock-in — without the Docker, SSL, and server work of self-hosting. Deploy in about 30
        seconds, with per-agent Docker isolation and AES-256-GCM-encrypted keys.
      </P>

      <FaqAccordion faqs={FAQ} />

      <Cta title="Deploy the open-source alternative to Gemini Spark" body="Pick your model from 13 BYOK providers, including Google — deploy OpenClaw in ~30 seconds, from $24/mo." />

      <Sources
        items={[
          { label: 'The Verge — Google is launching its own version of OpenClaw', url: 'https://www.theverge.com/tech/ai/news/google-gemini-spark' },
          { label: 'Business Insider — Google is building an AI agent that could be its answer to OpenClaw', url: 'https://www.businessinsider.com/tech/ai/google-gemini-spark-openclaw-answer' },
          { label: 'OpenClaw — official repository (376k+ stars)', url: 'https://github.com/openclaw/openclaw' },
          { label: 'Broader comparison', url: `${SITE_URL}/compare/openclaw-vs-big-tech-ai-agents` },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Compare', path: '/compare' },
            { name: 'OpenClaw vs Gemini Spark', path: PATH },
          ]),
          articleLd({
            headline: 'OpenClaw vs Gemini Spark: Open-Source vs Google’s Agent',
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
