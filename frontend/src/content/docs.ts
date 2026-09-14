// Docs content for /docs and /docs/[slug]. Real, useful product docs — keep
// accurate to the platform (Pro $24/Premium $48, both agents, Telegram/Discord/
// Slack, 13 BYOK providers, AES-256-GCM, ~30s deploy).

export interface DocSection {
  heading?: string;
  paras?: string[];
  steps?: string[];
  bullets?: string[];
}

export interface DocFaq {
  q: string;
  a: string;
}

export interface Doc {
  slug: string;
  title: string;
  description: string;
  category: 'Getting started' | 'Channels' | 'Models' | 'Account' | 'Help';
  sections: DocSection[];
  /** Optional FAQ block — renders an accordion + FAQPage schema. */
  faqs?: DocFaq[];
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
    title: 'OpenClaw troubleshooting: common issues and fixes',
    description: 'Agent not responding, Telegram or Discord not working, invalid API key, or an agent stuck restarting — here’s how to diagnose and fix it.',
    category: 'Help',
    sections: [
      { heading: 'Agent not responding at all', bullets: ['Check the channel token is correct and not revoked.', 'Confirm your model provider key is valid and has quota.', 'Check the agent’s status on the dashboard — a crashed agent shows as stopped, not just quiet.', 'Send a plain test message with no special formatting to rule out a parsing issue.'] },
      { heading: 'Telegram bot not responding', bullets: ['Confirm the bot token from BotFather was pasted in full, with no extra whitespace.', 'Make sure you’ve started a chat with the bot first — Telegram bots can’t message you until you message them.', 'Check the bot hasn’t been blocked or the token hasn’t been regenerated in BotFather.'] },
      { heading: 'Discord bot not responding', bullets: ['Enable the “Message Content” privileged intent for the bot in the Discord Developer Portal — this is the most common cause.', 'Confirm the bot was actually invited to the server with the right permissions (Send Messages, Read Message History).', 'Check the bot shows as online in your server’s member list.'] },
      { heading: 'Invalid API key / 401 errors', bullets: ['A provider 401 usually means an invalid, expired, or revoked key — re-add it on the API Keys page.', 'Confirm you copied the full key with no truncation, and that it’s for the provider you selected.', 'Check your provider dashboard for account-level issues (billing hold, org suspension) that can also return 401.'] },
      { heading: 'Rate-limit or quota errors', bullets: ['These come from your model provider, not from VibeOpenClaw — check your provider’s dashboard for current usage and limits.', 'Some providers rate-limit new accounts more tightly for the first few days; check their docs for tier-specific limits.'] },
      { heading: 'Agent keeps restarting or crashing', bullets: ['Check recent log output on the dashboard for the actual error before the restart.', 'A skill that throws repeatedly can trigger a crash loop — try disabling recently added skills one at a time.', 'If it started after a model switch, confirm the new provider/model combination is one OpenClaw supports.'] },
      { heading: 'A skill or webhook isn’t triggering', bullets: ['Confirm the webhook URL is correct and reachable — test it independently of the agent first.', 'Check the skill’s permissions are scoped to allow the action you’re asking for.', 'Look for a typo in how you’re invoking the skill — natural-language phrasing matters for intent matching.'] },
      { heading: 'Suspect a leaked or compromised key', bullets: ['Revoke the key immediately from your provider’s dashboard, then add a fresh one on the API Keys page.', 'Check your provider’s usage logs for activity you don’t recognize.', 'See the security guide for how key handling and isolation limit this kind of exposure going forward.'] },
    ],
    faqs: [
      { q: 'Why is my OpenClaw agent not responding?', a: 'Start with the basics: an invalid or revoked channel token, an expired model provider key, or the agent having crashed are the three most common causes. Check the dashboard for the agent’s actual status — a stopped agent looks the same as a quiet one from the outside.' },
      { q: 'My OpenClaw Telegram bot isn’t working — what do I check first?', a: 'Confirm the BotFather token was pasted in full with no extra whitespace, and that you’ve started a chat with the bot yourself — Telegram bots can’t initiate a conversation, so it can’t reply until you message it first.' },
      { q: 'My OpenClaw Discord bot won’t respond to messages', a: 'The most common cause by far is the “Message Content” privileged intent not being enabled for the bot in the Discord Developer Portal. Enable it, then confirm the bot has Send Messages and Read Message History permissions in the server.' },
      { q: 'How do I fix an invalid API key error in OpenClaw?', a: 'Re-add the key on the API Keys page, making sure it’s copied in full and matches the provider you selected. If it still fails, check your provider’s own dashboard for account-level issues like a billing hold.' },
      { q: 'Why does my OpenClaw agent keep restarting or crashing?', a: 'Check the log output right before the restart — a skill that throws an error repeatedly is the usual cause. Disable recently added skills one at a time to isolate it, especially after switching models or providers.' },
      { q: 'I think my OpenClaw API key leaked — what do I do?', a: 'Revoke it immediately in your provider’s dashboard and add a new one. Check your provider’s usage logs for unrecognized activity. See the OpenClaw security guide for how encrypted key storage and per-agent isolation reduce this risk going forward.' },
    ],
  },
];

export function getDoc(slug: string): Doc | undefined {
  return DOCS.find((d) => d.slug === slug);
}
