import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.vibeopenclaw.com";

export const metadata: Metadata = {
  title: "Blog — VibeOpenClaw",
  description:
    "Tutorials, comparisons, and explainers for deploying open-source AI agents — OpenClaw, Hermes Agent, BYOK model hosting, and managed agent infrastructure.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

const POSTS: { slug: string; title: string; description: string; tag: string }[] = [
  {
    slug: "best-openclaw-hosting-providers-2026",
    title: "Best OpenClaw hosting providers in 2026 (managed & VPS)",
    description:
      "Managed and VPS OpenClaw hosts compared — VibeOpenClaw, xCloud, MyClaw, OneClaw, and DIY VPS — on price, isolation, BYOK, and which agents each one runs.",
    tag: "Comparison",
  },
  {
    slug: "best-managed-openclaw-hosting",
    title: "Best managed OpenClaw hosting in 2026",
    description:
      "The fully-managed OpenClaw hosts compared, and what 'managed' should actually include: provisioning, deploy, SSL, updates, backups, isolation, and support.",
    tag: "Comparison",
  },
  {
    slug: "managed-vs-self-hosting-openclaw",
    title: "Managed vs self-hosting OpenClaw in 2026: cost & security",
    description:
      "A practical cost, security, and effort comparison — when a $24/mo managed host beats a DIY VPS for OpenClaw, and when self-hosting still makes sense.",
    tag: "Guide",
  },
  {
    slug: "how-to-deploy-openclaw",
    title: "How to deploy OpenClaw (DIY Docker vs one-click)",
    description:
      "Two ways to get an OpenClaw agent running: a hand-rolled Docker setup on a VPS, or a one-click managed deploy on VibeOpenClaw. Step-by-step.",
    tag: "Tutorial",
  },
  {
    slug: "openclaw-hosting-cost",
    title: "How much does OpenClaw hosting cost in 2026?",
    description:
      "The honest breakdown of OpenClaw hosting cost — managed plans vs DIY VPS, plus the BYOK model-API budget most guides forget to mention.",
    tag: "Explainer",
  },
  {
    slug: "openclaw-security",
    title: "OpenClaw security: is it safe to run? (2026)",
    description:
      "OpenClaw's risk surface explained, plus how per-agent Docker isolation and AES-256-GCM key encryption reduce it — and a self-hosting security checklist.",
    tag: "Guide",
  },
  {
    slug: "how-to-deploy-hermes-agent",
    title: "How to deploy a Hermes Agent (the easy way and the hard way)",
    description:
      "Two paths to get Nous Research's Hermes Agent running: a hand-rolled Docker setup on a VPS, or a one-click managed deploy on VibeOpenClaw. Step-by-step.",
    tag: "Tutorial",
  },
  {
    slug: "byok-ai-agent-platform",
    title: "BYOK AI agent platforms: what 'bring your own key' actually buys you",
    description:
      "Why BYOK is the right default for hosting AI agents, how it changes pricing and lock-in, and which providers (OpenAI, Anthropic, Google, and 10 more) are first-class on VibeOpenClaw.",
    tag: "Explainer",
  },
  {
    slug: "openclaw-hosting-alternatives",
    title: "OpenClaw hosting alternatives: DIY VPS vs MyClaw vs VibeOpenClaw",
    description:
      "Where to run OpenClaw in 2026 — comparing the rent-a-VPS approach (Hetzner, Contabo), MyClaw, and VibeOpenClaw. Cost, time-to-deploy, and operational overhead side-by-side.",
    tag: "Comparison",
  },
];

export default function BlogIndex() {
  return (
    <>
      <header className="mb-10">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
          style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
        >
          Blog
        </h1>
        <p className="text-lg text-[#8892b0] leading-relaxed">
          Tutorials, comparisons, and explainers for deploying OpenClaw and Hermes AI agents.
        </p>
      </header>

      <ul className="space-y-4">
        {POSTS.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="block rounded-2xl border border-[rgba(136,146,176,0.15)] bg-[rgba(10,15,26,0.4)] p-6 hover:border-[rgba(136,146,176,0.3)] hover:bg-[rgba(10,15,26,0.6)] transition-all"
            >
              <span className="inline-block text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-[rgba(0,229,204,0.15)] text-[#00e5cc] border border-[rgba(0,229,204,0.2)] mb-3">
                {p.tag}
              </span>
              <h2
                className="text-xl md:text-2xl font-bold text-[#f0f4ff] mb-2 leading-snug"
                style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
              >
                {p.title}
              </h2>
              <p className="text-sm text-[#8892b0] leading-relaxed">{p.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
