import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, jsonLd } from '@/components/marketing/schema';
import { DOCS } from '@/content/docs';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';

export const metadata: Metadata = {
  title: 'Docs — VibeOpenClaw',
  description: 'Documentation for deploying and managing OpenClaw and Hermes agents on VibeOpenClaw: getting started, channels, models, billing, and troubleshooting.',
  alternates: { canonical: `${SITE_URL}/docs` },
};

const CATEGORIES = ['Getting started', 'Channels', 'Models', 'Account', 'Help'] as const;

export default function DocsIndex() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Docs' }]} />
      <Hero eyebrow="Documentation" title="VibeOpenClaw docs" subtitle="Everything you need to deploy and manage OpenClaw and Hermes agents." />

      <div className="space-y-8 mt-8">
        {CATEGORIES.map((cat) => {
          const items = DOCS.filter((d) => d.category === cat);
          if (!items.length) return null;
          return (
            <div key={cat}>
              <h2 className="text-sm font-semibold text-[#8892b0] uppercase tracking-wide mb-3" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>{cat}</h2>
              <ul className="space-y-2">
                {items.map((d) => (
                  <li key={d.slug}>
                    <Link href={`/docs/${d.slug}`} className="block rounded-xl border border-[rgba(136,146,176,0.15)] bg-[rgba(10,15,26,0.4)] p-4 hover:border-[rgba(136,146,176,0.3)] transition-all">
                      <span className="font-semibold text-[#f0f4ff]">{d.title}</span>
                      <span className="block text-sm text-[#8892b0] mt-0.5">{d.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <JsonLd data={jsonLd(breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Docs', path: '/docs' }]))} />
    </MarketingShell>
  );
}
