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
- Machine-readable pricing: https://app.vibeopenclaw.com/pricing.md

## Hosting

- Managed OpenClaw Hosting — one-click deploy from $24/mo: https://app.vibeopenclaw.com/openclaw-hosting
- Managed Hermes Agent Hosting — on Premium at $48/mo: https://app.vibeopenclaw.com/hermes-agent-hosting
- Managed AI Agent Hosting (both agents): https://app.vibeopenclaw.com/managed-ai-agent-hosting
- OpenClaw integrations (n8n, Zapier, Notion, GitHub, Slack, and more): https://app.vibeopenclaw.com/openclaw-hosting/integrations
- OpenClaw hosting alternatives: https://app.vibeopenclaw.com/openclaw-hosting/alternatives

## For your team

- OpenClaw for agencies: https://app.vibeopenclaw.com/openclaw-hosting/for/agencies
- OpenClaw for ecommerce: https://app.vibeopenclaw.com/openclaw-hosting/for/ecommerce
- OpenClaw for project managers: https://app.vibeopenclaw.com/openclaw-hosting/for/project-managers
- OpenClaw for founders and small business owners: https://app.vibeopenclaw.com/openclaw-hosting/for/founders

## Use cases

- Personal assistant: https://app.vibeopenclaw.com/openclaw-hosting/use-cases/personal-assistant
- Customer support: https://app.vibeopenclaw.com/openclaw-hosting/use-cases/customer-support
- Coding assistant: https://app.vibeopenclaw.com/openclaw-hosting/use-cases/coding-assistant
- Research and summaries: https://app.vibeopenclaw.com/openclaw-hosting/use-cases/research
- Scheduling and reminders: https://app.vibeopenclaw.com/openclaw-hosting/use-cases/scheduling-reminders
- Team Slack bot: https://app.vibeopenclaw.com/openclaw-hosting/use-cases/team-slack-bot
- Workflow automation: https://app.vibeopenclaw.com/openclaw-hosting/use-cases/automation

## What they are

- What is OpenClaw (Clawdbot)?: https://app.vibeopenclaw.com/what-is-openclaw
- What is Hermes Agent?: https://app.vibeopenclaw.com/what-is-hermes
- Docs (deploy, channels, models, billing): https://app.vibeopenclaw.com/docs
- Troubleshooting (agent not responding, Telegram/Discord issues, invalid API key, crash loops): https://app.vibeopenclaw.com/docs/troubleshooting

## Comparisons

- All comparisons: https://app.vibeopenclaw.com/compare
- OpenClaw vs Hermes Agent — side-by-side comparison: https://app.vibeopenclaw.com/compare/openclaw-vs-hermes
- OpenClaw vs Meta Muse, Gemini Spark & Grok Bot: https://app.vibeopenclaw.com/compare/openclaw-vs-big-tech-ai-agents
- OpenClaw vs Meta Muse: https://app.vibeopenclaw.com/compare/openclaw-vs-meta-muse
- OpenClaw vs Gemini Spark: https://app.vibeopenclaw.com/compare/openclaw-vs-gemini-spark
- OpenClaw vs Grok Bot: https://app.vibeopenclaw.com/compare/openclaw-vs-grok-bot
- VibeOpenClaw vs xCloud: https://app.vibeopenclaw.com/compare/vibeopenclaw-vs-xcloud
- VibeOpenClaw vs MyClaw: https://app.vibeopenclaw.com/compare/vibeopenclaw-vs-myclaw

## Glossary

- AI agent hosting glossary (BYOK, MCP, Docker isolation, agent skills, model providers, and more): https://app.vibeopenclaw.com/glossary

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

## Trust

- Security: https://app.vibeopenclaw.com/security
- Privacy Policy: https://app.vibeopenclaw.com/privacy
- Terms of Service: https://app.vibeopenclaw.com/terms

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
