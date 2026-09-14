import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, FeatureGrid, FaqAccordion, Cta, H2, P, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, serviceLd, jsonLd, type Faq } from '@/components/marketing/schema';
import { VERTICALS, getVertical } from '@/content/verticals';
import { getIntegration } from '@/content/integrations';
import { PLANS } from '@/content/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';

export const dynamicParams = false;

export function generateStaticParams() {
  return VERTICALS.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const v = getVertical(slug);
  if (!v) return {};
  const path = `/openclaw-hosting/for/${v.slug}`;
  return {
    title: `${v.title} | VibeOpenClaw`.slice(0, 60),
    description: v.intro.slice(0, 155),
    keywords: [`openclaw for ${v.slug.replace(/-/g, ' ')}`, `openclaw ${v.slug.replace(/-/g, ' ')}`, 'managed openclaw hosting'],
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: { type: 'website', url: `${SITE_URL}${path}`, title: v.title, description: v.tagline },
  };
}

export default async function VerticalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = getVertical(slug);
  if (!v) notFound();

  const path = `/openclaw-hosting/for/${v.slug}`;
  const roleLabel = v.title.replace(/^OpenClaw for /i, '');
  const integrations = v.integrations.map(getIntegration).filter((i): i is NonNullable<typeof i> => !!i);

  const FAQ: Faq[] = [
    { q: `Is OpenClaw good for ${roleLabel.toLowerCase()}?`, a: v.intro },
    { q: 'How do I connect my tools?', a: `OpenClaw connects to tools like ${integrations.map((i) => i.name).join(', ') || 'your stack'} through its skills system — see the integrations pages for setup details on each.` },
    { q: 'How do I set it up?', a: 'Sign up for VibeOpenClaw, add a model provider key, create an OpenClaw agent, connect your channel, and click Create. It’s live in about 30 seconds in a Docker-isolated container — no servers to run.' },
    { q: 'Which plan and price?', a: 'Pro is $24/mo (1 agent, Telegram & Discord); Premium is $48/mo (up to 3 agents, all channels including Slack). BYOK across 13 providers — you pay your model provider directly with no markup from us.' },
  ];

  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: roleLabel }]} />

      <Hero eyebrow="OpenClaw · For your team" title={v.title} subtitle={v.tagline} />

      <P>{v.intro}</P>

      <H2 id="pain-points">The problems this solves</H2>
      <ul className="list-disc pl-6 space-y-2 text-[#c8d0e0]">
        {v.painPoints.map((p) => <li key={p}>{p}</li>)}
      </ul>

      <H2 id="workflows">Workflows you can run</H2>
      <FeatureGrid features={v.workflows.map((w) => ({ title: w.title, body: w.description }))} />

      {integrations.length > 0 && (
        <>
          <H2 id="integrations">Works with your existing tools</H2>
          <P>
            Connect via OpenClaw skills:{' '}
            {integrations.map((i, idx) => (
              <span key={i.slug}>
                <Link href={`/openclaw-hosting/integrations/${i.slug}`} className="text-[#00e5cc] hover:underline">{i.name}</Link>
                {idx < integrations.length - 1 ? ', ' : ''}
              </span>
            ))}
            . Browse all <Link href="/openclaw-hosting/integrations" className="text-[#00e5cc] hover:underline">OpenClaw integrations</Link>.
          </P>
        </>
      )}

      <H2 id="channel">Best channel for this</H2>
      <P>{v.channelFit}</P>

      <H2 id="related">More ways to use OpenClaw</H2>
      <P>
        See more <Link href="/openclaw-hosting/use-cases/automation" className="text-[#00e5cc] hover:underline">use cases</Link>, or explore other teams:{' '}
        {VERTICALS.filter((o) => o.slug !== v.slug).map((o, idx, arr) => (
          <span key={o.slug}>
            <Link href={`/openclaw-hosting/for/${o.slug}`} className="text-[#00e5cc] hover:underline">{o.title.replace(/^OpenClaw for /i, '')}</Link>
            {idx < arr.length - 1 ? ', ' : ''}
          </span>
        ))}
        .
      </P>

      <FaqAccordion faqs={FAQ} />

      <Cta title="Deploy your OpenClaw agent" body={`${v.tagline} — managed, isolated, BYOK, from $${PLANS.pro.monthly}/mo.`} />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: roleLabel, path }]),
          serviceLd({ name: v.title, description: v.tagline, path, lowPrice: PLANS.pro.monthly, highPrice: PLANS.premium.monthly }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
