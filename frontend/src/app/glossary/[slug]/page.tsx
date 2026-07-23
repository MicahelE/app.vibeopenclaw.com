import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { H2, P, FaqAccordion, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, articleLd, faqPageLd, jsonLd } from '@/components/marketing/schema';
import { GLOSSARY, getGlossaryTerm } from '@/content/glossary';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PUBLISHED = '2026-07-13';

export const dynamicParams = false;
export function generateStaticParams() {
  return GLOSSARY.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGlossaryTerm(slug);
  if (!g) return {};
  const path = `/glossary/${g.slug}`;
  return {
    title: `What Is ${g.term}? | VibeOpenClaw Glossary`.slice(0, 60),
    description: g.shortDef.slice(0, 155),
    keywords: [`what is ${g.term.toLowerCase()}`, `${g.term.toLowerCase()} definition`, `${g.term.toLowerCase()} meaning`],
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: { type: 'article', url: `${SITE_URL}${path}`, title: `What is ${g.term}?`, description: g.shortDef, publishedTime: PUBLISHED },
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGlossaryTerm(slug);
  if (!g) notFound();
  const path = `/glossary/${g.slug}`;

  return (
    <MarketingShell width={760}>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Glossary', path: '/glossary' }, { name: g.term }]} />

      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
          What is {g.term}?
        </h1>
        <p className="text-lg text-[#8892b0] mt-3">{g.shortDef}</p>
      </header>

      {g.paras.map((p, i) => <P key={i}>{p}</P>)}

      <H2 id="here">On VibeOpenClaw</H2>
      {g.hereParas.map((p, i) => <P key={i}>{p}</P>)}

      <H2 id="related">Related terms</H2>
      <ul className="list-disc pl-6 space-y-2 text-[#c8d0e0]">
        {g.related.map((r) => (
          <li key={r.path}><Link href={r.path} className="text-[#00e5cc] hover:underline">{r.label}</Link></li>
        ))}
      </ul>

      {g.faqs && <FaqAccordion faqs={g.faqs} />}

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Glossary', path: '/glossary' }, { name: g.term, path }]),
          articleLd({ headline: `What is ${g.term}?`, description: g.shortDef, path, datePublished: PUBLISHED }),
          ...(g.faqs ? [faqPageLd(g.faqs)] : []),
        )}
      />
    </MarketingShell>
  );
}
