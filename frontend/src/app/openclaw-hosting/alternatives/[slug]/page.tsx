import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, FeatureGrid, FaqAccordion, Cta, H2, P, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, serviceLd, jsonLd, type Faq } from '@/components/marketing/schema';
import { ALTERNATIVES, getAlternative } from '@/content/alternatives';
import { PLANS } from '@/content/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';

export const dynamicParams = false;
export function generateStaticParams() {
  return ALTERNATIVES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getAlternative(slug);
  if (!a) return {};
  const path = `/openclaw-hosting/alternatives/${a.slug}`;
  return {
    title: `${a.name} Alternative for OpenClaw Hosting | VibeOpenClaw`.slice(0, 60),
    description: `Looking for a ${a.name} alternative? VibeOpenClaw runs OpenClaw and Hermes with Docker isolation, BYOK, and no inference markup — from $24/mo.`.slice(0, 155),
    keywords: [`${a.name.toLowerCase()} alternative`, `alternative to ${a.name.toLowerCase()}`, `${a.slug} alternative openclaw`],
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: { type: 'website', url: `${SITE_URL}${path}`, title: `${a.name} Alternative — VibeOpenClaw`, description: `A managed OpenClaw + Hermes alternative to ${a.name}, from $24/mo.` },
  };
}

export default async function AlternativePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getAlternative(slug);
  if (!a) notFound();
  const path = `/openclaw-hosting/alternatives/${a.slug}`;

  const FAQ: Faq[] = [
    { q: `Is VibeOpenClaw a good ${a.name} alternative?`, a: `If you want a managed OpenClaw host that also runs Hermes, with per-agent Docker isolation, AES-256-GCM key encryption, and BYOK with no inference markup, VibeOpenClaw is a strong ${a.name} alternative — from $24/mo with a one-click, ~30-second deploy.` },
    { q: `How is VibeOpenClaw different from ${a.name}?`, a: `${a.known} VibeOpenClaw is purpose-built for agents and is the managed host that runs both OpenClaw and Hermes, isolates every agent in its own Docker container, and encrypts your provider keys at rest.` },
    { q: `Can I move from ${a.name} to VibeOpenClaw?`, a: `Yes. It’s BYOK, so you keep your own model provider and keys. Sign up, add your key, deploy an OpenClaw (or Hermes) agent, and reconnect your channel — you’re live in about 30 seconds.` },
    { q: `What does it cost?`, a: `Pro is $24/month (1 OpenClaw agent, Telegram & Discord) and Premium is $48/month (up to 3 OpenClaw or Hermes agents, all channels including Slack). You pay your model provider directly — we never mark up inference.` },
    { q: `Does VibeOpenClaw run Hermes too?`, a: `Yes — it’s the managed host that runs both OpenClaw and Hermes, side-by-side on Premium.` },
  ];

  const FEATURES = [
    { title: 'Both OpenClaw and Hermes', body: 'Run either agent — or both side-by-side on Premium. Most OpenClaw hosts do OpenClaw only.' },
    { title: 'Per-agent Docker isolation', body: 'Every agent gets its own container and RAM, so one agent can’t reach another’s memory or keys.' },
    { title: 'Encrypted keys, no markup', body: 'BYOK across 13 providers, keys encrypted at rest with AES-256-GCM, and we never mark up your inference.' },
    { title: '~30-second deploy', body: 'One-click managed deploy — no Docker, SSH, or server to run.' },
  ];

  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: 'Alternatives', path: '/openclaw-hosting/alternatives' }, { name: a.name }]} />

      <Hero
        eyebrow="OpenClaw hosting · Alternative"
        title={`Looking for a ${a.name} alternative?`}
        subtitle={
          <>
            VibeOpenClaw is a managed OpenClaw <em>and</em> Hermes host with per-agent Docker isolation, true BYOK, and
            no inference markup — from <strong className="text-[#f0f4ff]">${PLANS.pro.monthly}/mo</strong>.
          </>
        }
      />

      <P>{a.known}</P>
      <P>Consider VibeOpenClaw as an alternative if {a.switchReason}</P>

      <H2 id="what">What VibeOpenClaw gives you</H2>
      <FeatureGrid features={FEATURES} />

      <H2 id="switch">What you keep when you switch</H2>
      <P>It’s BYOK, so you keep your own model provider, your own keys, and your channels (Telegram, Discord, Slack). Deploy an OpenClaw or Hermes agent, reconnect your channel token, and you’re live in ~30 seconds — see <a href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">OpenClaw hosting</a> or compare all options in the <a href="/blog/best-openclaw-hosting-providers-2026" className="text-[#00e5cc] hover:underline">best providers guide</a>.</P>

      <FaqAccordion faqs={FAQ} />

      <Cta title={`A managed alternative to ${a.name}`} body="Both agents, Docker isolation, BYOK with no markup — from $24/mo, live in ~30 seconds." />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: 'Alternatives', path: '/openclaw-hosting/alternatives' }, { name: a.name, path }]),
          serviceLd({ name: `VibeOpenClaw — ${a.name} alternative`, description: `Managed OpenClaw + Hermes alternative to ${a.name}.`, path, lowPrice: PLANS.pro.monthly, highPrice: PLANS.premium.monthly }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
