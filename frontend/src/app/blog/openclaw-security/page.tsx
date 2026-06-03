import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, FeatureGrid, FaqAccordion, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, articleLd, jsonLd, type Faq } from '@/components/marketing/schema';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/blog/openclaw-security';
const PUBLISHED = '2026-06-03';

export const metadata: Metadata = {
  title: 'OpenClaw Security: Is It Safe to Run? (2026)',
  description:
    'Is OpenClaw safe to run? A practical look at the OpenClaw security risk surface and how per-agent isolation, encrypted keys, and least-privilege tokens reduce it.',
  keywords: ['openclaw security', 'is openclaw safe', 'openclaw security best practices', 'secure openclaw hosting'],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    type: 'article',
    url: `${SITE_URL}${PATH}`,
    title: 'OpenClaw Security: Is It Safe to Run? (2026)',
    description: 'The OpenClaw security risk surface explained, plus how isolation and encrypted keys reduce real-world risk.',
  },
};

const RISKS = [
  {
    title: 'Publicly exposed instances',
    body: 'When an agent’s control panel or dashboard is bound to a public port without authentication, anyone who finds it can read state or issue commands. Exposed instances have been reported across many self-hosted tools — OpenClaw is no different if you skip a firewall.',
  },
  {
    title: 'Over-broad skill permissions',
    body: 'An agent that can run shell, send money, or post anywhere is powerful — and dangerous if a prompt is hijacked. Granting every skill the maximum scope turns a small mistake into a large blast radius.',
  },
  {
    title: 'Leaked API keys',
    body: 'Your agent holds model-provider keys and channel tokens. If those land in plaintext config, logs, or a screenshot, an attacker can run up your bill or impersonate your bot. Key handling is the single highest-value thing to get right.',
  },
  {
    title: 'Supply-chain risk in community skills',
    body: 'Community skill marketplaces can carry supply-chain risk: a skill you install runs with your agent’s permissions. Unvetted or compromised packages are a well-known attack vector across every open ecosystem.',
  },
];

const FAQ: Faq[] = [
  {
    q: 'Is OpenClaw safe?',
    a: 'OpenClaw is open source and safe to run when configured correctly. The risk does not come from the project itself but from how you deploy it: an agent that holds your API keys, runs third-party skills, and exposes an endpoint to the internet is a real attack surface. Run each agent isolated, encrypt keys at rest, scope channel tokens to least privilege, vet the skills you install, and keep it patched — and OpenClaw is as safe as the practices around it. Managed hosting handles most of that hardening for you.',
  },
  {
    q: 'Are community skills safe?',
    a: 'Treat them like any third-party package. A skill runs with your agent’s permissions, so a malicious or compromised one could read your data or misuse your keys. Community skill marketplaces can carry supply-chain risk. Install only skills you can read and trust, prefer popular and maintained ones, review what permissions they request, and avoid giving any single skill more scope than the task needs.',
  },
  {
    q: 'How are my API keys protected?',
    a: 'That depends entirely on your host. On VibeOpenClaw, provider keys are encrypted at rest with AES-256-GCM and decrypted only in-process for the actual model call — they are never written to logs and never re-displayed after you enter them. The goal is that a key exists in plaintext only for the moment it is used, and nowhere else. If you self-host, you are responsible for equivalent at-rest encryption and for keeping keys out of logs and config dumps.',
  },
  {
    q: 'Can one agent read another agent’s data?',
    a: 'It should not, and on a properly isolated host it cannot. VibeOpenClaw runs each agent in its own Docker container with dedicated RAM, so one agent cannot reach another agent’s memory, keys, or filesystem. On a shared VPS where multiple agents run in the same process or container, that boundary may not exist — which is one of the main reasons isolation matters.',
  },
  {
    q: 'Should I expose OpenClaw to the public internet?',
    a: 'Only what you must. Most OpenClaw deployments do not need a public HTTP endpoint at all. On VibeOpenClaw, Hermes runs as a messaging gateway with no public HTTP endpoint — it connects out to chat platforms rather than listening for inbound web traffic, which removes a whole category of exposure. If you self-host, keep control ports behind a firewall or VPN and never bind a dashboard to 0.0.0.0 without authentication.',
  },
  {
    q: 'Does using my own API keys (BYOK) make OpenClaw more or less secure?',
    a: 'BYOK is generally more secure because your keys stay in systems you control and are never shared with a reseller marking up inference. VibeOpenClaw supports 13 BYOK providers, encrypts those keys at rest, and pays nothing to your model provider on your behalf. The trade-off is that you must protect those keys — which is exactly why at-rest encryption and never-logged handling matter.',
  },
  {
    q: 'What is the single most important OpenClaw security step?',
    a: 'Don’t expose it unnecessarily. The most common real-world incidents come from instances reachable on the open internet without authentication. After that, protect your keys (encrypted at rest, never in logs) and limit skill and channel permissions to least privilege. Those three habits cover the large majority of practical risk.',
  },
];

export default function OpenClawSecurityPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: 'OpenClaw Security' }]} />

      <Hero
        eyebrow="Security · 2026"
        title="OpenClaw security: is it safe to run?"
        subtitle="OpenClaw executes real actions and connects to live APIs, so isolation and key handling matter more than for a typical app. Here’s the honest risk surface — and how to shrink it."
      />

      <P>
        OpenClaw (Clawdbot) is not a chatbot that just talks. It executes real actions, installs skills, and connects to live
        APIs with your credentials. That power is the whole point — and it’s also why <strong className="text-[#f0f4ff]">OpenClaw security</strong>{' '}
        deserves more thought than securing a static web app. The good news: the project is open source and the risks are
        well-understood. Almost every real-world incident traces back to how an instance was <em>deployed</em>, not to a flaw
        in OpenClaw itself. This guide walks the risk surface in plain terms, then shows the practices — and the hosting
        choices — that reduce it.
      </P>

      <P>
        Short answer to “is OpenClaw safe?”: yes, when you run each agent isolated, encrypt its keys, scope its tokens, vet
        its skills, and don’t expose it to the open internet. Those five habits cover the vast majority of practical risk.
        Below we unpack each, and explain what a good managed host does for you automatically.
      </P>

      <H2 id="risk-surface">The risk surface</H2>
      <P>
        Picture the worst case: an agent holding your API keys, running a third-party skill you didn’t read closely, on an
        endpoint that’s reachable from the internet. Every one of those is fine on its own; stacked together they’re how
        things go wrong. The risk falls into a few well-known categories.
      </P>
      <FeatureGrid features={RISKS} />
      <P>
        None of these are unique to OpenClaw — they’re the same categories that apply to any self-hosted automation tool that
        holds credentials and runs extensions. What’s unique is that an AI agent acts on its own, so a misconfiguration can be
        exploited without a human in the loop. That’s the argument for defense in depth rather than any single control.
      </P>

      <H2 id="reduce-risk">How to reduce risk</H2>
      <P>The mitigations map cleanly onto the risks above:</P>
      <FeatureGrid
        features={[
          { title: 'Run each agent isolated', body: 'Give every agent its own container and memory so a compromise of one can’t reach another’s keys, data, or filesystem. Shared processes mean a shared blast radius.' },
          { title: 'Encrypt keys at rest', body: 'Store provider keys and channel tokens encrypted, not in plaintext config or environment files that end up in backups and logs. Decrypt only at the moment of use.' },
          { title: 'Least-privilege channel tokens', body: 'Scope Telegram/Discord/Slack tokens and bot permissions to exactly what the agent needs. A read-only or single-channel token limits what a hijack can do.' },
          { title: 'Vet the skills you install', body: 'Read what a community skill does before installing, prefer maintained and popular ones, and don’t grant broad scopes for a narrow task. Treat skills like dependencies.' },
          { title: 'Keep it patched', body: 'Track upstream OpenClaw releases and apply security updates promptly. Most exploited bugs are already fixed in a newer version by the time they’re abused.' },
          { title: 'Don’t expose unnecessary ports', body: 'Keep control panels and dashboards behind a firewall or VPN. If a service doesn’t need a public endpoint, don’t give it one — most agents don’t need inbound web traffic at all.' },
        ]}
      />

      <H2 id="managed-hosting">How managed hosting helps</H2>
      <P>
        Most of the hardening above is operational work you’d otherwise own forever. Managed hosting bakes it in. Here’s
        specifically how <Link href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">VibeOpenClaw</Link> maps to
        each risk:
      </P>
      <FeatureGrid
        features={[
          { title: 'Per-agent Docker isolation', body: 'Each agent runs in its own Docker container with dedicated RAM. One agent can’t reach another agent’s memory, keys, or filesystem — isolation is the default, not something you have to configure.' },
          { title: 'AES-256-GCM key encryption', body: 'Provider keys are encrypted at rest with AES-256-GCM and decrypted only in-process for the model call. They’re never written to logs and never re-displayed after you enter them.' },
          { title: 'Automatic updates', body: 'Security patches and OpenClaw releases are applied for you, so an agent doesn’t quietly drift onto a vulnerable version while you’re busy.' },
          { title: 'No public HTTP endpoint for Hermes', body: 'Hermes runs as a messaging gateway with no public HTTP endpoint. It connects out to chat platforms instead of listening for inbound web traffic — removing an entire category of exposure.' },
        ]}
      />
      <P>
        It’s the same logic as <Link href="/blog/byok-ai-agent-platform" className="text-[#00e5cc] hover:underline">a true BYOK platform</Link>:
        you keep control of your keys, but the infrastructure handles the parts that are easy to get wrong. If you’re weighing
        the trade-offs of doing it yourself, see{' '}
        <Link href="/blog/managed-vs-self-hosting-openclaw" className="text-[#00e5cc] hover:underline">managed vs self-hosting OpenClaw</Link>.
      </P>

      <H2 id="checklist">Self-hosting security checklist</H2>
      <P>
        Prefer to run it yourself? You can get to a solid security posture — it just becomes your responsibility. Work through
        this in order:
      </P>
      <ol className="list-decimal pl-6 space-y-2.5 text-[#c8d0e0] leading-relaxed my-6">
        <li>Run each agent in its own container with dedicated resources — never share a process between agents.</li>
        <li>Encrypt API keys and channel tokens at rest; keep them out of plaintext config, logs, and backups.</li>
        <li>Bind control panels to localhost or a private network, and put them behind a firewall or VPN.</li>
        <li>Scope every channel token (Telegram/Discord/Slack) and skill permission to least privilege.</li>
        <li>Read and vet community skills before installing; pin versions and review updates.</li>
        <li>Enable TLS for any endpoint you do expose, and require authentication on every admin surface.</li>
        <li>Subscribe to upstream releases and apply security patches promptly.</li>
        <li>Rotate keys and tokens periodically, and immediately if one may have leaked.</li>
        <li>Keep audit logs of agent actions — but make sure those logs never contain secrets.</li>
        <li>Test your firewall from outside the host to confirm nothing is exposed that shouldn’t be.</li>
      </ol>

      <FaqAccordion faqs={FAQ} />

      <Cta title="Run OpenClaw the hardened way" body="Per-agent Docker isolation, AES-256-GCM encrypted keys, automatic updates, and no exposed endpoints — from $24/mo." />

      <Sources
        items={[
          { label: 'OpenClaw — official repository', url: 'https://github.com/openclaw/openclaw' },
          { label: 'VibeOpenClaw — managed OpenClaw hosting', url: `${SITE_URL}/openclaw-hosting` },
          { label: 'OWASP — Top 10 risks for LLM applications', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/' },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: 'OpenClaw Security', path: PATH }]),
          articleLd({ headline: 'OpenClaw Security: Is It Safe to Run? (2026)', description: metadata.description as string, path: PATH, datePublished: PUBLISHED }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
