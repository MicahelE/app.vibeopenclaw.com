import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, ComparisonTable, FaqAccordion, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, articleLd, jsonLd, type Faq } from '@/components/marketing/schema';
import { ALL_PROVIDERS } from '@/content/providers';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/blog/best-openclaw-hosting-providers-2026';
const PUBLISHED = '2026-06-03';

export const metadata: Metadata = {
  title: 'Best OpenClaw Hosting Providers in 2026 (Managed & VPS)',
  description:
    'The best OpenClaw hosting providers in 2026 compared — managed (VibeOpenClaw, xCloud, MyClaw, OneClaw) vs DIY VPS. Pricing, isolation, BYOK, and which agents each one runs.',
  keywords: ['best openclaw hosting', 'best openclaw hosting providers', 'openclaw hosting providers', 'best managed openclaw hosting', 'openclaw hosting 2026'],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { type: 'article', url: `${SITE_URL}${PATH}`, title: 'Best OpenClaw Hosting Providers in 2026', description: 'Managed vs VPS OpenClaw hosting compared on price, isolation, and BYOK.' },
};

const FAQ: Faq[] = [
  { q: 'What is the best OpenClaw hosting provider in 2026?', a: 'It depends on your needs. For a managed deploy that runs both OpenClaw and Hermes with per-agent Docker isolation and true BYOK, VibeOpenClaw ($24/mo) is the pick. xCloud is strong if you also host WordPress/Laravel on the same VPS. MyClaw and OneClaw are OpenClaw-only managed options, and a DIY VPS (Hetzner/Contabo) is cheapest in dollars but most expensive in time.' },
  { q: 'How much does OpenClaw hosting cost?', a: 'Managed OpenClaw hosting in 2026 runs roughly $10–$95/month depending on RAM and tier: OneClaw from $9.99, MyClaw from $19, VibeOpenClaw from $24, xCloud from $24 (up to ~$225 for large VPS sizes). A DIY VPS is $5–$15/month plus your own time. All of them use BYOK, so budget another ~$15–$40/month for your model provider.' },
  { q: 'Is managed OpenClaw hosting worth it over a VPS?', a: 'For most people, yes. A VPS is cheaper on paper but you own Docker, SSL, patching, backups, monitoring, and 24/7 uptime. Managed hosting turns that into a fixed monthly fee and a ~30-second deploy. Self-host only if you want full filesystem control and already have the ops muscle.' },
  { q: 'Which OpenClaw hosts also run Hermes Agent?', a: 'VibeOpenClaw runs both OpenClaw and Hermes (side-by-side on Premium). xCloud offers a separate Hermes hosting page. MyClaw and OneClaw are OpenClaw-only at the time of writing.' },
  { q: 'Do I still need my own API keys with managed hosting?', a: 'Yes — every major provider uses BYOK (bring your own keys) for the model. You add your own OpenAI/Anthropic/etc. key and pay that provider directly. Good managed hosts (like VibeOpenClaw) never mark up inference.' },
  { q: 'What should I look for in an OpenClaw host?', a: 'One-click deploy, per-agent isolation, encrypted key storage, automatic SSL and updates, the channels you need (Telegram/Discord/Slack), transparent BYOK with no inference markup, and clear month-to-month pricing.' },
];

// Master comparison table built from the shared provider data.
const COLS = ALL_PROVIDERS.map((p) => p.name);
const ROWS: (string | boolean)[][] = [
  ['From price', ...ALL_PROVIDERS.map((p) => p.fromPrice)],
  ['Hosts OpenClaw', ...ALL_PROVIDERS.map((p) => p.hostsOpenClaw)],
  ['Hosts Hermes', ...ALL_PROVIDERS.map((p) => p.hostsHermes)],
  ['BYOK (no markup)', ...ALL_PROVIDERS.map((p) => p.byokNoMarkup)],
  ['Isolation', ...ALL_PROVIDERS.map((p) => p.isolation)],
  ['Channels', ...ALL_PROVIDERS.map((p) => p.channels)],
];

export default function BestProvidersPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: 'Best OpenClaw Hosting Providers' }]} />

      <Hero
        eyebrow="Comparison · 2026"
        title="Best OpenClaw hosting providers in 2026"
        subtitle="Managed and VPS options compared on price, isolation, BYOK, and which agents they run — so you can pick the right home for your OpenClaw (Clawdbot) AI assistant."
      />

      <P>OpenClaw exploded to <strong className="text-[#f0f4ff]">376,000+ GitHub stars</strong> by June 2026, and a crop of managed hosts now compete to run it for you. We compared the leading managed providers against the DIY-VPS route on the things that actually matter: deploy time, per-agent isolation, encrypted key storage, supported channels, and honest BYOK pricing. Here’s the short version, then the detail.</P>

      <H2 id="table">At a glance</H2>
      <ComparisonTable cols={COLS} rows={ROWS} highlightCol={0} />

      <H2 id="ranked">The providers, ranked</H2>
      {ALL_PROVIDERS.map((p, i) => (
        <div key={p.id} className="my-6 rounded-2xl border border-[rgba(136,146,176,0.15)] bg-[rgba(10,15,26,0.4)] p-6">
          <h3 className="text-xl font-bold text-[#f0f4ff] mb-1" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            {i + 1}. {p.name} <span className="text-sm font-normal text-[#5a6480]">— from {p.fromPrice}</span>
          </h3>
          <p className="text-sm text-[#8892b0] mb-2">{p.blurb}</p>
          <p className="text-sm text-[#c8d0e0]">{p.note}</p>
          {p.id === 'vibeopenclaw' && (
            <p className="text-sm text-[#c8d0e0] mt-2">
              → <Link href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">Managed OpenClaw hosting</Link>{' '}
              or <Link href="/hermes-agent-hosting" className="text-[#00e5cc] hover:underline">Hermes hosting</Link>.
            </p>
          )}
        </div>
      ))}

      <P><em>Disclosure: VibeOpenClaw publishes this comparison. We’ve kept the criteria objective and the competitor facts sourced; figures are current as of June 2026 and may change.</em></P>

      <H2 id="how-to-choose">How to choose</H2>
      <P>Pick by what you value most. Want the cheapest sticker price and don’t mind ops? A DIY VPS or OneClaw. Want OpenClaw running in 30 seconds with isolation and BYOK? VibeOpenClaw or MyClaw. Need both OpenClaw and Hermes, or keys encrypted at rest with no inference markup? VibeOpenClaw. Already run WordPress/Laravel and want one panel? xCloud.</P>

      <FaqAccordion faqs={FAQ} />

      <Cta title="Deploy OpenClaw the managed way" body="One-click OpenClaw or Hermes, per-agent Docker isolation, true BYOK — from $24/mo." />

      <Sources
        items={[
          { label: 'OpenClaw — official repository (376k+ stars, June 2026)', url: 'https://github.com/openclaw/openclaw' },
          { label: 'xCloud — OpenClaw hosting', url: 'https://xcloud.host/openclaw-hosting/' },
          { label: 'MyClaw.ai', url: 'https://myclaw.ai/' },
          { label: 'OneClaw', url: 'https://www.oneclaw.net/' },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: 'Best OpenClaw Hosting Providers 2026', path: PATH }]),
          articleLd({ headline: 'Best OpenClaw Hosting Providers in 2026', description: metadata.description as string, path: PATH, datePublished: PUBLISHED }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
