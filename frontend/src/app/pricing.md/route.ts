import { PLANS } from '@/content/pricing';

// Machine-readable pricing for AI agents/LLMs evaluating this product
// programmatically (see the ai-seo skill). Generated from content/pricing.ts
// so it can never drift from the displayed price.
function planBlock(plan: (typeof PLANS)['pro']): string {
  return `## ${plan.name}
- Price: $${plan.monthly}/month
- Agents: ${plan.agents} (${plan.tier === 'PREMIUM' ? 'OpenClaw or Hermes' : 'OpenClaw'})
- RAM: ${plan.ram} per agent
- Channels: ${plan.channels}
- Features: ${plan.features.join(', ')}
`;
}

const BODY = `# Pricing — VibeOpenClaw

Managed AI agent hosting (OpenClaw and Hermes), BYOK — bring your own model provider API key, no inference markup. Two flat monthly tiers, no usage-based billing on our side.

${Object.values(PLANS).map(planBlock).join('\n')}
## Notes
- BYOK: you pay your chosen model provider (OpenAI, Anthropic, Google, Groq, xAI, Mistral, DeepSeek, Together, Fireworks, Perplexity, OpenRouter, Cohere, or NVIDIA) directly for inference. VibeOpenClaw does not mark up or resell model usage.
- No free tier and no usage-based add-ons — the monthly price above is the full cost of hosting.
- Full plan details: https://app.vibeopenclaw.com/#pricing
`;

export const dynamic = 'force-static';

export function GET() {
  return new Response(BODY, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
