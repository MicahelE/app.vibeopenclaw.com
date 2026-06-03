import type { Metadata } from 'next';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, ComparisonTable, FaqAccordion, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, articleLd, jsonLd, type Faq } from '@/components/marketing/schema';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/blog/managed-vs-self-hosting-openclaw';
const PUBLISHED = '2026-06-03';

export const metadata: Metadata = {
  title: 'Managed vs Self-Hosting OpenClaw in 2026: Cost & Security',
  description:
    'Managed vs self-hosting OpenClaw in 2026 — a cost, security, and effort comparison. When a $24/mo managed host beats a DIY VPS, and when self-hosting still makes sense.',
  keywords: ['managed vs self hosting openclaw', 'openclaw hosting vs vps', 'self-hosted openclaw', 'openclaw managed or self hosted', 'openclaw vps'],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { type: 'article', url: `${SITE_URL}${PATH}`, title: 'Managed vs Self-Hosting OpenClaw in 2026', description: 'Cost, security, and effort compared — managed OpenClaw hosting vs a DIY VPS.' },
};

const FAQ: Faq[] = [
  { q: 'Should I choose managed or self-hosted OpenClaw?', a: 'Choose managed if you want OpenClaw running in about 30 seconds with isolation, encrypted keys, SSL, and updates handled — and you’d rather not operate a server. Choose self-hosted if you want full filesystem control, run on hardware you already own, and are comfortable owning Docker, patching, backups, and 24/7 uptime yourself. You can always start managed and migrate later.' },
  { q: 'How much does managed OpenClaw hosting cost vs a VPS?', a: 'Managed runs roughly $10–$95/month (VibeOpenClaw from $24) with everything included. A DIY VPS is $5–$15/month in raw server cost — but the real price is your time: Docker setup, SSL, security patching, backups, monitoring, and being on call when it breaks. For most people the managed fee is cheaper than an evening of debugging.' },
  { q: 'Can I self-host OpenClaw for free?', a: 'OpenClaw itself is open-source and free to run, but “free” still needs a machine that stays on 24/7 and your time to operate it. Running it on your laptop means it stops when the laptop sleeps, so most self-hosters rent a VPS — which isn’t free.' },
  { q: 'Is self-hosted OpenClaw secure?', a: 'It can be, but security becomes your job: keeping the OS and OpenClaw patched, locking down exposed ports, encrypting your API keys, vetting community skills, and isolating the agent. Misconfiguration is the common failure mode. Managed hosting moves much of that responsibility to the provider.' },
  { q: 'What are the minimum requirements to self-host OpenClaw?', a: 'A small Linux VPS with a couple of GB of RAM, Docker, a public hostname for SSL, a model provider API key, and a channel bot token. Hermes wants more memory than OpenClaw because of its learning loop.' },
  { q: 'Can I migrate from self-hosted to managed later?', a: 'Yes. Deploy a managed agent, point it at the same provider keys, and move your configuration over. On VibeOpenClaw the managed path skips the Docker/SSL/permission setup entirely.' },
  { q: 'Does managed hosting limit what OpenClaw can do?', a: 'Not in practice for most users — you still bring your own keys, choose your model, and connect your channels. What you trade is root filesystem access on the host, which most people never need.' },
  { q: 'How do I keep my model API costs under control?', a: 'Because every host uses BYOK, your model spend is separate from hosting and depends on your usage and chosen model. Pick a cost-appropriate model, watch your provider’s usage dashboard, and set provider-side spend limits. A good host never marks up inference, so the provider’s price is the price.' },
];

const MASTER: (string | boolean)[][] = [
  ['Time to first agent', '~30 seconds', 'Hours (VPS + Docker + SSL)'],
  ['Technical skill required', 'None', 'Linux, Docker, networking'],
  ['Monthly cost', 'From $24, all-in', '$5–15 VPS + your time'],
  ['SSL / HTTPS', 'Automatic', 'You configure'],
  ['Security patching', 'Managed', 'You own it'],
  ['Backups', 'Managed', 'You set up'],
  ['Per-agent isolation', 'Built-in (Docker)', 'You design it'],
  ['Encrypted key storage', 'AES-256-GCM', 'Your responsibility'],
  ['24/7 uptime', 'On our servers', 'Your box must stay on'],
  ['Runs OpenClaw + Hermes', true, true],
  ['Best for', 'Ship fast, low ops', 'Full control, own hardware'],
];

export default function ManagedVsSelfPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: 'Managed vs Self-Hosting OpenClaw' }]} />

      <Hero
        eyebrow="Guide · 2026"
        title="Managed vs self-hosting OpenClaw in 2026"
        subtitle="A practical comparison of cost, security, and effort — so you can decide whether to run OpenClaw on a managed host or a DIY VPS."
      />

      <P>OpenClaw is open-source and free to run, which makes self-hosting tempting. But “free software” is not “free to operate.” Between the VPS bill, Docker setup, SSL, patching, backups, monitoring, and a machine that has to stay on around the clock, the real question isn’t price — it’s how much of your time you want to spend being a sysadmin. This guide lays out both paths honestly.</P>

      <H2 id="table">The comparison</H2>
      <ComparisonTable cols={['VibeOpenClaw (managed)', 'Self-hosted (DIY VPS)']} rows={MASTER} highlightCol={0} />

      <H2 id="cost">The real cost</H2>
      <P>A DIY VPS from Hetzner or Contabo is $5–$15/month — genuinely cheaper than any managed plan on the sticker. The catch is everything that isn’t the server: the hours to install and configure OpenClaw with Docker, wire up a reverse proxy and SSL, set up backups and monitoring, and the ongoing time to patch and babysit it. Managed hosting (VibeOpenClaw from $24/month) folds all of that into one fee and a ~30-second deploy. For most people, the managed price is less than the value of the evenings self-hosting costs.</P>
      <P>One cost is identical either way: the model API. Every option uses <strong className="text-[#f0f4ff]">BYOK</strong> (bring your own keys), so you pay your provider directly for inference regardless of where OpenClaw runs. A good managed host never marks that up — see <a href="/blog/byok-ai-agent-platform" className="text-[#00e5cc] hover:underline">what BYOK actually buys you</a> and the full <a href="/blog/openclaw-hosting-cost" className="text-[#00e5cc] hover:underline">cost breakdown</a>.</P>

      <H2 id="security">The security trade-off</H2>
      <P>An OpenClaw agent holds your API keys, can run third-party skills, and may be reachable over the network — so isolation and key handling matter. Self-hosting puts all of that on you: OS and OpenClaw patching, locking down exposed ports, encrypting keys, and vetting community skills for supply-chain risk (publicly exposed instances and risky community skills have both been reported in the wild). Managed hosting shifts much of that responsibility to the provider. On VibeOpenClaw, every agent runs in its own Docker container so one agent can’t reach another’s memory or keys, and provider keys are encrypted at rest with AES-256-GCM, decrypted only in-process and never logged or re-displayed. For a deeper look, see <a href="/blog/openclaw-security" className="text-[#00e5cc] hover:underline">OpenClaw security</a>.</P>

      <H2 id="verdict">When each one wins</H2>
      <P><strong className="text-[#f0f4ff]">Choose managed</strong> if you want to ship fast, keep ops near zero, get isolation and encrypted keys by default, and run both OpenClaw and Hermes without touching Docker. <strong className="text-[#f0f4ff]">Choose self-hosting</strong> if you want full root control, are running on hardware you already own, need maximum data locality, and genuinely enjoy operating infrastructure. And remember you can start managed and migrate to self-hosted (or back) later — the decision isn’t permanent.</P>

      <FaqAccordion faqs={FAQ} />

      <Cta title="Skip the ops — deploy managed" body="OpenClaw or Hermes in ~30 seconds, Docker-isolated with encrypted keys and BYOK, from $24/mo." />

      <Sources
        items={[
          { label: 'OpenClaw — official repository (376k+ stars, June 2026)', url: 'https://github.com/openclaw/openclaw' },
          { label: 'Hetzner Cloud — VPS pricing', url: 'https://www.hetzner.com/cloud' },
          { label: 'Contabo VPS — pricing', url: 'https://contabo.com/en/vps/' },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: 'Managed vs Self-Hosting OpenClaw', path: PATH }]),
          articleLd({ headline: 'Managed vs Self-Hosting OpenClaw in 2026', description: metadata.description as string, path: PATH, datePublished: PUBLISHED }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
