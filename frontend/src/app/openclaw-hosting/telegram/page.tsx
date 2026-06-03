import type { Metadata } from 'next';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, FaqAccordion, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, serviceLd, jsonLd, type Faq } from '@/components/marketing/schema';
import { PLANS } from '@/content/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/openclaw-hosting/telegram';

export const metadata: Metadata = {
  title: 'OpenClaw Telegram Bot Hosting — One-Click | VibeOpenClaw',
  description:
    'Host your OpenClaw AI assistant as a Telegram bot from $24/mo. Create a BotFather token, paste it, and your agent answers on Telegram in ~30 seconds — no server to run.',
  keywords: ['openclaw telegram bot hosting', 'host openclaw telegram', 'openclaw telegram bot', 'telegram ai agent hosting'],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { type: 'website', url: `${SITE_URL}${PATH}`, title: 'OpenClaw Telegram Bot Hosting', description: 'Run your OpenClaw assistant on Telegram in ~30 seconds with managed hosting and BYOK.' },
};

const FAQ: Faq[] = [
  { q: 'How do I host an OpenClaw bot on Telegram?', a: 'Create a bot with @BotFather in Telegram to get a token, sign up for VibeOpenClaw, add a model provider key, then create an OpenClaw agent and paste the Telegram bot token. Your agent is live on Telegram in about 30 seconds — we run it in a Docker-isolated container 24/7.' },
  { q: 'Where do I get the Telegram bot token?', a: 'Open Telegram, message @BotFather, send /newbot, choose a name and username, and BotFather returns an HTTP API token. That token is what you paste into the new-agent form on VibeOpenClaw.' },
  { q: 'Which plan do I need for Telegram?', a: 'Telegram is available on both plans. Pro ($24/mo) includes 1 OpenClaw agent with Telegram and Discord; Premium ($48/mo) adds Slack and up to 3 agents.' },
  { q: 'Does my computer need to stay on?', a: 'No. Your OpenClaw agent runs on our servers in its own container, so it keeps answering on Telegram even when your laptop is off.' },
  { q: 'Can I use my own model and keys?', a: 'Yes — it’s BYOK. Add your own provider key (OpenAI, Anthropic, Google, and 10 more) and pay the provider directly. We never mark up inference, and your key is encrypted at rest with AES-256-GCM.' },
  { q: 'Can one agent serve a Telegram group?', a: 'Yes — add the bot to a group and it responds there, subject to Telegram’s standard bot privacy settings, which you control in BotFather.' },
  { q: 'Can I change the bot token later?', a: 'Yes. You can update the Telegram token on the agent at any time from its settings without redeploying from scratch.' },
];

export default function TelegramHostingPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: 'Telegram' }]} />

      <Hero
        eyebrow="OpenClaw · Telegram"
        title="OpenClaw Telegram bot hosting"
        subtitle={
          <>
            Run your OpenClaw AI assistant as a Telegram bot — create a BotFather token, paste it, and it’s
            answering in ~30 seconds. Managed, Docker-isolated, BYOK, from{' '}
            <strong className="text-[#f0f4ff]">${PLANS.pro.monthly}/mo</strong>.
          </>
        }
      />

      <H2 id="setup">Deploy an OpenClaw Telegram bot in 3 steps</H2>
      <ol className="list-decimal pl-6 space-y-2 text-[#c8d0e0]">
        <li>In Telegram, message <strong className="text-[#f0f4ff]">@BotFather</strong>, send <code>/newbot</code>, and copy the HTTP API token it gives you.</li>
        <li>Sign up for VibeOpenClaw and add a model provider key on the API Keys page.</li>
        <li>Click <em>New Agent</em> → <strong className="text-[#f0f4ff]">OpenClaw</strong> → pick your model → paste the Telegram token → Create. Your bot is live in ~30 seconds.</li>
      </ol>

      <H2 id="why">Why host your Telegram bot here</H2>
      <P>Self-hosting a Telegram bot means a VPS, Docker, and a process that has to stay up — or it goes silent. VibeOpenClaw runs your OpenClaw agent in its own container with automatic restarts, so the bot answers 24/7. You bring your own model keys (encrypted at rest with AES-256-GCM) and pay your provider directly — we never mark up inference.</P>
      <P>Want Discord or Slack too? See <a href="/openclaw-hosting/discord" className="text-[#00e5cc] hover:underline">OpenClaw Discord hosting</a> and <a href="/openclaw-hosting/slack" className="text-[#00e5cc] hover:underline">OpenClaw Slack hosting</a>, or the full <a href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">OpenClaw hosting</a> overview.</P>

      <FaqAccordion faqs={FAQ} />

      <Cta title="Put your OpenClaw bot on Telegram" body="BotFather token in, agent live in ~30 seconds — managed, isolated, BYOK, from $24/mo." />

      <Sources
        items={[
          { label: 'Telegram BotFather — creating bots', url: 'https://core.telegram.org/bots#botfather' },
          { label: 'OpenClaw — official repository', url: 'https://github.com/openclaw/openclaw' },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: 'Telegram', path: PATH }]),
          serviceLd({ name: 'OpenClaw Telegram Bot Hosting', description: metadata.description as string, path: PATH, lowPrice: PLANS.pro.monthly, highPrice: PLANS.premium.monthly }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
