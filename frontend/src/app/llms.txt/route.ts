const BODY = `# VibeOpenClaw

> VibeOpenClaw is a managed SaaS platform for deploying and hosting AI agents powered by OpenClaw and Hermes. Agents run in Docker-isolated containers with BYOK (bring-your-own-keys) model support, messaging-channel integrations, and automatic HTTPS. Plans start at $24/month.

## What it is

- **One-click AI agent hosting.** Sign up, pick an agent type, choose a model provider, optionally add channel tokens, and deploy. Each agent runs in its own isolated Docker container with dedicated RAM.
- **BYOK (Bring Your Own Keys).** You add your own provider API keys; VibeOpenClaw never marks up or proxies API costs for billing. Keys are encrypted at rest with AES-256-GCM.
- **Two agent types:**
  - **OpenClaw** — open-source Node.js personal-assistant platform (376k+ GitHub stars as of June 2026, github.com/openclaw/openclaw) with 20+ messaging channels and a skills marketplace (clawhub.com). Exposes an HTTP endpoint with automatic SSL.
  - **Hermes** — open-source self-improving Python agent by Nous Research (178k+ GitHub stars as of June 2026, github.com/NousResearch/hermes-agent) that learns skills from experience. Runs as a messaging gateway (no public HTTP endpoint).

## Supported model providers (13, via BYOK)

OpenAI, Anthropic, Google, Groq, xAI, Mistral, DeepSeek, Together, Fireworks, Perplexity, OpenRouter, Cohere, NVIDIA.

## Messaging channels

Telegram, Discord, and Slack bot integrations.

## Pricing

- **Pro — $24/month:** 1 OpenClaw agent, 2 GB RAM, BYOK, Telegram & Discord, email support.
- **Premium — $48/month:** 3 OpenClaw or Hermes agents, 4 GB RAM each, BYOK, all channels including Slack, priority support, usage analytics.

## Hosting

- Managed OpenClaw Hosting — one-click deploy from $24/mo: https://app.vibeopenclaw.com/openclaw-hosting
- Managed Hermes Agent Hosting — on Premium at $48/mo: https://app.vibeopenclaw.com/hermes-agent-hosting
- Managed AI Agent Hosting (both agents): https://app.vibeopenclaw.com/managed-ai-agent-hosting
- OpenClaw integrations (n8n, Zapier, Notion, GitHub, Slack, and more): https://app.vibeopenclaw.com/openclaw-hosting/integrations
- OpenClaw hosting alternatives: https://app.vibeopenclaw.com/openclaw-hosting/alternatives

## What they are

- What is OpenClaw (Clawdbot)?: https://app.vibeopenclaw.com/what-is-openclaw
- What is Hermes Agent?: https://app.vibeopenclaw.com/what-is-hermes
- Docs (deploy, channels, models, billing): https://app.vibeopenclaw.com/docs

## Comparisons

- OpenClaw vs Hermes Agent — side-by-side comparison: https://app.vibeopenclaw.com/compare/openclaw-vs-hermes
- VibeOpenClaw vs xCloud: https://app.vibeopenclaw.com/compare/vibeopenclaw-vs-xcloud
- VibeOpenClaw vs MyClaw: https://app.vibeopenclaw.com/compare/vibeopenclaw-vs-myclaw

## Guides & explainers

- Best OpenClaw hosting providers in 2026 (managed & VPS): https://app.vibeopenclaw.com/blog/best-openclaw-hosting-providers-2026
- Best managed OpenClaw hosting in 2026: https://app.vibeopenclaw.com/blog/best-managed-openclaw-hosting
- Managed vs self-hosting OpenClaw (cost & security): https://app.vibeopenclaw.com/blog/managed-vs-self-hosting-openclaw
- How to deploy OpenClaw (DIY Docker vs one-click): https://app.vibeopenclaw.com/blog/how-to-deploy-openclaw
- How much does OpenClaw hosting cost: https://app.vibeopenclaw.com/blog/openclaw-hosting-cost
- OpenClaw security — is it safe to run: https://app.vibeopenclaw.com/blog/openclaw-security
- How to deploy a Hermes Agent (Docker DIY vs managed): https://app.vibeopenclaw.com/blog/how-to-deploy-hermes-agent
- BYOK AI agent platforms — what bring-your-own-key actually buys you: https://app.vibeopenclaw.com/blog/byok-ai-agent-platform
- OpenClaw hosting alternatives — DIY VPS vs MyClaw vs VibeOpenClaw: https://app.vibeopenclaw.com/blog/openclaw-hosting-alternatives

## Links

- Website: https://app.vibeopenclaw.com
- OpenClaw (GitHub): https://github.com/openclaw/openclaw
- Hermes Agent (GitHub): https://github.com/NousResearch/hermes-agent
- Skills Marketplace: https://clawhub.com
`;

export const dynamic = 'force-static';

export function GET() {
  return new Response(BODY, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
