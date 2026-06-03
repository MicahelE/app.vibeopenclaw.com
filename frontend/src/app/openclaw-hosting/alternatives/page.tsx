import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, jsonLd } from '@/components/marketing/schema';
import { ALTERNATIVES } from '@/content/alternatives';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';

export const metadata: Metadata = {
  title: 'OpenClaw Hosting Alternatives | VibeOpenClaw',
  description: 'Comparing OpenClaw hosting providers? See how VibeOpenClaw — managed OpenClaw and Hermes with Docker isolation and BYOK — stacks up as an alternative.',
  alternates: { canonical: `${SITE_URL}/openclaw-hosting/alternatives` },
};

// Bespoke alternative pages that live at their own URLs.
const BESPOKE = [
  { name: 'xCloud', path: '/openclaw-hosting/xcloud-alternative' },
  { name: 'MyClaw', path: '/openclaw-hosting/myclaw-alternative' },
];

export default function AlternativesIndex() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: 'Alternatives' }]} />
      <Hero eyebrow="OpenClaw hosting" title="OpenClaw hosting alternatives" subtitle="See how VibeOpenClaw compares to other OpenClaw hosts — the managed option that runs both OpenClaw and Hermes." />

      <ul className="grid md:grid-cols-2 gap-3 mt-8">
        {[...BESPOKE, ...ALTERNATIVES.map((a) => ({ name: a.name, path: `/openclaw-hosting/alternatives/${a.slug}` }))].map((a) => (
          <li key={a.path}>
            <Link href={a.path} className="block rounded-xl border border-[rgba(136,146,176,0.15)] bg-[rgba(10,15,26,0.4)] p-5 hover:border-[rgba(136,146,176,0.3)] transition-all">
              <span className="font-semibold text-[#f0f4ff]">{a.name} alternative →</span>
            </Link>
          </li>
        ))}
      </ul>

      <JsonLd data={jsonLd(breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'OpenClaw Hosting', path: '/openclaw-hosting' }, { name: 'Alternatives', path: '/openclaw-hosting/alternatives' }]))} />
    </MarketingShell>
  );
}
