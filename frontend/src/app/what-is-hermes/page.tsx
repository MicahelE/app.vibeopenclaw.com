import type { Metadata } from 'next';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, FeatureGrid, FaqAccordion, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, articleLd, jsonLd, type Faq } from '@/components/marketing/schema';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/what-is-hermes';
const PUBLISHED = '2026-06-03';

const TITLE = 'What Is Hermes Agent? Nous Research’s AI Agent Explained';
const DESCRIPTION =
  'Hermes Agent is an open-source, self-improving AI agent from Nous Research, written in Python with 178k+ GitHub stars. What it is and how to run it.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['what is hermes agent', 'hermes agent explained', 'nous research hermes', 'hermes ai agent', 'hermes agent'],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    type: 'article',
    url: `${SITE_URL}${PATH}`,
    title: TITLE,
    description: DESCRIPTION,
    publishedTime: PUBLISHED,
  },
};

const FAQ: Faq[] = [
  {
    q: 'What is Hermes Agent?',
    a: 'Hermes Agent is an open-source, self-improving AI agent from Nous Research, written in Python. Its defining feature is a learning loop: it creates and improves its own skills from experience, so it gets better at your tasks over time — "the agent that grows with you." With 178k+ GitHub stars as of June 2026, it is one of the most popular open-source agent projects.',
  },
  {
    q: 'Who makes Hermes?',
    a: 'Hermes Agent is built by Nous Research. The project is open source and available at github.com/NousResearch/hermes-agent, where it has 178k+ GitHub stars as of June 2026.',
  },
  {
    q: 'What makes Hermes "self-improving"?',
    a: 'Hermes runs a learning loop. As it handles tasks, it creates new skills and refines existing ones based on what worked, so its capabilities compound with use. Rather than staying static like a fixed chatbot, it adapts to how you work — which is why it is described as "the agent that grows with you."',
  },
  {
    q: 'How is Hermes different from OpenClaw?',
    a: 'Both are open-source agents you can self-host or run on a managed platform, but they differ in language and design. Hermes is Python and centers on a self-improving learning loop that creates and refines skills over time; OpenClaw is Node.js/TypeScript with a ClawHub skills marketplace and 20+ channels. Hermes runs as a messaging gateway with no public HTTP endpoint, supports MCP, and can schedule work with cron. See our OpenClaw vs Hermes comparison for a side-by-side.',
  },
  {
    q: 'Does Hermes support MCP and scheduled tasks?',
    a: 'Yes. Hermes supports the Model Context Protocol (MCP) for connecting tools and context, and it includes cron scheduling so it can run tasks on a recurring timetable rather than only responding to messages.',
  },
  {
    q: 'How do I run Hermes?',
    a: 'You can self-host it — clone the repo, set up Python and Docker, configure your model keys and channels, and keep a server online 24/7 — or use a managed host. On VibeOpenClaw you pick Hermes, add a provider key and a Telegram/Discord/Slack token, and your agent is live in a Docker-isolated container in about 30 seconds, with no Docker or SSH to manage. See our Hermes hosting page for the walkthrough.',
  },
];

const FEATURES = [
  { title: 'Self-improving learning loop', body: 'Hermes creates and refines its own skills from experience, so it gets better at your tasks the more you use it — "the agent that grows with you."' },
  { title: 'Built by Nous Research', body: 'An open-source project from Nous Research, with 178k+ GitHub stars as of June 2026, so you can read, audit, and extend the full codebase.' },
  { title: 'Written in Python', body: 'Hermes is a Python agent, making it a natural fit for Python tooling, libraries, and the broader ML ecosystem.' },
  { title: 'MCP + cron scheduling', body: 'It speaks the Model Context Protocol to connect tools and context, and uses cron to run tasks on a recurring schedule.' },
  { title: 'Messaging-gateway design', body: 'Hermes runs as a messaging gateway with no public HTTP endpoint, so there is no exposed web server to harden — it reaches you through your chat channels.' },
  { title: 'Self-host or managed', body: 'Run it on your own box, or let a managed host like VibeOpenClaw handle Docker, SSL, updates, and uptime for a flat monthly fee.' },
];

export default function WhatIsHermesPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'What Is Hermes Agent?' }]} />

      <Hero
        eyebrow="Hermes Agent, explained"
        title="What is Hermes Agent?"
        subtitle={
          <>
            Hermes Agent is an open-source, self-improving AI agent from{' '}
            <strong className="text-[#f0f4ff]">Nous Research</strong>, written in Python. It is &ldquo;the agent that
            grows with you,&rdquo; with <strong className="text-[#f0f4ff]">178k+ GitHub stars</strong> as of June 2026.
          </>
        }
      />

      <P>
        <strong className="text-[#f0f4ff]">In one sentence: Hermes Agent is an open-source AI agent that improves
        itself</strong> — it creates and refines its own skills from experience, so it gets better at your work over
        time. Built by Nous Research and written in Python, it sits at{' '}
        <a href="https://github.com/NousResearch/hermes-agent" target="_blank" rel="noopener noreferrer" className="text-[#00e5cc] hover:underline">
          github.com/NousResearch/hermes-agent
        </a>{' '}
        with 178k+ stars as of June 2026. Where most assistants stay static, Hermes is designed to grow with you, which
        is the idea behind its tagline.
      </P>

      <H2 id="what-it-is">What Hermes Agent actually is</H2>
      <P>
        Hermes is an <strong className="text-[#f0f4ff]">agent</strong>, not a chatbot. It connects to your messaging
        channels, runs tasks, and acts on your behalf — and crucially, it learns from doing so. The project is open
        source and maintained by Nous Research, a research group known for its work in open models. Because it is written
        in Python, it fits naturally alongside Python tooling and the wider machine-learning ecosystem.
      </P>
      <P>
        The headline trait is self-improvement. A typical assistant ships with a fixed set of abilities; Hermes is
        built to expand its own. That makes it less of a finished tool and more of a companion that becomes more useful
        the longer it works with you.
      </P>

      <H2 id="learning-loop">The learning loop: how it grows with you</H2>
      <P>
        Hermes&rsquo;s defining feature is its <strong className="text-[#f0f4ff]">learning loop</strong>. As it handles
        tasks, it creates new skills and improves existing ones based on what actually worked. Over time, those skills
        compound — the agent accumulates capabilities tailored to how you operate rather than staying frozen at whatever
        it knew on day one.
      </P>
      <P>
        This is what separates &ldquo;the agent that grows with you&rdquo; from a static chatbot. Instead of you
        re-explaining the same context every session, Hermes carries forward what it has learned and gets more capable
        with use. The result is an assistant whose value increases the more you rely on it.
      </P>

      <H2 id="mcp-cron">MCP support and cron scheduling</H2>
      <P>
        Hermes connects to tools and context through the{' '}
        <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="text-[#00e5cc] hover:underline">
          Model Context Protocol (MCP)
        </a>
        , a standard way for agents to plug into external data and capabilities. It also includes{' '}
        <strong className="text-[#f0f4ff]">cron scheduling</strong>, so it can run tasks on a recurring timetable — a
        morning summary, a periodic check, a nightly job — rather than only reacting when you message it. Together, MCP
        and cron let Hermes both reach outward to tools and act on its own schedule.
      </P>

      <H2 id="gateway">A messaging gateway, not a web server</H2>
      <P>
        Hermes runs as a <strong className="text-[#f0f4ff]">messaging gateway with no public HTTP endpoint</strong>. In
        practice, that means there is no exposed web server sitting on the open internet waiting for requests. The agent
        reaches you through your chat channels instead, which reduces the attack surface you would otherwise have to
        secure with a public-facing service.
      </P>

      <H2 id="run">How to run Hermes</H2>
      <P>
        There are two paths. <strong className="text-[#f0f4ff]">Self-hosting</strong> is free in license: clone the repo,
        set up Python and Docker, add your model keys and channel tokens, and keep a machine online 24/7. You get full
        control, but you also own the setup, SSL, updates, backups, and uptime.
      </P>
      <P>
        <strong className="text-[#f0f4ff]">Managed hosting</strong> removes that work. On{' '}
        <a href="/hermes-agent-hosting" className="text-[#00e5cc] hover:underline">VibeOpenClaw</a> you pick Hermes, add a
        provider API key, paste a Telegram/Discord/Slack token, and click Create — your agent boots in a Docker-isolated
        container in about 30 seconds. You bring your own keys across 13 model providers and pay them directly with no
        inference markup, and keys are encrypted at rest with AES-256-GCM.
      </P>

      <H2 id="features">Hermes Agent at a glance</H2>
      <FeatureGrid features={FEATURES} />

      <P>
        Choosing between the two big open-source agents? Read{' '}
        <a href="/compare/openclaw-vs-hermes" className="text-[#00e5cc] hover:underline">OpenClaw vs Hermes Agent</a>. For
        a step-by-step setup, see{' '}
        <a href="/blog/how-to-deploy-hermes-agent" className="text-[#00e5cc] hover:underline">how to deploy Hermes Agent</a>,
        or go straight to managed{' '}
        <a href="/hermes-agent-hosting" className="text-[#00e5cc] hover:underline">Hermes hosting</a>.
      </P>

      <FaqAccordion faqs={FAQ} />

      <Cta
        title="Run Hermes without the ops"
        body="Skip Python setup, Docker, and server maintenance. Deploy a Hermes agent on VibeOpenClaw in about 30 seconds — BYOK across 13 providers, from $24/mo."
      />

      <Sources
        items={[
          { label: 'Hermes Agent — official repository (178k+ stars, June 2026)', url: 'https://github.com/NousResearch/hermes-agent' },
          { label: 'Nous Research', url: 'https://nousresearch.com' },
          { label: 'Model Context Protocol (MCP)', url: 'https://modelcontextprotocol.io' },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'What Is Hermes Agent?', path: PATH }]),
          articleLd({ headline: TITLE, description: DESCRIPTION, path: PATH, datePublished: PUBLISHED }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
