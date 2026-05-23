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
