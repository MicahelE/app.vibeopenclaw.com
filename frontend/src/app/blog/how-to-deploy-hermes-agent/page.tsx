import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.vibeopenclaw.com";
const URL = `${SITE_URL}/blog/how-to-deploy-hermes-agent`;
const PUBLISHED = "2026-05-23";

export const metadata: Metadata = {
  title: "How to deploy a Hermes Agent in Docker (and the one-click alternative)",
  description:
    "Step-by-step guide for deploying Nous Research's Hermes Agent — DIY with Docker on a VPS, or in one click on VibeOpenClaw. Includes config, env vars, channel setup, and troubleshooting.",
  keywords: [
    "deploy hermes agent",
    "deploy hermes agent docker",
    "hermes agent docker setup",
    "hermes agent telegram setup",
    "how to deploy hermes agent",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "article",
    url: URL,
    title: "How to deploy a Hermes Agent in Docker",
    description:
      "DIY with Docker on a VPS vs one-click on VibeOpenClaw — both paths to get Hermes Agent running, with config and troubleshooting.",
  },
};

export default function Page() {
  return (
    <>
      <article>
        <header className="mb-10">
          <p className="text-xs uppercase tracking-wider text-[#00e5cc] font-bold mb-3">Tutorial · {new Date(PUBLISHED).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          <h1
            className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
            style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
          >
            How to deploy a Hermes Agent in Docker (and the one-click alternative)
          </h1>
          <p className="text-lg text-[#8892b0] leading-relaxed">
            <strong className="text-[#f0f4ff]">Hermes Agent</strong> is Nous Research&apos;s open-source, self-improving AI agent — it learns new skills from each session and runs as a messaging gateway across Telegram, Discord, and Slack. There are two reasonable ways to get it running: hand-rolled Docker on a VPS, or a managed deploy on VibeOpenClaw. This guide walks both.
          </p>
        </header>

        <section className="prose prose-invert max-w-none text-[#c8d0e0] leading-relaxed space-y-4">
          <h2 className="text-2xl font-bold text-[#f0f4ff] mt-10 mb-4" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            Path 1 — DIY: build the image and run with Docker
          </h2>
          <p>
            Hermes Agent doesn&apos;t have a published Docker image, so you build from source. You&apos;ll need a Linux host with Docker installed and at least 4&nbsp;GB of RAM (the image bundles the Python ML stack and a Playwright Chromium for tool use; total ~6–8&nbsp;GB on disk).
          </p>
          <pre className="rounded-xl bg-[#0a0f1a] border border-[rgba(136,146,176,0.15)] p-4 text-xs overflow-x-auto"><code>{`# 1. Build the image (this takes ~10 minutes on a 4-core box)
docker build -t hermes-agent:latest https://github.com/NousResearch/hermes-agent.git#main

# 2. Create a host directory for agent state and config
mkdir -p /opt/hermes/data
chown 1001:1001 /opt/hermes/data`}</code></pre>
          <p>
            Hermes uses a YAML config file for model and provider selection. Drop a <code>config.yaml</code> into the agent directory:
          </p>
          <pre className="rounded-xl bg-[#0a0f1a] border border-[rgba(136,146,176,0.15)] p-4 text-xs overflow-x-auto"><code>{`# /opt/hermes/data/config.yaml
model:
  default: claude-sonnet-4-6
  provider: anthropic
  api_key: \${ANTHROPIC_API_KEY}

channels:
  telegram:
    enabled: true
    token: \${TELEGRAM_BOT_TOKEN}`}</code></pre>
          <pre className="rounded-xl bg-[#0a0f1a] border border-[rgba(136,146,176,0.15)] p-4 text-xs overflow-x-auto"><code>{`# 3. Run the container
docker run -d \\
  --name hermes \\
  --restart unless-stopped \\
  -e ANTHROPIC_API_KEY=sk-ant-... \\
  -e TELEGRAM_BOT_TOKEN=123456:ABC-... \\
  -v /opt/hermes/data:/home/hermes/.hermes \\
  hermes-agent:latest gateway run`}</code></pre>
          <p>
            <code>gateway run</code> starts the messaging gateway only — Hermes intentionally exposes no public HTTP endpoint (the dashboard would surface key management, which is unsafe for a multi-tenant host). All traffic flows through the configured messaging channels.
          </p>
          <p>
            A few things that will trip you up:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-[#f0f4ff]">UID mismatch.</strong> Hermes runs as UID 1001 inside the container; your host bind-mount needs to be writable by that UID. <code>chown 1001:1001 /opt/hermes/data</code> fixes it.</li>
            <li><strong className="text-[#f0f4ff]">The <code>hermes -z</code> one-shot CLI is broken upstream</strong> for the <code>custom</code> and <code>openrouter</code> provider paths — it saves your message but never produces an assistant response (<code>KeyError: &apos;final_response&apos;</code>). Real messaging traffic via <code>gateway run</code> works fine; don&apos;t waste time debugging the CLI.</li>
            <li><strong className="text-[#f0f4ff]">Camoufox cache.</strong> The image ships with ~2&nbsp;GB of Playwright/Camoufox browser data. You can strip it with <code>rm -rf /tmp/camoufox-* /root/.cache/camoufox</code> in a downstream Dockerfile if disk is tight.</li>
          </ul>
          <p>
            You&apos;re also on the hook for HTTPS (Caddy or Nginx in front, if you need any inbound HTTP), restarts (systemd unit or Docker&apos;s <code>--restart</code>), log rotation, and provider-key encryption at rest — the YAML above stores them in plaintext.
          </p>

          <h2 className="text-2xl font-bold text-[#f0f4ff] mt-10 mb-4" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            Path 2 — Managed: one click on VibeOpenClaw
          </h2>
          <p>
            VibeOpenClaw runs Hermes in a managed Docker container with the gnarly bits already solved — UID setup, config seeding, key encryption (AES-256-GCM at rest), bind-mount permissions, log access, automatic restarts. You sign up, pick <strong className="text-[#f0f4ff]">Hermes</strong> as the agent type, paste your provider API key and channel bot tokens, and the container starts in ~30 seconds.
          </p>
          <p>
            Concretely, the flow is:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Sign up at <Link href="/" className="text-[#00e5cc] hover:underline">app.vibeopenclaw.com</Link> on the Premium plan (Hermes requires Premium — Pro is OpenClaw-only).</li>
            <li>Add your provider key on the API Keys page (OpenAI, Anthropic, Google, Groq, xAI, Mistral, DeepSeek, Together, Fireworks, Perplexity, OpenRouter, Cohere, and NVIDIA are all first-class).</li>
            <li>Click <em>New Agent</em> → choose Hermes → pick the model → paste your Telegram/Discord/Slack bot token → Create.</li>
          </ol>
          <p>
            That&apos;s it. You don&apos;t touch a YAML file, build an image, or chown anything. Resource quotas (4&nbsp;GB RAM per Hermes agent, up to 3 agents on Premium) are pre-tuned to Hermes&apos;s documented requirements.
          </p>

          <h2 className="text-2xl font-bold text-[#f0f4ff] mt-10 mb-4" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            Which one should you pick?
          </h2>
          <p>
            DIY if you&apos;re comfortable operating Docker, want full filesystem access for experimentation, and are running on a box you already have. Managed if you want Hermes running in 30 seconds with sane defaults, encrypted keys, and a single bill instead of <em>(VPS + DNS + SSL + monitoring + your time)</em>. The break-even for most people is one or two evenings of debugging.
          </p>
          <p>
            If you&apos;re still deciding between Hermes and OpenClaw entirely, see the <Link href="/compare/openclaw-vs-hermes" className="text-[#00e5cc] hover:underline">OpenClaw vs Hermes comparison</Link>.
          </p>
        </section>
      </article>

      <div className="mt-12 p-6 rounded-2xl border border-[rgba(136,146,176,0.15)] bg-[rgba(10,15,26,0.4)] text-center">
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Skip the YAML and the chown</h3>
        <p className="text-sm text-[#8892b0] mb-4">Deploy Hermes on VibeOpenClaw in 30 seconds with managed Docker, encrypted keys, and Telegram/Discord/Slack already wired up.</p>
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
            "@type": "TechArticle",
            headline: "How to deploy a Hermes Agent in Docker (and the one-click alternative)",
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
              { "@type": "ListItem", position: 3, name: "How to deploy a Hermes Agent", item: URL },
            ],
          }),
        }}
      />
    </>
  );
}
