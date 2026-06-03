import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, ComparisonTable, FaqAccordion, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, articleLd, jsonLd, type Faq } from '@/components/marketing/schema';
import { ALL_PROVIDERS } from '@/content/providers';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/blog/openclaw-hosting-cost';
const PUBLISHED = '2026-06-03';

export const metadata: Metadata = {
  title: 'How Much Does OpenClaw Hosting Cost in 2026?',
  description:
    'An honest 2026 breakdown of OpenClaw hosting cost: managed prices ($9.99–$48/mo), the BYOK model-API budget people forget, DIY VPS true cost, and total scenarios.',
  keywords: ['openclaw hosting cost', 'openclaw pricing', 'how much does openclaw cost', 'openclaw hosting price'],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    type: 'article',
    url: `${SITE_URL}${PATH}`,
    title: 'How Much Does OpenClaw Hosting Cost in 2026?',
    description: 'The two cost buckets of running OpenClaw — the hosting fee and your BYOK model-API spend — explained with directional ranges.',
  },
};

const FAQ: Faq[] = [
  {
    q: 'How much does OpenClaw hosting cost in 2026?',
    a: 'There are two costs. First, the hosting fee: managed OpenClaw hosting runs roughly $9.99–$48/month (OneClaw from $9.99, MyClaw $19/$39/$79, VibeOpenClaw $24 Pro / $48 Premium, xCloud from $24 up to ~$225 by VPS size), while a DIY VPS is $5–$15/month plus your time. Second, the BYOK model API: every host has you bring your own keys, so you also pay your model provider directly — typically a directional $10–$50+/month depending on how heavily you use your agent and which model you pick.',
  },
  {
    q: 'Why is the model API cost separate from the hosting fee?',
    a: 'OpenClaw is BYOK (bring your own keys). The host runs the software, containers, channels and uptime; the actual thinking is done by a model provider you connect with your own API key. You pay that provider directly for tokens. A good host never marks up your inference — the meter is between you and OpenAI/Anthropic/etc., not the host.',
  },
  {
    q: 'What is a realistic monthly OpenClaw API budget?',
    a: 'It depends entirely on your usage and model, so treat any figure as directional rather than precise. A light user sending a handful of messages a day on a mid-tier model often lands in the low tens of dollars per month. A power user running long conversations, tool calls and a frontier model can run much higher. The honest answer: start small, watch your provider dashboard for a week, and extrapolate.',
  },
  {
    q: 'Is a DIY VPS actually cheaper for OpenClaw?',
    a: 'On the sticker price, yes — a Hetzner or Contabo VPS is $5–$15/month. But the true cost includes your time: installing and updating Docker, configuring SSL, OS patching, backups, monitoring and keeping it online 24/7. If your time is worth anything, managed hosting at $24–$48/month is often cheaper once you count the hours.',
  },
  {
    q: 'Does VibeOpenClaw mark up the model API?',
    a: 'No. VibeOpenClaw is BYOK across 13 providers and never marks up inference — you pay your model provider directly. We charge a flat $24/mo (Pro) or $48/mo (Premium) for managed hosting, and your keys are encrypted at rest with AES-256-GCM.',
  },
  {
    q: 'What do I get on VibeOpenClaw Pro vs Premium?',
    a: 'Pro is $24/month: 1 agent, 2GB RAM, Telegram and Discord channels. Premium is $48/month: 3 agents, 4GB RAM each, and all channels including Slack. Both are true BYOK with per-agent Docker isolation and no inference markup.',
  },
  {
    q: 'Are there hidden fees in OpenClaw hosting?',
    a: 'The two things people forget are the BYOK model spend (separate from the hosting fee) and, on a DIY VPS, the cost of your own time for ops. Watch out for hosts that mark up inference or scale price steeply with VPS size. Transparent providers publish flat month-to-month pricing and keep BYOK at cost.',
  },
];

// Managed-vs-DIY price snapshot built from the shared provider data.
const COLS = ALL_PROVIDERS.map((p) => p.name);
const ROWS: (string | boolean)[][] = [
  ['Hosting fee (from)', ...ALL_PROVIDERS.map((p) => p.fromPrice)],
  ['Model API (BYOK)', ...ALL_PROVIDERS.map(() => 'You pay provider')],
  ['Marks up inference', ...ALL_PROVIDERS.map((p) => !p.byokNoMarkup)],
  ['Ops handled for you', ...ALL_PROVIDERS.map((p) => p.id !== 'diy-vps')],
  ['Isolation', ...ALL_PROVIDERS.map((p) => p.isolation)],
];

export default function OpenClawHostingCostPage() {
  return (
    <MarketingShell>
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: 'OpenClaw Hosting Cost' },
        ]}
      />

      <Hero
        eyebrow="Pricing · 2026"
        title="How much does OpenClaw hosting cost in 2026?"
        subtitle="An honest breakdown of what running OpenClaw actually costs — the managed hosting fee, plus the BYOK model-API budget almost everyone forgets to plan for."
      />

      <P>
        When people ask &ldquo;how much does OpenClaw cost?&rdquo; they usually picture a single number. In reality there are
        <strong className="text-[#f0f4ff]"> two cost buckets</strong>, and the second one trips up most newcomers:
      </P>
      <P>
        <strong className="text-[#f0f4ff]">1. The hosting fee</strong> — what you pay a managed provider (or a VPS) to run the OpenClaw
        software, containers, channels, SSL and uptime. <strong className="text-[#f0f4ff]">2. Your BYOK model-API spend</strong> — what you
        pay your model provider directly for the tokens your agent actually consumes. OpenClaw is bring-your-own-keys, so this meter is
        between you and OpenAI/Anthropic/etc. — not the host. Budget for both and there are no surprises.
      </P>

      <H2 id="managed-prices">Managed hosting prices</H2>
      <P>
        Managed OpenClaw hosting in 2026 spans roughly $9.99 to $48/month for entry tiers, with VPS-backed hosts scaling higher as you add
        RAM. Here&rsquo;s the snapshot, current as of June 2026:
      </P>
      <ComparisonTable cols={COLS} rows={ROWS} highlightCol={0} />
      <P>
        Reading that as plain prices: <strong className="text-[#f0f4ff]">OneClaw</strong> from $9.99, <strong className="text-[#f0f4ff]">MyClaw</strong>{' '}
        at $19/$39/$79, <strong className="text-[#f0f4ff]">VibeOpenClaw</strong> at $24 (Pro) and $48 (Premium),{' '}
        <strong className="text-[#f0f4ff]">xCloud</strong> from $24 (up to ~$225 for large VPS sizes), and a{' '}
        <strong className="text-[#f0f4ff]">DIY VPS</strong> at $5–$15/month plus your own time. For the full feature-by-feature view, see our{' '}
        <Link href="/blog/best-openclaw-hosting-providers-2026" className="text-[#00e5cc] hover:underline">best OpenClaw hosting providers comparison</Link>.
      </P>

      <H2 id="byok-cost">The BYOK API cost everyone forgets</H2>
      <P>
        Every major OpenClaw host is BYOK — you add your own model key and pay that provider directly. That&rsquo;s a feature, not a catch:
        it means a good host <strong className="text-[#f0f4ff]">never marks up your inference</strong>, and you&rsquo;re free to switch models
        whenever a cheaper or smarter one ships. It also means your monthly model bill is a separate line item from the hosting fee.
      </P>
      <P>
        How much is it? <strong className="text-[#f0f4ff]">It depends on your usage and model</strong> — so treat any number as directional,
        not a benchmark. A few signals that move the meter:
      </P>
      <P>
        <strong className="text-[#f0f4ff]">Volume</strong> — a chat agent you ping a few times a day costs far less than one running long,
        tool-heavy conversations all day. <strong className="text-[#f0f4ff]">Model tier</strong> — a small/mid model is a fraction of a frontier
        model per token. <strong className="text-[#f0f4ff]">Context size</strong> — long histories and big documents inflate every call.
        Practically, a light personal assistant often sits in the low tens of dollars a month, while a busy power-user setup on a frontier
        model can run several times that. The honest move: run it for a week, watch your provider dashboard, and extrapolate from real numbers
        rather than a quoted figure. If you want the model trade-offs in depth, read our{' '}
        <Link href="/blog/byok-ai-agent-platform" className="text-[#00e5cc] hover:underline">BYOK AI agent platform guide</Link>.
      </P>

      <H2 id="diy-cost">DIY VPS true cost</H2>
      <P>
        A raw VPS from Hetzner or Contabo is the cheapest sticker price — $5–$15/month. But the <em>true</em> cost of self-hosting OpenClaw is
        the VPS fee plus your time, and the time line is the one people underestimate:
      </P>
      <P>
        You own the install and updates of <strong className="text-[#f0f4ff]">Docker</strong>, configuring and renewing{' '}
        <strong className="text-[#f0f4ff]">SSL</strong>, ongoing <strong className="text-[#f0f4ff]">OS patching</strong>, setting up{' '}
        <strong className="text-[#f0f4ff]">backups</strong>, wiring <strong className="text-[#f0f4ff]">monitoring</strong>, and keeping the box
        online 24/7. None of that is hard for an experienced operator, but it&rsquo;s recurring work. If your time has any value, the $5 VPS
        often costs more than a $24 managed plan once you count the hours — which is exactly why managed hosting exists.
      </P>

      <H2 id="scenarios">Total cost scenarios</H2>
      <P>
        Put the two buckets together. These are directional ranges to plan with, not precise quotes — your model bill in particular depends on
        your own usage:
      </P>
      <P>
        <strong className="text-[#f0f4ff]">Light user</strong> — one agent, a handful of messages a day, a mid-tier model. Hosting around
        $10–$24/month, plus a model bill often in the low tens. A realistic all-in for a casual personal assistant is roughly the cost of a
        couple of streaming subscriptions.
      </P>
      <P>
        <strong className="text-[#f0f4ff]">Power user</strong> — multiple agents, all-day tool-heavy conversations, a frontier model and bigger
        context. Hosting around $24–$48/month (Premium territory if you need 3 agents and all channels), and a model bill that can be several
        times the hosting fee. Here the model API, not the hosting plan, is the bigger lever — which is why no-markup BYOK matters.
      </P>

      <H2 id="vibeopenclaw">How VibeOpenClaw keeps it transparent</H2>
      <P>
        We price the part we control and stay out of the part you control. Hosting is flat and month-to-month:{' '}
        <strong className="text-[#f0f4ff]">$24/mo Pro</strong> (1 agent, 2GB RAM, Telegram &amp; Discord) and{' '}
        <strong className="text-[#f0f4ff]">$48/mo Premium</strong> (3 agents, 4GB RAM each, all channels including Slack). The model API stays
        yours: VibeOpenClaw is <strong className="text-[#f0f4ff]">BYOK across 13 providers</strong> and{' '}
        <strong className="text-[#f0f4ff]">never marks up inference</strong> — you pay your provider directly, and your keys are encrypted at
        rest with AES-256-GCM. No metered surprises, no inference margin hidden in the plan. See{' '}
        <Link href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">managed OpenClaw hosting</Link> for the full feature list.
      </P>

      <FaqAccordion faqs={FAQ} />

      <Cta
        title="Run OpenClaw with transparent pricing"
        body="Flat $24/mo Pro or $48/mo Premium, true BYOK with no inference markup, per-agent Docker isolation."
      />

      <Sources
        items={[
          { label: 'VibeOpenClaw — managed OpenClaw hosting & pricing', url: `${SITE_URL}/openclaw-hosting` },
          { label: 'xCloud — OpenClaw hosting', url: 'https://xcloud.host/openclaw-hosting/' },
          { label: 'MyClaw.ai', url: 'https://myclaw.ai/' },
          { label: 'OneClaw', url: 'https://www.oneclaw.net/' },
          { label: 'Hetzner Cloud — VPS pricing', url: 'https://www.hetzner.com/cloud' },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: 'OpenClaw Hosting Cost', path: PATH },
          ]),
          articleLd({
            headline: 'How Much Does OpenClaw Hosting Cost in 2026?',
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
