import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.vibeopenclaw.com";
const URL = `${SITE_URL}/blog/byok-ai-agent-platform`;
const PUBLISHED = "2026-05-23";

export const metadata: Metadata = {
  title: "BYOK AI agent platforms: what 'bring your own key' actually buys you",
  description:
    "Why BYOK is the right default for hosting AI agents. How it changes pricing, vendor lock-in, and model choice — and which of the 13 providers VibeOpenClaw supports first-class.",
  keywords: [
    "byok ai agent platform",
    "bring your own key ai agent",
    "ai agent api key",
    "byok ai agent",
    "ai agent platform openai key",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "article",
    url: URL,
    title: "BYOK AI agent platforms: what 'bring your own key' actually buys you",
    description:
      "BYOK changes the economics of agent hosting. Here's why it matters, how it works on VibeOpenClaw, and the 13 providers we support.",
  },
};

const PROVIDERS = [
  "OpenAI", "Anthropic", "Google", "Groq", "xAI", "Mistral",
  "DeepSeek", "Together", "Fireworks", "Perplexity", "OpenRouter", "Cohere", "NVIDIA",
];

export default function Page() {
  return (
    <>
      <article>
        <header className="mb-10">
          <p className="text-xs uppercase tracking-wider text-[#00e5cc] font-bold mb-3">Explainer · {new Date(PUBLISHED).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          <h1
            className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
            style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
          >
            BYOK AI agent platforms: what &quot;bring your own key&quot; actually buys you
          </h1>
          <p className="text-lg text-[#8892b0] leading-relaxed">
            Most managed AI-agent platforms quietly mark up the inference. <strong className="text-[#f0f4ff]">BYOK</strong> — bring your own key — flips that: you keep direct billing with OpenAI, Anthropic, Google, or whoever else, and the agent host charges you for the agent infrastructure, nothing more. It changes the unit economics, the vendor lock-in story, and the model menu. Here&apos;s what to look for.
          </p>
        </header>

        <section className="prose prose-invert max-w-none text-[#c8d0e0] leading-relaxed space-y-4">
          <h2 className="text-2xl font-bold text-[#f0f4ff] mt-10 mb-4" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            What BYOK means in practice
          </h2>
          <p>
            With a non-BYOK platform, you pay the host one bundled price that includes their margin on the underlying model calls. The host buys inference wholesale from OpenAI/Anthropic/etc. and resells it. That&apos;s convenient on day one — one invoice — and expensive as you scale, because the host has to make money on each token.
          </p>
          <p>
            With BYOK, you give the agent platform your own API key. The platform calls the model with <em>your</em> key, the bill lands in <em>your</em> provider account, and you pay the platform only for the agent runtime — RAM, container, channel integrations, monitoring. The platform never sees marked-up inference revenue, so the agent infrastructure is priced honestly.
          </p>

          <h2 className="text-2xl font-bold text-[#f0f4ff] mt-10 mb-4" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            Why this matters for agents specifically
          </h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong className="text-[#f0f4ff]">Cost control.</strong> Agents are token-heavy. A chatty Telegram bot can chew through a few dollars of inference a day. With BYOK you see those costs directly on your provider dashboard and tune them — switch to a cheaper model, cap context, set provider-side rate limits.</li>
            <li><strong className="text-[#f0f4ff]">Model choice.</strong> A BYOK platform supports whichever providers it integrates with. A non-BYOK platform supports whichever providers they&apos;ve negotiated wholesale with. The first list is usually longer.</li>
            <li><strong className="text-[#f0f4ff]">No lock-in.</strong> If you outgrow the platform, your API keys, prompts, and usage history all live with the provider — not the host. Migration is a config change, not a data export.</li>
            <li><strong className="text-[#f0f4ff]">Compliance.</strong> Some teams need every model request to flow through <em>their</em> contractual relationship with the provider (DPA, BAA, EU residency). BYOK preserves that; bundled inference breaks it.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#f0f4ff] mt-10 mb-4" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            What VibeOpenClaw supports
          </h2>
          <p>
            VibeOpenClaw is BYOK across <strong className="text-[#f0f4ff]">13 LLM providers</strong>:
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 list-none pl-0 my-4">
            {PROVIDERS.map((p) => (
              <li key={p} className="text-sm py-2 px-3 rounded-lg border border-[rgba(136,146,176,0.15)] bg-[rgba(10,15,26,0.4)] text-center text-[#f0f4ff]">{p}</li>
            ))}
          </ul>
          <p>
            You add a key once on the <em>API Keys</em> page; each agent (OpenClaw or Hermes) can pick which provider and model it uses. There&apos;s a built-in &quot;Test&quot; button that fires a 4-token probe so you know the key works before you wire an agent to it.
          </p>

          <h2 className="text-2xl font-bold text-[#f0f4ff] mt-10 mb-4" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            How keys are stored
          </h2>
          <p>
            Provider keys are encrypted at rest with <strong className="text-[#f0f4ff]">AES-256-GCM</strong> in the Postgres database. They&apos;re only decrypted in-process when an agent needs to make a model call — they never leave the server in plaintext, never end up in logs, and aren&apos;t exposed over any management UI after creation (the UI only shows the trailing characters as a hint).
          </p>
          <p>
            The agent containers are Docker-isolated, so even a misbehaving plugin in one agent can&apos;t reach into another agent&apos;s memory or keys. Combined with BYOK, the worst-case blast radius of a compromise is the one agent — not the rest of your fleet, and not any other tenant.
          </p>

          <h2 className="text-2xl font-bold text-[#f0f4ff] mt-10 mb-4" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            When BYOK is wrong
          </h2>
          <p>
            BYOK isn&apos;t free of friction. You manage the relationship with each provider (sign-up, billing, rate limits) instead of just paying one host. For very small workloads that&apos;s overhead you might not want — non-BYOK is genuinely easier if you&apos;re testing one bot for a weekend. The minute you care about cost, model choice, or compliance, the calculus flips.
          </p>
          <p>
            If you&apos;re still deciding between OpenClaw and Hermes, see the <Link href="/compare/openclaw-vs-hermes" className="text-[#00e5cc] hover:underline">framework comparison</Link>. If you want a concrete walk-through of deploying one, the <Link href="/blog/how-to-deploy-hermes-agent" className="text-[#00e5cc] hover:underline">Hermes deployment guide</Link> covers both the DIY-Docker and one-click managed paths.
          </p>

          <h2 className="text-2xl font-bold text-[#f0f4ff] mt-10 mb-4" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            Sources
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-[#8892b0]">
            <li><a href="https://csrc.nist.gov/pubs/sp/800/38/d/final" target="_blank" rel="noopener noreferrer" className="text-[#00e5cc] hover:underline">NIST SP 800-38D</a> — the AES-GCM (Galois/Counter Mode) specification used to encrypt stored keys.</li>
            <li><a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener noreferrer" className="text-[#00e5cc] hover:underline">OpenClaw</a> and <a href="https://github.com/NousResearch/hermes-agent" target="_blank" rel="noopener noreferrer" className="text-[#00e5cc] hover:underline">Hermes Agent</a> — the open-source agents VibeOpenClaw hosts.</li>
            <li>Provider API key docs: <a href="https://platform.openai.com/docs/api-reference" target="_blank" rel="noopener noreferrer" className="text-[#00e5cc] hover:underline">OpenAI</a>, <a href="https://docs.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-[#00e5cc] hover:underline">Anthropic</a>, <a href="https://openrouter.ai/docs" target="_blank" rel="noopener noreferrer" className="text-[#00e5cc] hover:underline">OpenRouter</a> — among the 13 supported providers.</li>
          </ul>
        </section>
      </article>

      <div className="mt-12 p-6 rounded-2xl border border-[rgba(136,146,176,0.15)] bg-[rgba(10,15,26,0.4)] text-center">
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Run agents with your own keys</h3>
        <p className="text-sm text-[#8892b0] mb-4">13 providers, AES-256-GCM key storage, Docker isolation. You pay your provider directly; we never mark up inference.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-semibold transition-all hover:-translate-y-0.5"
          style={{
            fontFamily: '"Clash Display", system-ui, sans-serif',
            background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)',
          }}
        >
          Try VibeOpenClaw
        </Link>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "BYOK AI agent platforms: what 'bring your own key' actually buys you",
            description: metadata.description,
            datePublished: PUBLISHED,
            dateModified: PUBLISHED,
            author: { "@type": "Organization", name: "VibeOpenClaw", url: SITE_URL },
            publisher: { "@type": "Organization", name: "VibeOpenClaw", url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` } },
            mainEntityOfPage: { "@type": "WebPage", "@id": URL },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
              { "@type": "ListItem", position: 3, name: "BYOK AI agent platforms", item: URL },
            ],
          }),
        }}
      />
    </>
  );
}
