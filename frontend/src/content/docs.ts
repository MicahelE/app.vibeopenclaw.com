// Docs content for /docs and /docs/[slug]. Real, useful product docs — keep
// accurate to the platform (Pro $24/Premium $48, both agents, Telegram/Discord/
// Slack, 13 BYOK providers, AES-256-GCM, ~30s deploy).

export interface DocSection {
  heading?: string;
  paras?: string[];
  steps?: string[];
  bullets?: string[];
}

export interface Doc {
  slug: string;
  title: string;
  description: string;
  category: 'Getting started' | 'Channels' | 'Models' | 'Account' | 'Help';
  sections: DocSection[];
}

export const DOCS: Doc[] = [
  {
    slug: 'getting-started',
    title: 'Deploy your first agent',
    description: 'Sign up and get an OpenClaw or Hermes agent running in about 30 seconds.',
    category: 'Getting started',
    sections: [
      { paras: ['VibeOpenClaw runs your AI agent in a managed, Docker-isolated container. You bring your own model key, pick an agent, connect a channel, and deploy — no servers, Docker, or SSH on your side.'] },
      { heading: 'Steps', steps: [
        'Sign up and choose a plan — Pro ($24/mo) for OpenClaw, or Premium ($48/mo) to also run Hermes.',
        'Add a model provider API key on the API Keys page (see "Add a model provider key").',
        'Click New Agent, choose OpenClaw or Hermes, and pick a model.',
        'Paste a channel bot token (Telegram, Discord, or Slack) and click Create.',
        'Your agent boots in ~30 seconds and starts answering on your channel.',
      ] },
    ],
  },
  {
    slug: 'add-api-keys',
    title: 'Add a model provider key',
    description: 'How to add and store your BYOK model provider API key securely.',
    category: 'Models',
    sections: [
      { paras: ['VibeOpenClaw is BYOK (bring your own keys): you add your own model provider key and pay that provider directly for inference. We never proxy or mark up usage.'] },
      { heading: 'Steps', steps: [
        'Create an API key in your provider’s dashboard (OpenAI, Anthropic, Google, and 10 more are supported).',
        'Open the API Keys page in your VibeOpenClaw dashboard.',
        'Select the provider, paste the key, and save.',
        'The key is encrypted at rest with AES-256-GCM and only decrypted in-process when an agent makes a model call.',
      ] },
      { heading: 'Notes', bullets: ['Keys are never shown in full again after saving — only a trailing hint.', 'You can add multiple providers and switch models per agent.'] },
    ],
  },
  {
    slug: 'choose-a-model-provider',
    title: 'Choose a model provider',
    description: 'Picking among the 13 supported BYOK providers for your agent.',
    category: 'Models',
    sections: [
      { paras: ['All 13 providers are first-class: OpenAI, Anthropic, Google, Groq, xAI, Mistral, DeepSeek, Together, Fireworks, Perplexity, OpenRouter, Cohere, and NVIDIA.'] },
      { heading: 'Quick guidance', bullets: [
        'Widest skill compatibility: OpenAI.',
        'Long context and careful tool use: Anthropic.',
        'Lowest cost for strong reasoning: DeepSeek.',
        'Fastest replies: Groq.',
        'Web-grounded answers: Perplexity.',
        'Experiment across many models with one key: OpenRouter.',
      ] },
      { paras: ['See the per-provider pages under OpenClaw hosting for details, e.g. /openclaw-hosting/anthropic.'] },
    ],
  },
  {
    slug: 'connect-telegram',
    title: 'Connect a Telegram bot',
    description: 'Create a BotFather token and connect your agent to Telegram.',
    category: 'Channels',
    sections: [
      { heading: 'Steps', steps: [
        'In Telegram, message @BotFather and send /newbot.',
        'Choose a name and username; BotFather returns an HTTP API token.',
        'When creating or editing an agent, paste that token in the Telegram field.',
        'Message your bot — it responds within a couple of seconds.',
      ] },
      { heading: 'Notes', bullets: ['Telegram is available on both Pro and Premium.', 'Group behaviour follows BotFather’s privacy settings, which you control.'] },
    ],
  },
  {
    slug: 'connect-discord',
    title: 'Connect a Discord bot',
    description: 'Create a Discord bot token and add your agent to a server.',
    category: 'Channels',
    sections: [
      { heading: 'Steps', steps: [
        'Open the Discord Developer Portal and create a New Application.',
        'Add a bot under the Bot tab and copy its token.',
        'Enable the Message Content intent if your bot needs to read messages.',
        'Paste the token into the agent’s Discord field, then invite the bot to your server with an OAuth2 URL.',
      ] },
      { heading: 'Notes', bullets: ['Discord is available on both Pro and Premium.'] },
    ],
  },
  {
    slug: 'connect-slack',
    title: 'Connect a Slack bot',
    description: 'Create a Slack app and connect your agent (Premium plan).',
    category: 'Channels',
    sections: [
      { paras: ['Slack is available on the Premium plan ($48/mo), alongside Telegram and Discord.'] },
      { heading: 'Steps', steps: [
        'Go to api.slack.com/apps and create an app.',
        'Add bot scopes under OAuth & Permissions and install the app to your workspace.',
        'Copy the Bot User OAuth Token (it starts with xoxb-).',
        'Paste it into the agent’s Slack field and add the bot to your channels.',
      ] },
    ],
  },
  {
    slug: 'openclaw-or-hermes',
    title: 'OpenClaw or Hermes: which to deploy',
    description: 'Choosing between the two agent types on VibeOpenClaw.',
    category: 'Getting started',
    sections: [
      { bullets: [
        'OpenClaw — a polished multi-channel personal assistant with a skills marketplace (ClawHub). Available on Pro and Premium.',
        'Hermes — Nous Research’s self-improving agent with a learning loop, MCP, and cron. Available on Premium.',
      ] },
      { paras: ['You can run both side-by-side on Premium. For a full breakdown, see the OpenClaw vs Hermes comparison.'] },
    ],
  },
  {
    slug: 'manage-agents',
    title: 'Manage your agents',
    description: 'Start, stop, and monitor agents from the dashboard.',
    category: 'Account',
    sections: [
      { bullets: [
        'Each agent runs in its own Docker container with dedicated RAM.',
        'Update a channel token or switch the model at any time from the agent’s settings.',
        'Pro includes 1 agent; Premium includes up to 3 (any mix of OpenClaw and Hermes).',
      ] },
    ],
  },
  {
    slug: 'billing',
    title: 'Plans, upgrades, and cancellation',
    description: 'How billing works, and how to change or cancel your plan.',
    category: 'Account',
    sections: [
      { bullets: [
        'Pro is $24/month: 1 OpenClaw agent, 2 GB RAM, Telegram & Discord, email support.',
        'Premium is $48/month: up to 3 OpenClaw or Hermes agents, 4 GB RAM each, all channels including Slack, priority support, usage analytics.',
        'Plans are month-to-month; manage or cancel them from the Billing page.',
        'BYOK model costs are billed by your provider directly and are separate from your plan.',
      ] },
    ],
  },
  {
    slug: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common issues and how to resolve them.',
    category: 'Help',
    sections: [
      { heading: 'Agent not responding', bullets: ['Check the channel token is correct and not revoked.', 'Confirm your model provider key is valid and has quota.', 'For Discord, ensure the Message Content intent is enabled if needed.'] },
      { heading: 'Model errors', bullets: ['A provider 401 usually means an invalid or expired key — re-add it on the API Keys page.', 'Rate-limit errors come from your provider; check your provider dashboard.'] },
    ],
  },
];

export function getDoc(slug: string): Doc | undefined {
  return DOCS.find((d) => d.slug === slug);
}
