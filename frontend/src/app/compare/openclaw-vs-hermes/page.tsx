import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.vibeopenclaw.com";
const URL = `${SITE_URL}/compare/openclaw-vs-hermes`;

export const metadata: Metadata = {
  title: "OpenClaw vs Hermes Agent: Which Open-Source AI Agent Should You Deploy?",
  description:
    "OpenClaw vs Hermes Agent — side-by-side comparison of the two open-source AI agent frameworks. Languages, channels, learning, deployment, and which one fits your use case. Both deploy in one click on VibeOpenClaw.",
  keywords: [
    "openclaw vs hermes",
    "openclaw hermes comparison",
    "hermes vs openclaw",
    "ai agent framework comparison",
    "open source ai agent",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "article",
    url: URL,
    title: "OpenClaw vs Hermes Agent — Which AI Agent Should You Deploy?",
    description:
      "Side-by-side comparison of OpenClaw and Hermes Agent: languages, messaging channels, learning loops, deployment, and ideal use cases.",
  },
};

const ROWS: { label: string; openclaw: string; hermes: string }[] = [
  { label: "Language / runtime", openclaw: "Node.js (TypeScript)", hermes: "Python" },
  { label: "Maintainer", openclaw: "OpenClaw community (open source)", hermes: "Nous Research (open source)" },
  { label: "GitHub stars", openclaw: "376k+ ⭐", hermes: "178k+ ⭐" },
  { label: "Primary strength", openclaw: "Multi-channel personal assistant + skills marketplace", hermes: "Self-improving agent that learns skills from experience" },
  { label: "Learning loop", openclaw: "Plugin/skills via clawhub.com marketplace", hermes: "Built-in: creates and improves skills from each session" },
  { label: "Messaging channels", openclaw: "20+ (Telegram, Discord, Slack, WhatsApp, iMessage, …)", hermes: "Telegram, Discord, Slack via the messaging gateway" },
  { label: "Public HTTP endpoint", openclaw: "Yes — exposes an API with automatic SSL", hermes: "No — runs as a messaging gateway only (no public HTTP)" },
  { label: "MCP (Model Context Protocol)", openclaw: "Via plugins", hermes: "First-class support, plus cron scheduling" },
  { label: "License", openclaw: "Open source", hermes: "Open source" },
  { label: "Deploy time on VibeOpenClaw", openclaw: "~30 seconds (Docker container starts immediately)", hermes: "~30 seconds (Docker container starts immediately)" },
  { label: "Best for", openclaw: "Builders who want a polished assistant with rich messaging integrations", hermes: "Builders who want an agent that improves itself over time" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Can I migrate an existing OpenClaw setup to Hermes Agent?",
    a: "Yes. Hermes Agent has explicit migration support for OpenClaw configurations. On VibeOpenClaw you can deploy a Hermes agent alongside your OpenClaw agent, point it at the same provider keys, and migrate skill-by-skill when you're ready.",
  },
  {
    q: "Which one has better Telegram, Discord, and Slack support?",
    a: "Both integrate with Telegram, Discord, and Slack. OpenClaw covers a wider set of channels (20+, including WhatsApp and iMessage) via its channel framework. Hermes connects through its messaging gateway and is focused on the major three. Either is one-click on VibeOpenClaw.",
  },
  {
    q: "Do I need separate API keys for OpenClaw and Hermes?",
    a: "No. VibeOpenClaw stores your provider API keys (OpenAI, Anthropic, Google, Groq, xAI, Mistral, DeepSeek, Together, Fireworks, Perplexity, OpenRouter, Cohere, NVIDIA) once and lets each agent reference them. Keys are encrypted at rest with AES-256-GCM.",
  },
  {
    q: "Which agent should I start with on VibeOpenClaw?",
    a: "If you want a chat-style assistant that talks to your team across Telegram/Slack/Discord, start with OpenClaw. If you want an autonomous agent that learns new skills over time and runs background tasks via cron, start with Hermes. The Premium plan ($100/month) lets you run up to 3 of either type.",
  },
];

export default function ComparePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050810] text-[#f0f4ff]">
      <main className="relative z-10 max-w-[860px] mx-auto px-6 pt-16 pb-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-[#5a6480] mb-6">
          <Link href="/" className="hover:text-[#f0f4ff] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#8892b0]">Compare</span>
          <span className="mx-2">/</span>
          <span className="text-[#f0f4ff]">OpenClaw vs Hermes</span>
        </nav>

        {/* Hero */}
        <header className="mb-10">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
          >
            OpenClaw vs Hermes Agent
          </h1>
          <p className="text-lg text-[#8892b0] leading-relaxed">
            Two of the most capable open-source AI agent frameworks. <strong className="text-[#f0f4ff]">OpenClaw</strong> is a polished multi-channel assistant with a skills marketplace; <strong className="text-[#f0f4ff]">Hermes</strong> is a self-improving agent from Nous Research that learns new skills from experience. Both deploy in one click on VibeOpenClaw — pick the one that fits your use case, or run both side-by-side.
          </p>
        </header>

        {/* In their own words — attributed quotes + headline stats */}
        <section aria-label="Project overview" className="mb-12">
          <p className="text-sm text-[#8892b0] mb-5 leading-relaxed">
            Both are among the most-starred AI projects on GitHub. As of June 2026, <strong className="text-[#f0f4ff]">OpenClaw has 376,000+ stars</strong> and <strong className="text-[#f0f4ff]">Hermes Agent has 178,000+ stars</strong> (
            <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener noreferrer" className="text-[#ff4d4d] hover:underline">openclaw/openclaw</a>,{" "}
            <a href="https://github.com/NousResearch/hermes-agent" target="_blank" rel="noopener noreferrer" className="text-[#00e5cc] hover:underline">NousResearch/hermes-agent</a>). VibeOpenClaw deploys either in roughly 30 seconds with BYOK across 13 LLM providers.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <figure className="p-5 rounded-2xl border border-[rgba(255,77,77,0.25)] bg-[rgba(255,77,77,0.04)]">
              <blockquote className="text-[#f0f4ff] text-sm leading-relaxed">“Your own personal AI assistant. Any OS. Any platform. The lobster way.”</blockquote>
              <figcaption className="mt-2 text-xs text-[#8892b0]">— OpenClaw, official project description (TypeScript / Node.js)</figcaption>
            </figure>
            <figure className="p-5 rounded-2xl border border-[rgba(0,229,204,0.25)] bg-[rgba(0,229,204,0.04)]">
              <blockquote className="text-[#f0f4ff] text-sm leading-relaxed">“The agent that grows with you.”</blockquote>
              <figcaption className="mt-2 text-xs text-[#8892b0]">— Hermes Agent by Nous Research, official project description (Python)</figcaption>
            </figure>
          </div>
        </section>

        {/* Comparison table */}
        <section aria-labelledby="comparison-table" className="mb-12">
          <h2
            id="comparison-table"
            className="text-2xl md:text-3xl font-bold mb-6"
            style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
          >
            Side-by-side comparison
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-[rgba(136,146,176,0.15)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[rgba(10,15,26,0.6)]">
                  <th className="text-left p-4 font-semibold text-[#8892b0] w-1/3">Aspect</th>
                  <th className="text-left p-4 font-semibold text-[#ff4d4d]" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>OpenClaw</th>
                  <th className="text-left p-4 font-semibold text-[#00e5cc]" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Hermes Agent</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <tr key={r.label} className={i % 2 ? "bg-[rgba(10,15,26,0.3)]" : ""}>
                    <td className="p-4 font-medium text-[#f0f4ff] align-top">{r.label}</td>
                    <td className="p-4 text-[#c8d0e0] align-top">{r.openclaw}</td>
                    <td className="p-4 text-[#c8d0e0] align-top">{r.hermes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* When to choose */}
        <section className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-2xl border border-[rgba(255,77,77,0.25)] bg-[rgba(255,77,77,0.04)]">
            <h2 className="text-xl font-bold text-[#ff4d4d] mb-3" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
              Choose OpenClaw if…
            </h2>
            <ul className="space-y-2 text-sm text-[#c8d0e0]">
              <li>• You want a polished personal assistant for Telegram, Discord, Slack, WhatsApp, or iMessage.</li>
              <li>• You value the existing skills marketplace at clawhub.com.</li>
              <li>• You need an HTTP endpoint to integrate with your own backend.</li>
              <li>• You prefer Node.js / TypeScript tooling.</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl border border-[rgba(0,229,204,0.25)] bg-[rgba(0,229,204,0.04)]">
            <h2 className="text-xl font-bold text-[#00e5cc] mb-3" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
              Choose Hermes if…
            </h2>
            <ul className="space-y-2 text-sm text-[#c8d0e0]">
              <li>• You want an agent that learns and improves its skills over time.</li>
              <li>• You're already comfortable with Python / ML tooling.</li>
              <li>• You need first-class MCP support and cron-scheduled tasks.</li>
              <li>• You don't need a public HTTP endpoint — messaging gateway is enough.</li>
            </ul>
          </div>
        </section>

        {/* Deploy CTA */}
        <section className="mb-12">
          <div
            className="text-center py-10 px-8 rounded-2xl border border-[rgba(136,146,176,0.15)]"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 77, 77, 0.05) 0%, rgba(10, 15, 26, 0.8) 50%, rgba(0, 229, 204, 0.03) 100%)',
            }}
          >
            <h2
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
            >
              Deploy either on VibeOpenClaw
            </h2>
            <p className="text-[#8892b0] mb-6 max-w-md mx-auto">
              One-click deployment, BYOK across 13 LLM providers, Docker isolation, instant HTTPS. Run both side-by-side on the Premium plan.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-semibold transition-all hover:-translate-y-0.5"
                style={{
                  fontFamily: '"Clash Display", system-ui, sans-serif',
                  background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)',
                }}
              >
                Get started
              </Link>
              <Link
                href="/#pricing"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-[#f0f4ff] font-semibold border border-[rgba(136,146,176,0.25)] hover:border-[rgba(136,146,176,0.5)] transition-colors"
                style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
              >
                See pricing
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="compare-faq" className="mb-12">
          <h2
            id="compare-faq"
            className="text-2xl md:text-3xl font-bold mb-6"
            style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
          >
            Frequently asked
          </h2>
          <div className="space-y-3">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-[rgba(136,146,176,0.15)] bg-[rgba(10,15,26,0.4)] p-5 open:border-[rgba(136,146,176,0.3)]"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                  <span className="font-semibold text-[#f0f4ff]" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
                    {f.q}
                  </span>
                  <span className="text-[#8892b0] text-xl leading-none mt-0.5 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[#c8d0e0] text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Sources */}
        <section aria-labelledby="sources" className="mb-12">
          <h2
            id="sources"
            className="text-lg font-bold mb-4 text-[#8892b0]"
            style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
          >
            Sources & further reading
          </h2>
          <ul className="space-y-2 text-sm text-[#c8d0e0]">
            <li>• <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener noreferrer" className="text-[#ff4d4d] hover:underline">OpenClaw — official repository</a> (star count, language, channels)</li>
            <li>• <a href="https://github.com/NousResearch/hermes-agent" target="_blank" rel="noopener noreferrer" className="text-[#00e5cc] hover:underline">Hermes Agent — official repository</a> by Nous Research (learning loop, MCP support)</li>
            <li>• <a href="https://clawhub.com" target="_blank" rel="noopener noreferrer" className="text-[#f0f4ff] hover:underline">ClawHub</a> — OpenClaw skills marketplace</li>
            <li>• <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="text-[#f0f4ff] hover:underline">Model Context Protocol (MCP)</a> — the tool-integration standard both agents support</li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-[rgba(136,146,176,0.15)] text-xs text-[#5a6480]">
          <Link href="/" className="hover:text-[#f0f4ff] transition-colors">← Back to VibeOpenClaw</Link>
        </footer>
      </main>

      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/compare/openclaw-vs-hermes` },
              { "@type": "ListItem", position: 3, name: "OpenClaw vs Hermes", item: URL },
            ],
          }),
        }}
      />

      {/* JSON-LD: FAQPage (page-specific) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />
    </div>
  );
}
