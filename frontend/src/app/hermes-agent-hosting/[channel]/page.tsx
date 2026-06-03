import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, FaqAccordion, Cta, H2, P, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, serviceLd, jsonLd, type Faq } from '@/components/marketing/schema';
import { PLANS } from '@/content/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';

interface Channel {
  slug: string;
  name: string;
  tokenSource: string;
  setup: string;
}

const CHANNELS: Channel[] = [
  { slug: 'telegram', name: 'Telegram', tokenSource: '@BotFather (send /newbot)', setup: 'Message @BotFather in Telegram, run /newbot, and copy the HTTP API token.' },
  { slug: 'discord', name: 'Discord', tokenSource: 'the Discord Developer Portal', setup: 'Create an application in the Discord Developer Portal, add a bot, copy its token, and enable the Message Content intent if you need it.' },
  { slug: 'slack', name: 'Slack', tokenSource: 'api.slack.com/apps', setup: 'Create a Slack app, add bot scopes under OAuth & Permissions, install it to your workspace, and copy the Bot User OAuth Token (xoxb-…).' },
];

const getChannel = (slug: string) => CHANNELS.find((c) => c.slug === slug);

export const dynamicParams = false;
export function generateStaticParams() {
  return CHANNELS.map((c) => ({ channel: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ channel: string }> }): Promise<Metadata> {
  const { channel } = await params;
  const c = getChannel(channel);
  if (!c) return {};
  const path = `/hermes-agent-hosting/${c.slug}`;
  return {
    title: `Hermes Agent ${c.name} Hosting | VibeOpenClaw`,
    description: `Run a managed Hermes Agent on ${c.name} from $48/mo. One-click deploy, Docker isolation, BYOK — no servers to run.`,
    keywords: [`hermes ${c.name.toLowerCase()} hosting`, `hermes agent ${c.name.toLowerCase()}`, 'managed hermes hosting'],
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: { type: 'website', url: `${SITE_URL}${path}`, title: `Hermes Agent ${c.name} Hosting`, description: `Managed Hermes Agent on ${c.name}, BYOK, from $48/mo.` },
  };
}

export default async function HermesChannelPage({ params }: { params: Promise<{ channel: string }> }) {
  const { channel } = await params;
  const c = getChannel(channel);
  if (!c) notFound();

  const path = `/hermes-agent-hosting/${c.slug}`;
  const FAQ: Faq[] = [
    { q: `How do I run a Hermes Agent on ${c.name}?`, a: `Get a ${c.name} bot token from ${c.tokenSource}, sign up for VibeOpenClaw Premium, add a model provider key, create a Hermes agent, and paste the token. It’s live in about 30 seconds in a Docker-isolated container.` },
    { q: `Where do I get the ${c.name} token?`, a: c.setup },
    { q: 'Which plan do I need?', a: 'Hermes runs on the Premium plan ($48/mo), which includes all channels — Telegram, Discord, and Slack — plus up to 3 agents and priority support.' },
    { q: 'Is it BYOK?', a: 'Yes. Bring your own model provider key across 13 providers and pay the provider directly — no inference markup. Keys are encrypted at rest with AES-256-GCM.' },
  ];

  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Hermes Agent Hosting', path: '/hermes-agent-hosting' }, { name: c.name }]} />

      <Hero
        eyebrow={`Hermes · ${c.name}`}
        title={`Hermes Agent ${c.name} hosting`}
        subtitle={
          <>
            Run Nous Research’s self-improving Hermes Agent on <strong className="text-[#f0f4ff]">{c.name}</strong> —
            managed, Docker-isolated, BYOK, on the Premium plan at{' '}
            <strong className="text-[#f0f4ff]">${PLANS.premium.monthly}/mo</strong>.
          </>
        }
      />

      <H2 id="setup">Deploy in 3 steps</H2>
      <ol className="list-decimal pl-6 space-y-2 text-[#c8d0e0]">
        <li>{c.setup}</li>
        <li>Sign up for VibeOpenClaw Premium and add a model provider key on the API Keys page.</li>
        <li>Click <em>New Agent</em> → <strong className="text-[#f0f4ff]">Hermes</strong> → pick a model → paste the {c.name} token → Create. Live in ~30 seconds.</li>
      </ol>

      <P>
        Hermes connects through its messaging gateway on {c.name}. Want OpenClaw on {c.name} instead? See{' '}
        <a href={`/openclaw-hosting/${c.slug}`} className="text-[#00e5cc] hover:underline">OpenClaw {c.name} hosting</a>, or compare the two on{' '}
        <a href="/compare/openclaw-vs-hermes" className="text-[#00e5cc] hover:underline">OpenClaw vs Hermes</a>.
      </P>

      <FaqAccordion faqs={FAQ} />

      <Cta title={`Run Hermes on ${c.name}`} body={`Managed, isolated, BYOK — on Premium at $${PLANS.premium.monthly}/mo.`} />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Hermes Agent Hosting', path: '/hermes-agent-hosting' }, { name: c.name, path }]),
          serviceLd({ name: `Hermes Agent ${c.name} Hosting`, description: `Managed Hermes Agent on ${c.name}, BYOK.`, path, lowPrice: PLANS.premium.monthly, highPrice: PLANS.premium.monthly }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
