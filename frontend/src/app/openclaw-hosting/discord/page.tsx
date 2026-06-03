import type { Metadata } from 'next';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, FaqAccordion, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, serviceLd, jsonLd, type Faq } from '@/components/marketing/schema';
import { PLANS } from '@/content/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/openclaw-hosting/discord';

export const metadata: Metadata = {
  title: 'OpenClaw Discord Bot Hosting — One-Click | VibeOpenClaw',
  description:
    'Host your OpenClaw AI assistant as a Discord bot from $24/mo. Create a bot token in the Developer Portal, paste it, and it’s live in your server in ~30 seconds.',
  keywords: ['openclaw discord bot hosting', 'host openclaw discord', 'openclaw discord bot', 'discord ai agent hosting'],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { type: 'website', url: `${SITE_URL}${PATH}`, title: 'OpenClaw Discord Bot Hosting', description: 'Run your OpenClaw assistant on Discord in ~30 seconds with managed hosting and BYOK.' },
};

const FAQ: Faq[] = [
  { q: 'How do I host an OpenClaw bot on Discord?', a: 'Create an application in the Discord Developer Portal, add a bot to it, and copy the bot token. Then sign up for VibeOpenClaw, add a model provider key, create an OpenClaw agent, and paste the Discord bot token. Your bot is live in about 30 seconds, running 24/7 in an isolated container.' },
  { q: 'Where do I get the Discord bot token?', a: 'Go to the Discord Developer Portal, create a New Application, open the Bot tab, and reset/copy the token. You’ll also invite the bot to your server with an OAuth2 URL that grants the bot scope and the permissions it needs.' },
  { q: 'Do I need to enable any gateway intents?', a: 'If you want the bot to read message content in servers, enable the Message Content intent on the Bot tab in the Developer Portal. Slash-command interactions work without it.' },
  { q: 'Which plan includes Discord?', a: 'Discord is available on both plans. Pro ($24/mo) includes 1 OpenClaw agent with Telegram and Discord; Premium ($48/mo) adds Slack and up to 3 agents.' },
  { q: 'Does my machine need to stay online?', a: 'No. The agent runs on our servers in its own Docker container with automatic restarts, so it stays connected to Discord whether or not your computer is on.' },
  { q: 'Can I bring my own model and keys?', a: 'Yes — BYOK. Add your own provider key, pay the provider directly (no markup from us), and your key is encrypted at rest with AES-256-GCM.' },
  { q: 'Can the bot serve multiple channels in a server?', a: 'Yes. Once invited with the right permissions, the bot can respond across the channels it has access to, governed by your server’s role and permission settings.' },
];

export default function DiscordHostingPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: 'Discord' }]} />

      <Hero
        eyebrow="OpenClaw · Discord"
        title="OpenClaw Discord bot hosting"
        subtitle={
          <>
            Run your OpenClaw AI assistant as a Discord bot — create a token in the Developer Portal, paste it,
            and it’s live in your server in ~30 seconds. Managed, Docker-isolated, BYOK, from{' '}
            <strong className="text-[#f0f4ff]">${PLANS.pro.monthly}/mo</strong>.
          </>
        }
      />

      <H2 id="setup">Deploy an OpenClaw Discord bot in 3 steps</H2>
      <ol className="list-decimal pl-6 space-y-2 text-[#c8d0e0]">
        <li>In the <strong className="text-[#f0f4ff]">Discord Developer Portal</strong>, create an application, add a bot, copy its token, and (if needed) enable the Message Content intent.</li>
        <li>Sign up for VibeOpenClaw and add a model provider key on the API Keys page.</li>
        <li>Click <em>New Agent</em> → <strong className="text-[#f0f4ff]">OpenClaw</strong> → pick your model → paste the Discord token → Create, then invite the bot to your server.</li>
      </ol>

      <H2 id="why">Why host your Discord bot here</H2>
      <P>A Discord bot has to hold a live gateway connection — if the process drops, the bot goes offline. VibeOpenClaw runs your OpenClaw agent in its own container with automatic restarts, so it stays connected 24/7. You bring your own model keys (encrypted with AES-256-GCM) and pay your provider directly; we never mark up inference.</P>
      <P>Prefer Telegram or Slack? See <a href="/openclaw-hosting/telegram" className="text-[#00e5cc] hover:underline">OpenClaw Telegram hosting</a> and <a href="/openclaw-hosting/slack" className="text-[#00e5cc] hover:underline">OpenClaw Slack hosting</a>, or the <a href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">OpenClaw hosting</a> overview.</P>

      <FaqAccordion faqs={FAQ} />

      <Cta title="Put your OpenClaw bot on Discord" body="Developer Portal token in, bot live in ~30 seconds — managed, isolated, BYOK, from $24/mo." />

      <Sources
        items={[
          { label: 'Discord Developer Portal — bots & tokens', url: 'https://discord.com/developers/docs/intro' },
          { label: 'OpenClaw — official repository', url: 'https://github.com/openclaw/openclaw' },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: 'Discord', path: PATH }]),
          serviceLd({ name: 'OpenClaw Discord Bot Hosting', description: metadata.description as string, path: PATH, lowPrice: PLANS.pro.monthly, highPrice: PLANS.premium.monthly }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
