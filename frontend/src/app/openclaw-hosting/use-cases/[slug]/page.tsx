import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, FaqAccordion, Cta, H2, P, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, serviceLd, jsonLd, type Faq } from '@/components/marketing/schema';
import { USE_CASES, getUseCase } from '@/content/useCases';
import { PLANS } from '@/content/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';

export const dynamicParams = false;

export function generateStaticParams() {
  return USE_CASES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const u = getUseCase(slug);
  if (!u) return {};
  const path = `/openclaw-hosting/use-cases/${u.slug}`;
  return {
    title: `${u.title} | VibeOpenClaw`.slice(0, 60),
    description: `${u.intro}`.slice(0, 155),
    keywords: [`openclaw ${u.slug.replace(/-/g, ' ')}`, 'openclaw use case', 'openclaw ai agent', 'managed openclaw hosting'],
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: { type: 'website', url: `${SITE_URL}${path}`, title: u.title, description: u.tagline },
  };
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const u = getUseCase(slug);
  if (!u) notFound();

  const path = `/openclaw-hosting/use-cases/${u.slug}`;
  const FAQ: Faq[] = [
    { q: `Can OpenClaw be used ${u.title.replace(/^OpenClaw (as |for )?/i, 'for ').toLowerCase()}?`, a: `${u.intro}` },
    { q: 'How do I set it up?', a: 'Sign up for VibeOpenClaw, add a model provider key, create an OpenClaw agent, connect your channel, and click Create. It’s live in about 30 seconds in a Docker-isolated container — no servers to run.' },
    { q: 'Which plan and price?', a: 'Pro is $24/mo (1 agent, Telegram & Discord); Premium is $48/mo (up to 3 agents, all channels including Slack). BYOK across 13 providers — you pay your model provider directly with no markup from us.' },
    { q: 'Does it run 24/7?', a: 'Yes. Your agent runs on our servers with automatic restarts, so it stays available whether or not your own machine is on.' },
  ];

  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: 'Use cases' }, { name: u.title.replace(/^OpenClaw (as |for )?/i, '') }]} />

      <Hero eyebrow="OpenClaw · Use case" title={u.title} subtitle={u.tagline} />

      <P>{u.intro}</P>

      <H2 id="what">What the agent does</H2>
      <ul className="list-disc pl-6 space-y-2 text-[#c8d0e0]">
        {u.capabilities.map((c) => <li key={c}>{c}</li>)}
      </ul>

      <H2 id="channel">Best channel for this</H2>
      <P>{u.channelFit}</P>

      <H2 id="setup">Get started</H2>
      <P>
        Sign up, add a model key, create an OpenClaw agent, and connect your channel — live in ~30 seconds.
        See <a href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">OpenClaw hosting</a> for the full overview,
        or browse <a href="/openclaw-hosting/telegram" className="text-[#00e5cc] hover:underline">Telegram</a>,{' '}
        <a href="/openclaw-hosting/discord" className="text-[#00e5cc] hover:underline">Discord</a>, and{' '}
        <a href="/openclaw-hosting/slack" className="text-[#00e5cc] hover:underline">Slack</a> setup.
      </P>

      <FaqAccordion faqs={FAQ} />

      <Cta title="Deploy your OpenClaw agent" body={`${u.tagline} — managed, isolated, BYOK, from $${PLANS.pro.monthly}/mo.`} />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: u.title, path }]),
          serviceLd({ name: u.title, description: u.tagline, path, lowPrice: PLANS.pro.monthly, highPrice: PLANS.premium.monthly }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
