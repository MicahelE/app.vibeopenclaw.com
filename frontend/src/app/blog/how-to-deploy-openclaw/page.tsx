import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, ComparisonTable, FaqAccordion, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, articleLd, jsonLd, type Faq } from '@/components/marketing/schema';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/blog/how-to-deploy-openclaw';
const PUBLISHED = '2026-06-03';

export const metadata: Metadata = {
  title: 'How to Deploy OpenClaw (DIY Docker vs One-Click)',
  description:
    'How to deploy OpenClaw two ways: the DIY Docker path on your own VPS, or a one-click managed deploy on VibeOpenClaw that goes live in ~30 seconds.',
  keywords: ['how to deploy openclaw', 'how to host openclaw', 'openclaw setup', 'deploy openclaw'],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    type: 'article',
    url: `${SITE_URL}${PATH}`,
    title: 'How to Deploy OpenClaw (DIY Docker vs One-Click)',
    description: 'Two ways to deploy OpenClaw: DIY with Docker on a VPS, or a one-click managed container on VibeOpenClaw.',
  },
};

const FAQ: Faq[] = [
  {
    q: 'What do I need to deploy OpenClaw?',
    a: 'Four things: a server to run it on (a VPS for the DIY route, or none if you go managed), a container runtime — OpenClaw is a Node.js app that ships as a Docker image, a model API key from a provider like OpenAI or Anthropic (OpenClaw is bring-your-own-key), and a bot token for the channel you want to chat through (Telegram, Discord, or Slack).',
  },
  {
    q: 'Can I deploy OpenClaw without Docker?',
    a: 'You can run it straight from Node.js by cloning the repo at github.com/openclaw/openclaw, but Docker is the recommended path because it pins dependencies and isolates the process. The DIY guide below uses Docker; the managed route runs each agent in its own Docker-isolated container for you.',
  },
  {
    q: 'How long does it take to deploy OpenClaw?',
    a: 'On the DIY path, plan for an hour or two the first time once you add VPS setup, Docker install, SSL, reverse proxy, and a restart policy — more if anything fights you. On VibeOpenClaw the deploy itself takes about 30 seconds: pick the model, paste a channel token, and click Create.',
  },
  {
    q: 'Which channels can OpenClaw connect to?',
    a: 'On VibeOpenClaw, OpenClaw connects to Telegram, Discord, and Slack only. Pro ($24/mo) includes Telegram and Discord; Premium ($48/mo) adds Slack and all channels. Self-hosting, you wire up whatever connectors OpenClaw supports yourself.',
  },
  {
    q: 'Do I need my own API key to run OpenClaw?',
    a: 'Yes. OpenClaw is BYOK (bring your own key) — you supply a model provider key and pay that provider directly for inference. VibeOpenClaw supports 13 providers: OpenAI, Anthropic, Google, Groq, xAI, Mistral, DeepSeek, Together, Fireworks, Perplexity, OpenRouter, Cohere, and NVIDIA. Keys are encrypted at rest with AES-256-GCM and we never mark up inference.',
  },
  {
    q: 'How do I keep OpenClaw running 24/7 on a VPS?',
    a: 'Run the container with a restart policy (for example, Docker\'s restart=always) so it comes back after crashes and reboots, then add monitoring so you know when it goes down. You also own OS patching, certificate renewal, and backups. Managed hosting handles restarts, SSL, and updates for you so the agent stays up without babysitting.',
  },
  {
    q: 'Is managed OpenClaw deployment worth it over self-hosting?',
    a: 'If you want full filesystem control and already have the ops skills, self-hosting on a VPS is the cheapest sticker price. For most people a one-click managed deploy is worth it: no SSH, no reverse-proxy config, no restart scripts, and the agent is live in about 30 seconds with isolation and encrypted keys included.',
  },
  {
    q: 'Can I run more than one OpenClaw agent?',
    a: 'On VibeOpenClaw, Pro runs one OpenClaw agent with 2 GB of RAM, and Premium runs up to three agents — OpenClaw or Hermes — with 4 GB each. Self-hosting, you can run as many containers as your VPS has RAM and CPU to spare, but each one is yours to configure and keep alive.',
  },
];

const COLS = ['DIY VPS + Docker', 'VibeOpenClaw (managed)'];
const ROWS: (string | boolean)[][] = [
  ['Time to first deploy', '1–2 hrs (first time)', '~30 seconds'],
  ['Need a VPS', true, false],
  ['Docker setup', 'You install & configure', 'Handled'],
  ['SSL / reverse proxy', 'You configure', 'Handled'],
  ['Restarts & uptime', 'Your restart policy', 'Handled'],
  ['Per-agent isolation', 'You design it', 'Docker-isolated container'],
  ['Encrypted key storage', 'Your responsibility', 'AES-256-GCM at rest'],
  ['BYOK (no markup)', true, true],
  ['Channels', 'Whatever you wire up', 'Telegram, Discord, Slack'],
  ['Monthly cost', '$5–$15 VPS + your time', 'From $24/mo'],
];

export default function HowToDeployOpenClawPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: 'How to Deploy OpenClaw' }]} />

      <Hero
        eyebrow="Tutorial · 2026"
        title="How to deploy OpenClaw"
        subtitle="Two ways to get your OpenClaw (Clawdbot) assistant live: the DIY-Docker path on your own VPS, or a one-click managed deploy on VibeOpenClaw that runs in about 30 seconds."
      />

      <P>
        OpenClaw crossed <strong className="text-[#f0f4ff]">376,000+ GitHub stars</strong> by June 2026, and the most common question new
        users ask is simply: how do I deploy it? There are two honest answers. You can self-host it with Docker on a VPS and own every moving
        part, or you can let a managed platform run it for you in an isolated container. This guide walks both paths end to end so you can pick
        the one that fits your time and your ops appetite.
      </P>

      <P>
        OpenClaw is a Node.js application distributed as a Docker image from{' '}
        <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener noreferrer" className="text-[#00e5cc] hover:underline">
          github.com/openclaw/openclaw
        </a>
        . Whichever path you take, the core ingredients are the same — what changes is how much of the plumbing you own.
      </P>

      <H2 id="what-you-need">What you need</H2>
      <P>Before you deploy OpenClaw either way, line up these four things:</P>
      <ul className="list-disc pl-6 space-y-2 text-[#c8d0e0] my-4">
        <li><strong className="text-[#f0f4ff]">A server</strong> — a VPS for the DIY route (Hetzner, Contabo, DigitalOcean, etc.), or none at all if you go managed.</li>
        <li><strong className="text-[#f0f4ff]">Docker</strong> — the container runtime that runs the OpenClaw image. On the managed path this is already there.</li>
        <li><strong className="text-[#f0f4ff]">A model API key</strong> — OpenClaw is BYOK, so you bring a key from a provider such as OpenAI, Anthropic, Google, Groq, or any of the 13 providers VibeOpenClaw supports.</li>
        <li><strong className="text-[#f0f4ff]">A channel bot token</strong> — a Telegram, Discord, or Slack bot token so people can actually talk to the agent.</li>
      </ul>

      <H2 id="path-1-diy">Path 1 — DIY with Docker</H2>
      <P>
        The self-hosted route gives you full control of the filesystem and the box. It also makes you the operator. Here is the realistic
        sequence, not the marketing version:
      </P>
      <ol className="list-decimal pl-6 space-y-3 text-[#c8d0e0] my-4">
        <li>
          <strong className="text-[#f0f4ff]">Rent a VPS.</strong> Spin up a small Linux instance — 2 GB of RAM is a sane minimum for a single
          OpenClaw agent. Note the public IP, then SSH in. You now own this machine, including its security updates.
        </li>
        <li>
          <strong className="text-[#f0f4ff]">Install Docker.</strong> Install the Docker engine and confirm the daemon is running. If you want
          multiple agents or supporting services, you may add Docker Compose here too.
        </li>
        <li>
          <strong className="text-[#f0f4ff]">Pull and run OpenClaw.</strong> Pull the OpenClaw image (it is a Node.js app under the hood) and
          start a container. Map a port and a volume so config and conversation state survive restarts.
        </li>
        <li>
          <strong className="text-[#f0f4ff]">Configure your channel token and model key.</strong> Pass your Telegram/Discord/Slack bot token and
          your model provider API key into the container as environment variables or a config file. Treat both as secrets — never bake them into
          an image or commit them.
        </li>
        <li>
          <strong className="text-[#f0f4ff]">Set up SSL and a reverse proxy.</strong> Put something like Nginx or Caddy in front, point a domain
          at the box, and get TLS certificates issued and auto-renewing. This is also where you handle port forwarding and firewall rules so the
          right ports are open and the rest are closed.
        </li>
        <li>
          <strong className="text-[#f0f4ff]">Keep it running 24/7.</strong> Add a restart policy (for example <code className="text-[#00e5cc]">--restart=always</code>)
          so the container recovers from crashes and reboots, set up monitoring so you find out when it falls over, and schedule backups of your
          volumes. From here on, certificate renewals, OS patches, and restarts are your job.
        </li>
      </ol>
      <P>
        None of these steps is exotic, but together they are real, ongoing work. If you enjoy owning the box and have done this before, the DIY
        path is the cheapest in dollars — a VPS runs roughly $5–$15/month. If SSH, reverse proxies, and 2 a.m. restart scripts sound like a chore,
        keep reading.
      </P>

      <H2 id="path-2-managed">Path 2 — One-click on VibeOpenClaw</H2>
      <P>
        The managed path skips every server step above. VibeOpenClaw runs OpenClaw for you in a Docker-isolated container with SSL, restarts, and
        updates already handled. Here is the whole flow:
      </P>
      <ol className="list-decimal pl-6 space-y-3 text-[#c8d0e0] my-4">
        <li><strong className="text-[#f0f4ff]">Sign up</strong> for a plan — Pro ($24/mo) runs one OpenClaw agent with 2 GB of RAM on Telegram and Discord; Premium ($48/mo) runs up to three OpenClaw or Hermes agents with 4 GB each and adds Slack.</li>
        <li><strong className="text-[#f0f4ff]">Add your provider key</strong> on the API Keys page. Paste a key from any of the 13 supported providers — OpenAI, Anthropic, Google, Groq, xAI, Mistral, DeepSeek, Together, Fireworks, Perplexity, OpenRouter, Cohere, or NVIDIA. Keys are encrypted at rest with AES-256-GCM, and we never mark up inference.</li>
        <li><strong className="text-[#f0f4ff]">Click New Agent → OpenClaw</strong> to start a fresh deploy.</li>
        <li><strong className="text-[#f0f4ff]">Pick your model</strong> from the provider key you just added.</li>
        <li><strong className="text-[#f0f4ff]">Paste your Telegram or Discord bot token</strong> (Slack too, on Premium) so the agent has a channel to talk through.</li>
        <li><strong className="text-[#f0f4ff]">Click Create.</strong> Your agent is live in about 30 seconds, running in its own Docker-isolated container with SSL and automatic restarts handled for you.</li>
      </ol>
      <P>
        That is the entire deploy. No VPS to rent, no Docker to install, no reverse proxy to configure, and no restart policy to write. When you
        want a second agent or want to add Hermes alongside OpenClaw, you repeat the New Agent step.
      </P>

      <H2 id="which-path">Which path?</H2>
      <P>
        The verdict comes down to what you value. Choose the <strong className="text-[#f0f4ff]">DIY Docker path</strong> if you want full
        filesystem control, already run your own infrastructure, and treat the ops work as a feature rather than a tax. Choose the{' '}
        <strong className="text-[#f0f4ff]">managed path</strong> if you want OpenClaw live in 30 seconds, isolated per agent, with encrypted
        keys, SSL, and restarts handled — and you would rather spend your time using the agent than babysitting it. For most people, managed wins;
        for tinkerers and infra teams, DIY is a fair trade.
      </P>

      <H2 id="table">DIY vs managed at a glance</H2>
      <ComparisonTable cols={COLS} rows={ROWS} highlightCol={1} />

      <P>
        Want to go deeper? See our{' '}
        <Link href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">managed OpenClaw hosting</Link> page, compare the agents in{' '}
        <Link href="/compare/openclaw-vs-hermes" className="text-[#00e5cc] hover:underline">OpenClaw vs Hermes</Link>, or weigh providers in{' '}
        <Link href="/blog/best-openclaw-hosting-providers-2026" className="text-[#00e5cc] hover:underline">the best OpenClaw hosting providers in 2026</Link>.
      </P>

      <FaqAccordion faqs={FAQ} />

      <Cta title="Deploy OpenClaw in about 30 seconds" body="Skip the VPS, Docker, and SSL setup. One-click OpenClaw in a Docker-isolated container with true BYOK — from $24/mo." />

      <Sources
        items={[
          { label: 'OpenClaw — official repository (376k+ stars, June 2026)', url: 'https://github.com/openclaw/openclaw' },
          { label: 'Docker — restart policies documentation', url: 'https://docs.docker.com/engine/containers/start-containers-automatically/' },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: 'How to Deploy OpenClaw', path: PATH }]),
          articleLd({ headline: 'How to Deploy OpenClaw (DIY Docker vs One-Click)', description: metadata.description as string, path: PATH, datePublished: PUBLISHED }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
