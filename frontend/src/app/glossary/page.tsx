import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, jsonLd } from '@/components/marketing/schema';
import { GLOSSARY } from '@/content/glossary';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';

export const metadata: Metadata = {
  title: 'AI Agent Hosting Glossary | VibeOpenClaw',
  description: 'Plain-English definitions of AI agent and hosting terms — BYOK, MCP, Docker isolation, agent skills, model providers, and more.',
  alternates: { canonical: `${SITE_URL}/glossary` },
};

export default function GlossaryIndex() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Glossary' }]} />
      <Hero eyebrow="Glossary" title="AI agent hosting glossary" subtitle="Plain-English definitions of the terms that come up when you're hosting an AI agent." />

      <ul className="grid md:grid-cols-2 gap-3 mt-8">
        {GLOSSARY.map((g) => (
          <li key={g.slug}>
            <Link href={`/glossary/${g.slug}`} className="block rounded-xl border border-[rgba(136,146,176,0.15)] bg-[rgba(10,15,26,0.4)] p-5 hover:border-[rgba(136,146,176,0.3)] transition-all">
              <span className="font-semibold text-[#f0f4ff]">{g.term} →</span>
              <p className="text-sm text-[#8892b0] mt-1">{g.shortDef}</p>
            </Link>
          </li>
        ))}
      </ul>

      <JsonLd data={jsonLd(breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Glossary', path: '/glossary' }]))} />
    </MarketingShell>
  );
}
