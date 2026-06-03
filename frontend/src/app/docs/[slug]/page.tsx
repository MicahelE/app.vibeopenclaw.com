import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { H2, P, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, jsonLd } from '@/components/marketing/schema';
import { DOCS, getDoc } from '@/content/docs';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';

export const dynamicParams = false;
export function generateStaticParams() {
  return DOCS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getDoc(slug);
  if (!d) return {};
  const path = `/docs/${d.slug}`;
  return {
    title: `${d.title} — Docs | VibeOpenClaw`.slice(0, 60),
    description: d.description.slice(0, 155),
    keywords: [`openclaw ${d.title.toLowerCase()}`, 'vibeopenclaw docs', 'openclaw hosting docs'],
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: { type: 'article', url: `${SITE_URL}${path}`, title: d.title, description: d.description },
  };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDoc(slug);
  if (!d) notFound();
  const path = `/docs/${d.slug}`;

  return (
    <MarketingShell width={760}>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Docs', path: '/docs' }, { name: d.title }]} />

      <header className="mb-6">
        <span className="text-[10px] uppercase tracking-wider font-bold text-[#5a6480]">{d.category}</span>
        <h1 className="text-3xl md:text-4xl font-bold mt-1 leading-tight" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>{d.title}</h1>
        <p className="text-lg text-[#8892b0] mt-3">{d.description}</p>
      </header>

      {d.sections.map((s, i) => (
        <section key={i}>
          {s.heading && <H2>{s.heading}</H2>}
          {s.paras?.map((p, j) => <P key={j}>{p}</P>)}
          {s.steps && (
            <ol className="list-decimal pl-6 space-y-2 text-[#c8d0e0] my-4">
              {s.steps.map((st, j) => <li key={j}>{st}</li>)}
            </ol>
          )}
          {s.bullets && (
            <ul className="list-disc pl-6 space-y-2 text-[#c8d0e0] my-4">
              {s.bullets.map((b, j) => <li key={j}>{b}</li>)}
            </ul>
          )}
        </section>
      ))}

      <div className="mt-10 pt-6 border-t border-[rgba(136,146,176,0.15)] text-sm text-[#8892b0]">
        <Link href="/docs" className="text-[#00e5cc] hover:underline">← All docs</Link>
        <span className="mx-2">·</span>
        <Link href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">OpenClaw hosting</Link>
      </div>

      <JsonLd data={jsonLd(breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Docs', path: '/docs' }, { name: d.title, path }]))} />
    </MarketingShell>
  );
}
