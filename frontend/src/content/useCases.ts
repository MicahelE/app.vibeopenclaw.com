// Use-case landing pages for /openclaw-hosting/use-cases/[slug].
// Each entry must be genuinely distinct — real tasks an OpenClaw agent does.

export interface UseCase {
  slug: string;
  title: string;
  /** Short hero subtitle. */
  tagline: string;
  /** 2-3 sentence intro. */
  intro: string;
  /** Concrete things the agent does for this use case. */
  capabilities: string[];
  /** Which channel(s) fit this use case best, as prose. */
  channelFit: string;
}

export const USE_CASES: UseCase[] = [
  {
    slug: 'personal-assistant',
    title: 'OpenClaw as a personal AI assistant',
    tagline: 'A 24/7 assistant on Telegram that actually does things',
    intro: 'OpenClaw is built to be a personal AI assistant that takes actions, not just answers questions. Hosted on VibeOpenClaw, it runs around the clock so you can message it from your phone anytime.',
    capabilities: ['Draft and send messages, summaries, and reminders', 'Look things up and bring back concise answers', 'Run skills from the ClawHub marketplace', 'Chain multiple steps to finish a task end-to-end'],
    channelFit: 'Telegram is the most popular channel for a personal assistant — quick to set up with BotFather and always in your pocket.',
  },
  {
    slug: 'customer-support',
    title: 'OpenClaw for customer support',
    tagline: 'An always-on first-line support agent',
    intro: 'Put an OpenClaw agent on your support channel to handle first-line questions, triage issues, and hand off when needed. It runs 24/7 in an isolated container so it never sleeps.',
    capabilities: ['Answer common questions from your knowledge base', 'Triage and categorise incoming requests', 'Collect details before escalating to a human', 'Operate in a shared Discord or Slack channel'],
    channelFit: 'Discord and Slack fit team-facing support; connect either (Slack on Premium) so the agent works where your community or team already is.',
  },
  {
    slug: 'coding-assistant',
    title: 'OpenClaw as a coding assistant',
    tagline: 'A chat-driven helper for code and repos',
    intro: 'With a capable model (Anthropic and DeepSeek are popular for code), an OpenClaw agent can review snippets, explain errors, and draft changes — all from a chat channel.',
    capabilities: ['Explain errors and suggest fixes', 'Draft functions, tests, and refactors', 'Answer questions about a snippet you paste in', 'Pair with a strong coding model via BYOK'],
    channelFit: 'Discord or Slack work well for a coding assistant a team can all talk to in one channel.',
  },
  {
    slug: 'research',
    title: 'OpenClaw for research and summaries',
    tagline: 'Ask, gather, summarise — on demand',
    intro: 'Pair OpenClaw with a web-grounded provider like Perplexity and it becomes a research aide that pulls together current information and returns concise, sourced summaries.',
    capabilities: ['Summarise long inputs you send it', 'Pull together current info with a web-grounded model', 'Return concise, structured answers', 'Follow up across a multi-turn conversation'],
    channelFit: 'Telegram is great for a personal research aide; Slack suits a team research channel.',
  },
  {
    slug: 'scheduling-reminders',
    title: 'OpenClaw for scheduling and reminders',
    tagline: 'A nudge agent that keeps you on track',
    intro: 'An OpenClaw agent can act as a lightweight reminder and scheduling helper you talk to in plain language — useful for keeping yourself or a small team on track.',
    capabilities: ['Set and recall reminders in natural language', 'Summarise what’s coming up', 'Nudge you on a channel you already check', 'Combine with skills for richer workflows'],
    channelFit: 'Telegram is ideal — reminders land where you already get messages.',
  },
  {
    slug: 'team-slack-bot',
    title: 'OpenClaw as a team Slack bot',
    tagline: 'An AI teammate inside your workspace',
    intro: 'Run OpenClaw as a Slack bot (Premium plan) so your whole team can ask it questions, get summaries, and trigger skills without leaving Slack.',
    capabilities: ['Answer questions in shared channels', 'Summarise threads and documents you paste', 'Run skills on request', 'Stay available 24/7 in your workspace'],
    channelFit: 'Slack is the channel here — included on the Premium plan along with Telegram and Discord.',
  },
  {
    slug: 'automation',
    title: 'OpenClaw for workflow automation',
    tagline: 'An agent that takes actions, not just chats',
    intro: 'OpenClaw’s strength is doing things — running skills and chaining steps. Hosted and always-on, it can act as the conversational front end to your automations.',
    capabilities: ['Run multi-step skills from a single message', 'Use the ClawHub skills marketplace', 'Keep running in the background 24/7', 'Connect to the channel your team uses'],
    channelFit: 'Any supported channel works; pick the one your team or you already live in.',
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => u.slug === slug);
}
