import type { Metadata } from 'next';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, FaqAccordion, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, serviceLd, jsonLd, type Faq } from '@/components/marketing/schema';
import { PLANS } from '@/content/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/openclaw-hosting/slack';

export const metadata: Metadata = {
  title: 'OpenClaw Slack Bot Hosting — Managed | VibeOpenClaw',
  description:
    'Host your OpenClaw AI assistant as a Slack bot on the Premium plan ($48/mo). Create a Slack app, paste the token, and it answers in your workspace — managed and isolated.',
  keywords: ['openclaw slack bot hosting', 'host openclaw slack', 'openclaw slack bot', 'slack ai agent hosting'],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { type: 'website', url: `${SITE_URL}${PATH}`, title: 'OpenClaw Slack Bot Hosting', description: 'Run your OpenClaw assistant in Slack with managed hosting and BYOK, on the Premium plan.' },
};

const FAQ: Faq[] = [
  { q: 'How do I host an OpenClaw bot on Slack?', a: 'Create a Slack app at api.slack.com, add the bot scopes you need, install it to your workspace, and copy the bot token. Then on VibeOpenClaw (Premium plan), add a model provider key, create an OpenClaw agent, and paste the Slack token. Your bot answers in Slack, running 24/7 in an isolated container.' },
  { q: 'Where do I get the Slack token?', a: 'In the Slack API dashboard (api.slack.com/apps), create an app, configure OAuth scopes under "OAuth & Permissions", install the app to your workspace, and copy the Bot User OAuth Token (it starts with xoxb-).' },
  { q: 'Which plan do I need for Slack?', a: 'Slack is a Premium feature ($48/mo). Premium includes all channels — Telegram, Discord, and Slack — plus up to 3 agents (OpenClaw or Hermes) at 4 GB RAM each, priority support, and usage analytics. Pro ($24/mo) covers Telegram and Discord.' },
  { q: 'Does my computer need to stay on?', a: 'No. Your OpenClaw agent runs on our servers in its own Docker container with automatic restarts, so it stays available in your Slack workspace independent of your machine.' },
  { q: 'Can I bring my own model and keys?', a: 'Yes — BYOK. Add your own provider key, pay your provider directly with no markup from us, and your key is encrypted at rest with AES-256-GCM.' },
  { q: 'Can the bot work across multiple channels?', a: 'Yes — once installed to your workspace with the right scopes, it can be added to the channels you choose and respond there, subject to your workspace’s permissions.' },
  { q: 'Can I run Slack alongside Telegram and Discord?', a: 'Yes. On Premium you can connect all three channels, and run multiple agents — any mix of OpenClaw and Hermes.' },
];

export default function SlackHostingPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: 'Slack' }]} />

      <Hero
        eyebrow="OpenClaw · Slack"
        title="OpenClaw Slack bot hosting"
        subtitle={
          <>
            Run your OpenClaw AI assistant in Slack — create a Slack app, paste the bot token, and it answers in
            your workspace. Managed and Docker-isolated on the Premium plan at{' '}
            <strong className="text-[#f0f4ff]">${PLANS.premium.monthly}/mo</strong>.
          </>
        }
      />

      <H2 id="setup">Deploy an OpenClaw Slack bot in 3 steps</H2>
      <ol className="list-decimal pl-6 space-y-2 text-[#c8d0e0]">
        <li>At <strong className="text-[#f0f4ff]">api.slack.com/apps</strong>, create an app, add bot scopes under OAuth &amp; Permissions, install it to your workspace, and copy the Bot User OAuth Token (<code>xoxb-…</code>).</li>
        <li>Sign up for VibeOpenClaw Premium and add a model provider key on the API Keys page.</li>
        <li>Click <em>New Agent</em> → <strong className="text-[#f0f4ff]">OpenClaw</strong> → pick your model → paste the Slack token → Create. Your bot is live in your workspace in ~30 seconds.</li>
      </ol>

      <H2 id="why">Why host your Slack bot here</H2>
      <P>A Slack bot needs a always-available backend to receive events and respond. VibeOpenClaw runs your OpenClaw agent in its own container with automatic restarts, so it stays responsive in your workspace 24/7. You bring your own model keys (encrypted with AES-256-GCM) and pay your provider directly — no inference markup.</P>
      <P>Also want Telegram or Discord? See <a href="/openclaw-hosting/telegram" className="text-[#00e5cc] hover:underline">OpenClaw Telegram hosting</a> and <a href="/openclaw-hosting/discord" className="text-[#00e5cc] hover:underline">OpenClaw Discord hosting</a>, or the <a href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">OpenClaw hosting</a> overview.</P>

      <FaqAccordion faqs={FAQ} />

      <Cta title="Put your OpenClaw bot in Slack" body="Slack app token in, bot live in your workspace — managed, isolated, BYOK, on Premium at $48/mo." />

      <Sources
        items={[
          { label: 'Slack API — creating apps & bot tokens', url: 'https://api.slack.com/start/building' },
          { label: 'OpenClaw — official repository', url: 'https://github.com/openclaw/openclaw' },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: 'Slack', path: PATH }]),
          serviceLd({ name: 'OpenClaw Slack Bot Hosting', description: metadata.description as string, path: PATH, lowPrice: PLANS.premium.monthly, highPrice: PLANS.premium.monthly }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
