import type { Metadata } from 'next';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { Hero, FeatureGrid, FaqAccordion, Cta, H2, P, Sources, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, faqPageLd, articleLd, jsonLd, type Faq } from '@/components/marketing/schema';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/what-is-openclaw';
const PUBLISHED = '2026-06-03';

const TITLE = 'What Is OpenClaw? The Open-Source AI Assistant, Explained';
const DESCRIPTION =
  'OpenClaw (aka Clawdbot) is an open-source personal AI assistant platform in Node.js/TypeScript with 376k+ GitHub stars. What it is and how to run it.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['what is openclaw', 'openclaw explained', 'what is clawdbot', 'openclaw ai assistant', 'openclaw'],
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
    q: 'What is OpenClaw?',
    a: 'OpenClaw is an open-source personal AI assistant platform written in Node.js and TypeScript. Instead of being a single chatbot, it is a framework for building your own assistant that lives across your messaging apps, runs skills, and takes real actions on your behalf — "your own personal AI assistant, any OS, any platform." With 376k+ GitHub stars as of June 2026, it is one of the most popular open-source AI agent projects.',
  },
  {
    q: 'Is OpenClaw the same as Clawdbot?',
    a: 'Yes. Clawdbot is another name for the OpenClaw project — the two refer to the same open-source codebase and assistant platform. You may see either name in the community, documentation, or older guides, but they describe the same Node.js/TypeScript assistant.',
  },
  {
    q: 'Is OpenClaw free?',
    a: 'The OpenClaw software is free and open source — you can clone the repository at github.com/openclaw/openclaw and run it yourself at no license cost. You still pay for the infrastructure it runs on and for the AI model usage (your provider API keys). A managed host like VibeOpenClaw charges a flat monthly fee to run it for you, while you bring your own model keys and pay providers directly for inference.',
  },
  {
    q: 'How is OpenClaw different from a chatbot like ChatGPT?',
    a: 'A chatbot answers questions in a single app. OpenClaw is an agent: it connects to 20+ messaging channels, runs installable skills, remembers context, and takes actions — sending messages, calling APIs, automating tasks — rather than only replying. You also choose the underlying model, so it is not tied to one vendor.',
  },
  {
    q: 'What is ClawHub?',
    a: 'ClawHub (clawhub.com) is the OpenClaw skills marketplace. Skills are installable add-ons that extend what your assistant can do — integrations, automations, and tools. You browse ClawHub, install a skill, and your OpenClaw agent gains that capability without writing it from scratch.',
  },
  {
    q: 'How do I run OpenClaw?',
    a: 'You have two paths. Self-host: clone the repo, install Node.js, configure Docker, add your model keys and channel tokens, and keep a server online 24/7. Or use a managed host: on VibeOpenClaw you pick OpenClaw, add a provider key and a Telegram/Discord/Slack token, and your agent is live in a Docker-isolated container in about 30 seconds — no Docker or SSH required. See our OpenClaw hosting page for the full walkthrough.',
  },
];

const FEATURES = [
  { title: 'Takes actions, not just replies', body: 'OpenClaw runs skills and calls tools, so it can automate tasks and act on your behalf — not just answer questions like a plain chatbot.' },
  { title: '20+ messaging channels', body: 'As a framework, OpenClaw can connect to 20+ channels, letting your assistant live where you already chat instead of in a separate app.' },
  { title: 'ClawHub skills marketplace', body: 'Install capabilities from ClawHub (clawhub.com) — integrations and automations that extend your assistant without building them yourself.' },
  { title: 'Bring your own model', body: 'OpenClaw is model-agnostic. Point it at the AI provider you prefer and pay that provider directly, with no lock-in to a single vendor.' },
  { title: 'Open source (Node.js / TypeScript)', body: 'The full codebase is public at github.com/openclaw/openclaw — 376k+ stars as of June 2026 — so you can read, audit, and extend it.' },
  { title: 'Self-host or managed', body: 'Run it yourself on your own box, or let a managed host like VibeOpenClaw handle Docker, SSL, updates, and uptime for a flat monthly fee.' },
];

export default function WhatIsOpenClawPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'What Is OpenClaw?' }]} />

      <Hero
        eyebrow="OpenClaw, explained"
        title="What is OpenClaw?"
        subtitle={
          <>
            OpenClaw — also known as <strong className="text-[#f0f4ff]">Clawdbot</strong> — is an open-source personal AI
            assistant platform built in Node.js and TypeScript. It is &ldquo;your own personal AI assistant, any OS, any
            platform,&rdquo; with <strong className="text-[#f0f4ff]">376k+ GitHub stars</strong> as of June 2026.
          </>
        }
      />

      <P>
        <strong className="text-[#f0f4ff]">In one sentence: OpenClaw is an open-source framework for running your own
        personal AI assistant</strong> — one that lives in your messaging apps, runs installable skills, and takes real
        actions instead of just chatting. It is sometimes called Clawdbot, and it is one of the most-starred open-source
        AI agent projects on GitHub (376k+ stars, June 2026). Where a chatbot answers a question, an OpenClaw agent can
        act on it: send a message, call an API, run an automation, or kick off a workflow.
      </P>

      <H2 id="what-it-is">What OpenClaw actually is</H2>
      <P>
        OpenClaw is not a single product you download and chat with — it is a platform for building and running your own
        assistant. The project (hosted at{' '}
        <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener noreferrer" className="text-[#00e5cc] hover:underline">
          github.com/openclaw/openclaw
        </a>
        ) gives you the agent runtime, the skill system, and the channel integrations; you supply the AI model and the
        accounts you want it connected to. Because it is written in Node.js and TypeScript, it runs anywhere Node runs —
        any OS, any platform — which is exactly how the project describes itself.
      </P>
      <P>
        The &ldquo;personal&rdquo; part matters. OpenClaw is designed to be <em>your</em> assistant: it keeps context,
        learns your preferences through configuration and skills, and is reachable from the apps you already use. Rather
        than logging into yet another website, you message your agent the same way you message a friend.
      </P>

      <H2 id="vs-chatbot">How it differs from a chatbot</H2>
      <P>
        The clearest way to understand OpenClaw is to contrast it with a chatbot. A chatbot like a generic web assistant
        is a conversation in a box: you type, it replies, and nothing happens in the outside world. OpenClaw is an{' '}
        <strong className="text-[#f0f4ff]">agent</strong> — it can run skills, call tools and APIs, and perform actions.
        Ask it to do something, and it can actually do it rather than just describe how.
      </P>
      <P>
        That difference shows up in three places. First, <strong className="text-[#f0f4ff]">actions</strong>: OpenClaw
        executes skills, so it can automate real tasks. Second, <strong className="text-[#f0f4ff]">presence</strong>: it
        lives in your messaging channels rather than a single web tab. Third,{' '}
        <strong className="text-[#f0f4ff]">choice</strong>: it is model-agnostic, so you pick the AI provider that powers
        it instead of being locked to whatever a vendor ships.
      </P>

      <H2 id="channels">Messaging channels: 20+ ways to reach it</H2>
      <P>
        As a framework, OpenClaw can connect to <strong className="text-[#f0f4ff]">20+ messaging channels</strong>. That
        is the whole point of a personal assistant — it should be wherever you already are. Instead of opening a
        dedicated app, you talk to your agent in the chat tools you use every day, and it talks back through the same
        channel.
      </P>
      <P>
        Note that the 20+ figure describes the open-source OpenClaw framework itself. When you run OpenClaw on a managed
        platform, the available channels depend on that platform. On VibeOpenClaw, for example, OpenClaw agents connect
        to <strong className="text-[#f0f4ff]">Telegram, Discord, and Slack</strong> today.
      </P>

      <H2 id="clawhub">ClawHub: the skills marketplace</H2>
      <P>
        Skills are what turn OpenClaw from a clever chat interface into a capable assistant. A skill is an installable
        add-on — an integration, an automation, or a tool — that extends what your agent can do.{' '}
        <a href="https://clawhub.com" target="_blank" rel="noopener noreferrer" className="text-[#00e5cc] hover:underline">
          ClawHub (clawhub.com)
        </a>{' '}
        is the marketplace where these skills live. You browse it, install the ones you want, and your assistant
        immediately gains those capabilities without you writing any code.
      </P>

      <H2 id="run">How to run OpenClaw</H2>
      <P>
        There are two ways to get an OpenClaw assistant running. <strong className="text-[#f0f4ff]">Self-hosting</strong>{' '}
        is free in license: clone the repo, install Node.js, set up Docker, add your model keys and channel tokens, and
        keep a server online around the clock. It gives you full control but costs you time in setup, SSL, updates,
        backups, and uptime.
      </P>
      <P>
        <strong className="text-[#f0f4ff]">Managed hosting</strong> trades a small monthly fee for all of that. On{' '}
        <a href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">VibeOpenClaw</a> you pick OpenClaw, add a
        provider API key, paste a Telegram/Discord/Slack token, and click Create — your agent boots in a Docker-isolated
        container in about 30 seconds. You bring your own keys across 13 model providers and pay them directly, with no
        inference markup, and keys are encrypted at rest with AES-256-GCM.
      </P>

      <H2 id="features">OpenClaw at a glance</H2>
      <FeatureGrid features={FEATURES} />

      <P>
        Weighing OpenClaw against the other major open-source assistant? See{' '}
        <a href="/compare/openclaw-vs-hermes" className="text-[#00e5cc] hover:underline">OpenClaw vs Hermes Agent</a>. For
        a step-by-step setup, read{' '}
        <a href="/blog/how-to-deploy-openclaw" className="text-[#00e5cc] hover:underline">how to deploy OpenClaw</a>, or
        jump straight to managed{' '}
        <a href="/openclaw-hosting" className="text-[#00e5cc] hover:underline">OpenClaw hosting</a>.
      </P>

      <FaqAccordion faqs={FAQ} />

      <Cta
        title="Run OpenClaw without the ops"
        body="Skip Docker, SSH, and server maintenance. Deploy an OpenClaw agent on VibeOpenClaw in about 30 seconds — BYOK across 13 providers, from $24/mo."
      />

      <Sources
        items={[
          { label: 'OpenClaw — official repository (376k+ stars, June 2026)', url: 'https://github.com/openclaw/openclaw' },
          { label: 'ClawHub — OpenClaw skills marketplace', url: 'https://clawhub.com' },
          { label: 'Model Context Protocol (MCP)', url: 'https://modelcontextprotocol.io' },
        ]}
      />

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'What Is OpenClaw?', path: PATH }]),
          articleLd({ headline: TITLE, description: DESCRIPTION, path: PATH, datePublished: PUBLISHED }),
          faqPageLd(FAQ),
        )}
      />
    </MarketingShell>
  );
}
