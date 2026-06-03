import type { Metadata } from 'next';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, StatBar, FeatureGrid, ComparisonTable, FaqAccordion, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, jsonLd, type Faq } from '@/components/marketing/schema';
import { PLANS } from '@/content/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/openclaw-hosting/myclaw-alternative';

export const metadata: Metadata = {
  title: 'MyClaw Alternative for OpenClaw Hosting | VibeOpenClaw',
  description:
    'Looking for a MyClaw.ai alternative? VibeOpenClaw hosts OpenClaw and Hermes from $24/mo with per-agent Docker isolation and AES-256-GCM encrypted BYOK keys.',
  keywords: ['myclaw alternative', 'myclaw.ai alternative', 'alternative to myclaw', 'myclaw competitor', 'openclaw hosting alternative'],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}${PATH}`,
    title: 'MyClaw Alternative for OpenClaw Hosting',
    description: 'An agent-specialized MyClaw.ai alternative: host OpenClaw and Hermes from $24/mo with per-agent Docker isolation and AES-256-GCM encrypted keys.',
  },
};

const FAQ: Faq[] = [
  {
    q: 'Is VibeOpenClaw a good MyClaw alternative?',
    a: 'Yes, if you want more than OpenClaw-only managed hosting. MyClaw is a solid one-click host for OpenClaw starting at $19/month, and if that is all you need it is a fine choice. VibeOpenClaw is the agent-specialized alternative: it runs both OpenClaw and Hermes, gives every agent its own Docker container, encrypts your provider keys at rest with AES-256-GCM, and supports 13 BYOK providers — from $24/month. You trade a slightly higher entry price for a second agent type and explicit isolation and encryption guarantees.',
  },
  {
    q: 'Does VibeOpenClaw run Hermes too, or only OpenClaw?',
    a: 'Both. VibeOpenClaw is the managed host that runs OpenClaw and Hermes side-by-side. The Pro plan ($24/mo) runs one agent of either type, and Premium ($48/mo) runs up to three agents in any mix. MyClaw is OpenClaw-only today, so running Hermes is one of the most common reasons people look for a MyClaw alternative.',
  },
  {
    q: 'How is VibeOpenClaw different from MyClaw on security?',
    a: 'Both run your agent in an isolated container. VibeOpenClaw is explicit about two things: every agent gets its own dedicated Docker container with its own RAM, and your provider API keys are encrypted at rest with AES-256-GCM and only decrypted in-process to make model calls — never logged and never shown in full again after entry. If encrypted-at-rest keys and per-agent isolation are decision factors for you, that is the main reason to choose VibeOpenClaw.',
  },
  {
    q: 'Is VibeOpenClaw more expensive than MyClaw?',
    a: 'At the entry tier, yes — MyClaw starts at $19/month versus our Pro plan at $24/month. We are upfront about that. The $5 difference buys per-agent Docker isolation, AES-256-GCM encrypted keys, 13 BYOK providers, and the option to run Hermes as well as OpenClaw. Both platforms are true BYOK, so you pay your model provider directly for inference with no markup on either service.',
  },
  {
    q: 'Will I keep BYOK and my existing channels if I switch?',
    a: 'Yes. VibeOpenClaw is true BYOK across 13 providers — OpenAI, Anthropic, Google, Groq, xAI, Mistral, DeepSeek, Together, Fireworks, Perplexity, OpenRouter, Cohere, and NVIDIA — so you keep your existing model provider and pay it directly. Your OpenClaw agent connects to Telegram and Discord on Pro, plus Slack on Premium, and deploys in about 30 seconds with one click. There is no inference markup on either platform.',
  },
];

const VS_MYCLAW: (string | boolean)[][] = [
  ['From price', '$24/mo', '$19/mo'],
  ['Hosts OpenClaw', true, true],
  ['Hosts Hermes too', true, false],
  ['Per-agent Docker isolation', true, true],
  ['Encrypted keys at rest (AES-256-GCM)', true, false],
  ['True BYOK (no inference markup)', true, true],
];

const FEATURES = [
  { title: 'Both agents, one platform', body: 'Run OpenClaw and Hermes side-by-side on Premium — not OpenClaw alone. This is the most common reason to look past an OpenClaw-only host.' },
  { title: 'Per-agent Docker isolation', body: 'Every agent gets its own dedicated container and RAM, so a problem in one agent can never reach another agent’s memory or keys.' },
  { title: 'AES-256-GCM encrypted keys', body: 'Provider keys are encrypted at rest and only decrypted in-process for model calls — never logged, never re-displayed after entry.' },
  { title: '13 BYOK providers, no markup', body: 'Bring your own keys for OpenAI, Anthropic, Google, and 10 more, and pay the provider directly. We never proxy or mark up inference.' },
  { title: 'Channels included', body: 'Telegram and Discord on Pro; add Slack on Premium. Your agent runs 24/7 on our servers — one click, ~30 seconds to live.' },
  { title: 'Room to grow', body: 'Start with one agent on Pro and scale to three on Premium, mixing OpenClaw and Hermes however your stack evolves.' },
];

export default function MyClawAlternativePage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: 'MyClaw Alternative' }]} />

      <Hero
        eyebrow="MyClaw Alternative"
        title="Looking for a MyClaw alternative?"
        subtitle={
          <>
            MyClaw.ai is a capable OpenClaw-only managed host. If you also want to run{' '}
            <strong className="text-[#f0f4ff]">Hermes</strong>, with explicit per-agent Docker isolation and
            AES-256-GCM encrypted keys, VibeOpenClaw is the agent-specialized alternative — from{' '}
            <strong className="text-[#f0f4ff]">${PLANS.pro.monthly}/mo</strong>.
          </>
        }
      />

      <StatBar
        stats={[
          { value: '2', label: 'agent types (OpenClaw + Hermes)' },
          { value: '13', label: 'BYOK model providers' },
          { value: '~30s', label: 'to first agent' },
          { value: '$24', label: 'starting price / mo' },
        ]}
      />

      <P>
        If you searched for a <strong className="text-[#f0f4ff]">MyClaw alternative</strong>, you have probably
        already decided MyClaw.ai is a reasonable option — it is a fine one-click managed host for OpenClaw,
        starting at $19/month with isolated containers and BYOK. We are not here to talk you out of it. But MyClaw
        is OpenClaw-only, and if you also want to run Hermes, want explicit per-agent Docker isolation with keys
        encrypted at rest, or want room to grow into multiple agents of either type, then VibeOpenClaw is the
        agent-specialized alternative — starting at <strong className="text-[#f0f4ff]">${PLANS.pro.monthly}/month</strong>.
      </P>
      <P>
        Want the full feature-by-feature breakdown instead of a switching guide? See the head-to-head{' '}
        <a href="/compare/vibeopenclaw-vs-myclaw" className="text-[#00e5cc] hover:underline">VibeOpenClaw vs MyClaw</a> comparison.
        This page is about <em>when to look beyond MyClaw, what VibeOpenClaw adds, and how to move over</em>.
      </P>

      <H2 id="why">Why consider an alternative to MyClaw</H2>
      <P>MyClaw does OpenClaw hosting well. People typically start shopping for an alternative when one of these becomes true:</P>
      <ul className="list-disc pl-6 space-y-2 text-[#c8d0e0]">
        <li>
          <strong className="text-[#f0f4ff]">You want to run Hermes too, not just OpenClaw.</strong> MyClaw is OpenClaw-only,
          so the moment a Hermes agent enters your plans you need a host that supports both.
        </li>
        <li>
          <strong className="text-[#f0f4ff]">You want explicit isolation and encryption guarantees.</strong> If
          per-agent Docker isolation and keys encrypted at rest (AES-256-GCM) are decision factors, you want them
          spelled out, not assumed.
        </li>
        <li>
          <strong className="text-[#f0f4ff]">You want room to grow into multiple agents of either type.</strong> If you
          expect to run a mix of OpenClaw and Hermes agents over time, a both-agents platform saves you a migration later.
        </li>
      </ul>
      <P>
        None of these are knocks on MyClaw — they are simply needs an OpenClaw-only host does not cover. If none of
        them apply to you, MyClaw’s lower $19 entry price may be the better fit, and that is a fair call to make.
      </P>

      <H2 id="adds">What VibeOpenClaw adds</H2>
      <P>Compared with an OpenClaw-only managed host, here is what the agent-specialized alternative brings to the table:</P>
      <FeatureGrid features={FEATURES} />

      <H2 id="compare">VibeOpenClaw vs MyClaw at a glance</H2>
      <P>
        A fair, honest snapshot (figures as of June 2026). Note the entry price: MyClaw starts lower at $19/month,
        while VibeOpenClaw starts at $24/month — the difference buys a second agent type plus explicit isolation and
        encryption.
      </P>
      <ComparisonTable cols={['VibeOpenClaw', 'MyClaw']} rows={VS_MYCLAW} highlightCol={0} />
      <P>
        Thinking about Hermes specifically? See <a href="/hermes-agent-hosting" className="text-[#00e5cc] hover:underline">Hermes agent hosting</a>,
        or start from the <a href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">managed OpenClaw hosting</a> overview.
      </P>

      <H2 id="keep">What you keep when you switch</H2>
      <P>Switching from MyClaw to VibeOpenClaw does not mean re-architecting how you work. The fundamentals carry over:</P>
      <ul className="list-disc pl-6 space-y-2 text-[#c8d0e0]">
        <li><strong className="text-[#f0f4ff]">BYOK stays BYOK.</strong> You bring your own provider keys and pay the provider directly — no inference markup, just like on MyClaw.</li>
        <li><strong className="text-[#f0f4ff]">Your model provider comes with you.</strong> If you are on OpenAI, Anthropic, Google, or any of 13 supported providers, point your existing key at VibeOpenClaw and keep going.</li>
        <li><strong className="text-[#f0f4ff]">Your channels still work.</strong> Connect OpenClaw to Telegram and Discord on Pro, plus Slack on Premium — re-use the same bot tokens.</li>
        <li><strong className="text-[#f0f4ff]">One-click deploy stays one-click.</strong> No Docker, no SSH. Your agent boots in about 30 seconds, the same low-friction experience you expect from a managed host.</li>
      </ul>

      <H2 id="how">How to switch from MyClaw</H2>
      <P>Moving an OpenClaw agent over takes a few minutes — there is no data export ritual because your keys and tokens are yours already.</P>
      <ol className="list-decimal pl-6 space-y-2 text-[#c8d0e0]">
        <li>Sign up for VibeOpenClaw and add your model provider key on the API Keys page (the same OpenAI, Anthropic, or other key you already use). It is encrypted at rest with AES-256-GCM.</li>
        <li>Click <em>New Agent</em>, choose <strong className="text-[#f0f4ff]">OpenClaw</strong> (or <strong className="text-[#f0f4ff]">Hermes</strong>), pick your model, and paste your Telegram or Discord bot token.</li>
        <li>Click Create. Your agent boots in its own Docker-isolated container in about 30 seconds and starts answering on your channel.</li>
        <li>Confirm it is responding the way it did on MyClaw, then cancel your MyClaw plan from their billing page. Done.</li>
      </ol>

      <FaqAccordion faqs={FAQ} />

      <Cta title="Try the agent-specialized MyClaw alternative" body="Run OpenClaw and Hermes, with per-agent Docker isolation, AES-256-GCM encrypted BYOK keys, and 13 providers — from $24/mo." />

      <Sources
        items={[
          { label: 'OpenClaw — official repository', url: 'https://github.com/openclaw/openclaw' },
          { label: 'MyClaw.ai — managed OpenClaw hosting', url: 'https://myclaw.ai' },
          { label: 'VibeOpenClaw vs MyClaw — full comparison', url: `${SITE_URL}/compare/vibeopenclaw-vs-myclaw` },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'OpenClaw Hosting', path: '/openclaw-hosting' },
            { name: 'MyClaw Alternative', path: PATH },
          ]),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
