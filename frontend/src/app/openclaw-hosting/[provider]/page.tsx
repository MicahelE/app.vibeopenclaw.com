import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, FaqAccordion, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, serviceLd, jsonLd, type Faq } from '@/components/marketing/schema';
import { MODEL_PROVIDERS, getProvider } from '@/content/modelProviders';
import { PLANS } from '@/content/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';

export const dynamicParams = false;

export function generateStaticParams() {
  return MODEL_PROVIDERS.map((p) => ({ provider: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ provider: string }> }): Promise<Metadata> {
  const { provider } = await params;
  const p = getProvider(provider);
  if (!p) return {};
  const path = `/openclaw-hosting/${p.slug}`;
  return {
    title: `OpenClaw Hosting with ${p.name} (BYOK) | VibeOpenClaw`,
    description: `Run a managed OpenClaw agent on ${p.name} models with your own API key. One-click deploy, Docker isolation, no inference markup — from $24/mo.`,
    keywords: [`openclaw ${p.name.toLowerCase()}`, `openclaw with ${p.name.toLowerCase()}`, `openclaw ${p.slug} hosting`, 'byok openclaw hosting'],
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: { type: 'website', url: `${SITE_URL}${path}`, title: `OpenClaw Hosting with ${p.name}`, description: `Managed OpenClaw on ${p.name} models, BYOK, from $24/mo.` },
  };
}

export default async function ProviderPage({ params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const p = getProvider(provider);
  if (!p) notFound();

  const path = `/openclaw-hosting/${p.slug}`;
  const FAQ: Faq[] = [
    { q: `Can I run OpenClaw on ${p.name} models?`, a: `Yes. VibeOpenClaw supports ${p.name} as one of 13 BYOK providers. Add your ${p.name} API key on the API Keys page, create an OpenClaw agent, and select a ${p.name} model — your agent is live in about 30 seconds.` },
    { q: `Where do I get a ${p.name} API key?`, a: `Create one in the ${p.name} dashboard (${p.keyUrl}), then paste it into VibeOpenClaw’s API Keys page. It’s encrypted at rest with AES-256-GCM and only decrypted in-process to make model calls.` },
    { q: `Does VibeOpenClaw mark up ${p.name} usage?`, a: `No. It’s true BYOK — you pay ${p.name} directly for inference and we never proxy or mark up your usage. Your hosting fee ($24/mo Pro, $48/mo Premium) is separate from your model spend.` },
    { q: `Can I switch models or providers later?`, a: `Yes. You can change the model on an agent, or add keys for other providers, at any time — your agent isn’t locked to ${p.name}.` },
    { q: `Which plan do I need?`, a: `Any plan works with ${p.name}. Pro ($24/mo) runs 1 OpenClaw agent; Premium ($48/mo) runs up to 3 OpenClaw or Hermes agents and adds Slack.` },
  ];

  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: p.name }]} />

      <Hero
        eyebrow={`OpenClaw · ${p.name}`}
        title={`OpenClaw hosting with ${p.name}`}
        subtitle={
          <>
            Run a managed OpenClaw agent on <strong className="text-[#f0f4ff]">{p.name}</strong> models with your own
            API key — one-click deploy, Docker isolation, and no inference markup, from{' '}
            <strong className="text-[#f0f4ff]">${PLANS.pro.monthly}/mo</strong>.
          </>
        }
      />

      <P>{p.blurb}</P>

      <H2 id="why">Why {p.name} for your OpenClaw agent</H2>
      <P>{p.strengths}</P>
      <P>{p.whyForAgents} Representative models: {p.models}.</P>

      <H2 id="setup">Deploy in 3 steps</H2>
      <ol className="list-decimal pl-6 space-y-2 text-[#c8d0e0]">
        <li>Create a {p.name} API key in the <a href={p.keyUrl} target="_blank" rel="noopener noreferrer" className="text-[#00e5cc] hover:underline">{p.name} dashboard</a>.</li>
        <li>Sign up for VibeOpenClaw and paste the key on the API Keys page (encrypted at rest with AES-256-GCM).</li>
        <li>Click <em>New Agent</em> → <strong className="text-[#f0f4ff]">OpenClaw</strong> → choose a {p.name} model → connect a channel → Create. Live in ~30 seconds.</li>
      </ol>

      <P>BYOK means you pay {p.name} directly — we never mark up inference. Want a different provider? See all <a href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">OpenClaw hosting</a> options, or read <a href="/blog/byok-ai-agent-platform" className="text-[#00e5cc] hover:underline">what BYOK actually buys you</a>.</P>

      <FaqAccordion faqs={FAQ} />

      <Cta title={`Run OpenClaw on ${p.name}`} body={`Bring your ${p.name} key, deploy in ~30 seconds — managed, isolated, no markup, from $24/mo.`} />

      <Sources
        items={[
          { label: `${p.name} — API keys`, url: p.keyUrl },
          { label: 'OpenClaw — official repository', url: 'https://github.com/openclaw/openclaw' },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: p.name, path }]),
          serviceLd({ name: `OpenClaw Hosting with ${p.name}`, description: `Managed OpenClaw on ${p.name} models, BYOK, from $24/mo.`, path, lowPrice: PLANS.pro.monthly, highPrice: PLANS.premium.monthly }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
