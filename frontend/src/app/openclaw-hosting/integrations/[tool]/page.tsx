import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, FaqAccordion, Cta, H2, P, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, serviceLd, jsonLd, type Faq } from '@/components/marketing/schema';
import { INTEGRATIONS, getIntegration } from '@/content/integrations';
import { PLANS } from '@/content/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';

export const dynamicParams = false;
export function generateStaticParams() {
  return INTEGRATIONS.map((i) => ({ tool: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const { tool } = await params;
  const i = getIntegration(tool);
  if (!i) return {};
  const path = `/openclaw-hosting/integrations/${i.slug}`;
  return {
    title: `OpenClaw + ${i.name} Integration | VibeOpenClaw`.slice(0, 60),
    description: `Run a managed OpenClaw agent that works with ${i.name} via OpenClaw skills. One-click hosting, Docker isolation, BYOK — from $24/mo.`.slice(0, 155),
    keywords: [`openclaw ${i.name.toLowerCase()}`, `openclaw ${i.name.toLowerCase()} integration`, `openclaw ${i.slug}`, 'openclaw integrations'],
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: { type: 'website', url: `${SITE_URL}${path}`, title: `OpenClaw + ${i.name} Integration`, description: `Run a managed OpenClaw agent that works with ${i.name}, from $24/mo.` },
  };
}

export default async function IntegrationPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const i = getIntegration(tool);
  if (!i) notFound();
  const path = `/openclaw-hosting/integrations/${i.slug}`;

  const FAQ: Faq[] = [
    { q: `Can OpenClaw integrate with ${i.name}?`, a: `Yes. ${i.how} VibeOpenClaw hosts the OpenClaw agent for you, so you only configure the skill — no server to run.` },
    { q: `How do I connect OpenClaw to ${i.name}?`, a: `Deploy a managed OpenClaw agent on VibeOpenClaw, then configure the relevant OpenClaw skill with your ${i.name} credentials. The agent runs 24/7 in a Docker-isolated container.` },
    { q: `Is this an official ${i.name} integration?`, a: `It uses ${i.name}’s public API through an OpenClaw skill (or webhooks/MCP where applicable). It’s the standard way OpenClaw connects to external tools — not a proprietary connector.` },
    { q: `What does hosting cost?`, a: `Pro is $24/month and Premium is $48/month. BYOK across 13 model providers — you pay your model provider directly, with no markup from us.` },
  ];

  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: 'Integrations', path: '/openclaw-hosting/integrations' }, { name: i.name }]} />

      <Hero
        eyebrow="OpenClaw · Integration"
        title={`OpenClaw + ${i.name}`}
        subtitle={
          <>
            Run a managed OpenClaw agent that works with <strong className="text-[#f0f4ff]">{i.name}</strong> — hosted,
            Docker-isolated, BYOK, from <strong className="text-[#f0f4ff]">${PLANS.pro.monthly}/mo</strong>.
          </>
        }
      />

      <P>{i.what}</P>

      <H2 id="how">How OpenClaw works with {i.name}</H2>
      <P>{i.how}</P>

      <H2 id="examples">What you can do</H2>
      <ul className="list-disc pl-6 space-y-2 text-[#c8d0e0]">
        {i.examples.map((e) => <li key={e}>{e}</li>)}
      </ul>

      <H2 id="setup">Get started</H2>
      <P>
        Deploy a managed OpenClaw agent on VibeOpenClaw, add your model key, and configure the {i.name} skill with your
        credentials — your agent is live in ~30 seconds. See <a href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">OpenClaw hosting</a> for the full overview,
        or browse more <a href="/openclaw-hosting/integrations" className="text-[#00e5cc] hover:underline">integrations</a>.
      </P>

      <FaqAccordion faqs={FAQ} />

      <Cta title={`Run OpenClaw with ${i.name}`} body={`Managed, isolated, BYOK — from $${PLANS.pro.monthly}/mo, live in ~30 seconds.`} />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: 'Integrations', path: '/openclaw-hosting/integrations' }, { name: i.name, path }]),
          serviceLd({ name: `OpenClaw + ${i.name}`, description: `Managed OpenClaw agent that works with ${i.name}.`, path, lowPrice: PLANS.pro.monthly, highPrice: PLANS.premium.monthly }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
