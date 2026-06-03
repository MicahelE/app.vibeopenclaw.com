import type { Metadata } from 'next';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { ComparisonTable, FaqAccordion, Cta, H2, P, Sources, JsonLd, Hero } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, articleLd, jsonLd, type Faq } from '@/components/marketing/schema';
import { PLANS } from '@/content/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/compare/vibeopenclaw-vs-myclaw';
const PUBLISHED = '2026-06-03';

export const metadata: Metadata = {
  title: 'VibeOpenClaw vs MyClaw: OpenClaw Hosting Compared',
  description:
    'VibeOpenClaw vs MyClaw — a neutral head-to-head of two managed OpenClaw hosts: pricing ($24 vs $19), Hermes support, Docker isolation, and BYOK.',
  keywords: [
    'vibeopenclaw vs myclaw',
    'myclaw vs vibeopenclaw',
    'myclaw alternative comparison',
    'managed openclaw hosting comparison',
    'myclaw alternative',
  ],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    type: 'article',
    url: `${SITE_URL}${PATH}`,
    title: 'VibeOpenClaw vs MyClaw — OpenClaw Hosting Compared',
    description:
      'A fair, side-by-side comparison of VibeOpenClaw and MyClaw for managed OpenClaw hosting: price, Hermes support, isolation, encryption, BYOK, and channels.',
    publishedTime: PUBLISHED,
  },
};

const ROWS: (string | boolean)[][] = [
  ['From price', '$24/mo', '$19/mo'],
  ['Plans / tiers', 'Pro $24, Premium $48', '$19, $39, $79'],
  ['Hosts OpenClaw', true, true],
  ['Hosts Hermes Agent', true, false],
  ['One-click deploy', true, true],
  ['Per-agent Docker isolation', 'Yes — dedicated container', 'Isolated container'],
  ['Encrypted keys (AES-256-GCM)', true, '—'],
  ['BYOK (no inference markup)', true, true],
  ['Messaging channels', 'Telegram, Discord, Slack', 'Telegram, WhatsApp, Slack, Discord'],
];

const FAQ: Faq[] = [
  {
    q: 'What is the main difference between VibeOpenClaw and MyClaw?',
    a: 'Both are managed OpenClaw hosts with one-click deploy, isolated containers, and BYOK. The headline difference: MyClaw is OpenClaw-only and starts a little cheaper at $19/month, while VibeOpenClaw runs both OpenClaw and Hermes Agent, gives each agent its own Docker container, and encrypts your provider keys at rest with AES-256-GCM — starting at $24/month.',
  },
  {
    q: 'Which one is cheaper?',
    a: 'MyClaw has the lower entry price at $19/month versus VibeOpenClaw’s $24/month Pro plan. If lowest cost is your only deciding factor and you only ever need OpenClaw, MyClaw’s starter tier wins on price. VibeOpenClaw’s $24 includes per-agent Docker isolation and AES-256-GCM key encryption, and its Premium tier ($48) adds Hermes support and Slack.',
  },
  {
    q: 'Can MyClaw host Hermes Agent?',
    a: 'No. As of June 2026, MyClaw is OpenClaw-only. If you want to run Hermes Agent — or run OpenClaw and Hermes side-by-side on one platform — VibeOpenClaw is the option that supports both. See our Hermes Agent hosting page for details.',
  },
  {
    q: 'How do the channels compare?',
    a: 'MyClaw lists Telegram, WhatsApp, Slack, and Discord. VibeOpenClaw’s managed service exposes Telegram and Discord on Pro, plus Slack on Premium. If WhatsApp specifically matters to you, MyClaw covers it today; if you want Telegram, Discord, and Slack, both providers have you covered.',
  },
  {
    q: 'Do both providers support BYOK?',
    a: 'Yes. Both let you bring your own model provider keys and pay the provider directly, with no inference markup. VibeOpenClaw supports BYOK across 13 providers (OpenAI, Anthropic, Google, Groq, xAI, Mistral, DeepSeek, Together, Fireworks, Perplexity, OpenRouter, Cohere, NVIDIA) and encrypts them at rest with AES-256-GCM.',
  },
  {
    q: 'Which should I choose?',
    a: 'Choose MyClaw if you want the lowest entry price and will only ever need OpenClaw. Choose VibeOpenClaw if you also want Hermes Agent, explicit per-agent Docker isolation, and AES-256-GCM key encryption. Both are managed, one-click hosts, so it largely comes down to whether you need Hermes and how you weigh price against those isolation and encryption guarantees.',
  },
];

export default function VibeOpenClawVsMyClawPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Compare' }, { name: 'VibeOpenClaw vs MyClaw' }]} />

      <Hero
        eyebrow="Comparison · Updated June 2026"
        title="VibeOpenClaw vs MyClaw"
        subtitle={
          <>
            Two managed OpenClaw hosts, compared fairly. Both offer one-click deploy, isolated containers, and BYOK with no
            inference markup. <strong className="text-[#f0f4ff]">MyClaw</strong> is OpenClaw-only and starts a bit cheaper at
            $19/mo; <strong className="text-[#f0f4ff]">VibeOpenClaw</strong> runs both OpenClaw and Hermes, with per-agent Docker
            isolation and AES-256-GCM key encryption, from ${PLANS.pro.monthly}/mo.
          </>
        }
      />

      <H2 id="verdict">The short verdict</H2>
      <P>
        VibeOpenClaw and MyClaw are both managed hosts for OpenClaw: you sign up, deploy in one click, and your agent runs in
        an isolated container so you never touch Docker or SSH. They are genuinely similar products, and the right pick depends
        on a couple of specific needs.
      </P>
      <P>
        MyClaw&apos;s clearest advantage is price — its starter tier begins at $19/month, undercutting VibeOpenClaw&apos;s
        $24/month Pro plan. If you only ever plan to run OpenClaw and want the lowest entry cost, that&apos;s a real, honest
        reason to pick MyClaw. VibeOpenClaw&apos;s differentiators are scope and security posture: it hosts{' '}
        <a href="/hermes-agent-hosting" className="text-[#00e5cc] hover:underline">Hermes Agent</a> in addition to{' '}
        <a href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">OpenClaw</a>, gives every agent its own dedicated
        Docker container, and encrypts your provider keys at rest with AES-256-GCM. Neither marks up inference — both are true
        BYOK.
      </P>

      <H2 id="comparison">Head-to-head</H2>
      <P>
        Here is how the two stack up on the points that usually decide it. Figures are accurate as of June 2026 — MyClaw&apos;s
        details are from its own site, and VibeOpenClaw&apos;s from our platform.
      </P>
      <ComparisonTable cols={['VibeOpenClaw', 'MyClaw']} rows={ROWS} highlightCol={0} />

      <H2 id="pricing">Pricing in detail</H2>
      <P>
        MyClaw offers three published tiers — $19, $39, and $79 per month — and the $19 entry point is the lowest starting price
        of the two. VibeOpenClaw keeps things to two plans: Pro at ${PLANS.pro.monthly}/month (1 OpenClaw agent, 2 GB RAM,
        Telegram and Discord) and Premium at ${PLANS.premium.monthly}/month (up to 3 OpenClaw or Hermes agents, 4 GB RAM each,
        all channels including Slack, priority support, and usage analytics). On both platforms you bring your own model keys and
        pay the provider directly, so inference cost is the same either way — neither host marks it up.
      </P>

      <H2 id="isolation">Isolation and key handling</H2>
      <P>
        Both providers run each agent in an isolated container, so this is largely a tie in practice. The difference is in how
        explicitly it&apos;s described and what surrounds it. VibeOpenClaw documents per-agent Docker isolation — every agent gets
        its own dedicated container with its own RAM — and stores provider keys encrypted at rest with AES-256-GCM, decrypting
        them only in-process to make model calls and never re-displaying or logging them. MyClaw also uses isolated containers
        for each deployment. If explicit Docker-level isolation plus documented at-rest key encryption are decision factors for
        you, VibeOpenClaw spells those out; if container isolation alone is enough, both deliver it.
      </P>

      <section className="grid md:grid-cols-2 gap-6 my-8">
        <div className="p-6 rounded-2xl border border-[rgba(255,77,77,0.25)] bg-[rgba(255,77,77,0.04)]">
          <h2 className="text-xl font-bold text-[#ff4d4d] mb-3" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            Choose VibeOpenClaw if…
          </h2>
          <ul className="space-y-2 text-sm text-[#c8d0e0]">
            <li>• You want to run Hermes Agent too — or OpenClaw and Hermes side-by-side on one platform.</li>
            <li>• You want explicit per-agent Docker isolation, with a dedicated container per agent.</li>
            <li>• You want provider keys encrypted at rest with AES-256-GCM.</li>
            <li>• You value BYOK across 13 model providers with no inference markup.</li>
          </ul>
        </div>
        <div className="p-6 rounded-2xl border border-[rgba(0,229,204,0.25)] bg-[rgba(0,229,204,0.04)]">
          <h2 className="text-xl font-bold text-[#00e5cc] mb-3" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            Choose MyClaw if…
          </h2>
          <ul className="space-y-2 text-sm text-[#c8d0e0]">
            <li>• You want the lowest entry price — its starter tier begins at $19/month.</li>
            <li>• You only ever need OpenClaw and don&apos;t plan to run Hermes.</li>
            <li>• Container isolation and one-click deploy are enough for your needs.</li>
            <li>• WhatsApp is a channel you specifically need today.</li>
          </ul>
        </div>
      </section>

      <FaqAccordion faqs={FAQ} />

      <P>
        Want the wider field? See our roundup of the{' '}
        <a href="/blog/best-openclaw-hosting-providers-2026" className="text-[#00e5cc] hover:underline">best OpenClaw hosting providers in 2026</a>{' '}
        for how these two compare against other managed and self-hosted options.
      </P>

      <Cta
        title="Try managed OpenClaw — and Hermes — on VibeOpenClaw"
        body="One-click deploy, per-agent Docker isolation, AES-256-GCM key encryption, and BYOK across 13 providers — from $24/mo."
      />

      <Sources
        items={[
          { label: 'MyClaw — official website (pricing, channels, features, June 2026)', url: 'https://myclaw.ai' },
          { label: 'VibeOpenClaw — managed OpenClaw hosting (pricing, isolation, BYOK)', url: `${SITE_URL}/openclaw-hosting` },
          { label: 'OpenClaw — official repository', url: 'https://github.com/openclaw/openclaw' },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Compare', path: '/compare' },
            { name: 'VibeOpenClaw vs MyClaw', path: PATH },
          ]),
          articleLd({
            headline: 'VibeOpenClaw vs MyClaw: OpenClaw Hosting Compared',
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
