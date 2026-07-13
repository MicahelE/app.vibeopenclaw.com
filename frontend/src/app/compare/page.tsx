import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, jsonLd } from '@/components/marketing/schema';
import { COMPARE_PAGES } from '@/content/compare';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';

export const metadata: Metadata = {
  title: 'Compare OpenClaw & Hermes Hosting Options | VibeOpenClaw',
  description: 'Head-to-head comparisons of VibeOpenClaw against other OpenClaw hosts, raw VPS/PaaS options, and OpenClaw vs Hermes.',
  alternates: { canonical: `${SITE_URL}/compare` },
};

export default function CompareIndex() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Compare' }]} />
      <Hero eyebrow="Compare" title="Comparisons" subtitle="Fair, factual side-by-sides to help you pick the right way to run OpenClaw or Hermes." />

      <ul className="grid md:grid-cols-2 gap-3 mt-8">
        {COMPARE_PAGES.map((c) => (
          <li key={c.slug}>
            <Link href={`/compare/${c.slug}`} className="block rounded-xl border border-[rgba(136,146,176,0.15)] bg-[rgba(10,15,26,0.4)] p-5 hover:border-[rgba(136,146,176,0.3)] transition-all">
              <span className="font-semibold text-[#f0f4ff]">{c.title} →</span>
            </Link>
          </li>
        ))}
      </ul>

      <JsonLd data={jsonLd(breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Compare', path: '/compare' }]))} />
    </MarketingShell>
  );
}
