const BODY = `# VibeOpenClaw

> VibeOpenClaw is a managed SaaS platform for deploying and hosting AI agents powered by OpenClaw and Hermes. Agents run in Docker-isolated containers with BYOK (bring-your-own-keys) model support, messaging-channel integrations, and automatic HTTPS. Plans start at $60/month.

## What it is

- **One-click AI agent hosting.** Sign up, pick an agent type, choose a model provider, optionally add channel tokens, and deploy. Each agent runs in its own isolated Docker container with dedicated RAM.
- **BYOK (Bring Your Own Keys).** You add your own provider API keys; VibeOpenClaw never marks up or proxies API costs for billing. Keys are encrypted at rest with AES-256-GCM.
- **Two agent types:**
  - **OpenClaw** — open-source Node.js personal-assistant platform with 20+ messaging channels and a skills marketplace (clawhub.com). Exposes an HTTP endpoint with automatic SSL.
  - **Hermes** — open-source self-improving Python agent by Nous Research that learns skills from experience. Runs as a messaging gateway (no public HTTP endpoint).

## Supported model providers (13, via BYOK)

OpenAI, Anthropic, Google, Groq, xAI, Mistral, DeepSeek, Together, Fireworks, Perplexity, OpenRouter, Cohere, NVIDIA.

## Messaging channels

Telegram, Discord, and Slack bot integrations.

## Pricing

- **Pro — $60/month:** 1 OpenClaw agent, 2 GB RAM, BYOK, Telegram & Discord, email support.
- **Premium — $100/month:** 3 OpenClaw or Hermes agents, 4 GB RAM each, BYOK, all channels including Slack, priority support, usage analytics.

## Comparisons

- OpenClaw vs Hermes Agent — side-by-side comparison: https://app.vibeopenclaw.com/compare/openclaw-vs-hermes

## Guides & explainers

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
