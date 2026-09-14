// Persona/vertical landing pages for /openclaw-hosting/for/[slug].
// Distinct from use-cases.ts (task-based). These are role/industry-based:
// "who you are" rather than "what task." Keep workflows concrete and honest —
// no invented ROI numbers or case-study stats we can't back up.

export interface Vertical {
  slug: string;
  title: string;
  /** Short hero subtitle. */
  tagline: string;
  /** 2-3 sentence intro naming the role's real pain point. */
  intro: string;
  /** Concrete problems this role runs into day to day. */
  painPoints: string[];
  /** Named, concrete workflows — title + one-line description. */
  workflows: { title: string; description: string }[];
  /** Integration slugs (from content/integrations.ts) relevant to this role, for cross-links. */
  integrations: string[];
  /** Which channel(s) fit this role best, as prose. */
  channelFit: string;
}

export const VERTICALS: Vertical[] = [
  {
    slug: 'agencies',
    title: 'OpenClaw for agencies',
    tagline: 'One assistant across every client channel',
    intro: 'Agencies juggle status updates, client messages, and repetitive ops work across a dozen tools at once. An always-on OpenClaw agent gives your team one place to ask for a summary, a draft, or a status check instead of hunting across tabs.',
    painPoints: [
      'Client questions and status requests scattered across email, Slack, and project tools',
      'Repetitive reporting and update-drafting eating into billable time',
      'Onboarding new team members to a growing stack of client-specific tools',
      'No single place to ask "what\'s the status on X" across projects',
    ],
    workflows: [
      { title: 'Client status digest', description: 'Ask the agent to pull together a status summary from your project tool before a client call.' },
      { title: 'Draft-first replies', description: 'Have the agent draft a first-pass reply to a routine client question for a team member to review and send.' },
      { title: 'Cross-tool lookups', description: 'Ask "what did we agree with [client] last week" and have the agent check your connected docs or sheets.' },
      { title: 'New hire Q&A', description: 'Point new team members at the agent for how-we-work questions instead of pinging a senior teammate.' },
    ],
    integrations: ['notion', 'slack', 'google-sheets', 'gmail'],
    channelFit: 'Slack (Premium) fits agencies best — the agent sits in the same workspace your team already uses for client channels.',
  },
  {
    slug: 'ecommerce',
    title: 'OpenClaw for ecommerce',
    tagline: 'A always-on hand for orders, stock, and support',
    intro: 'Running a store means constant small tasks — checking an order, drafting a reply to a customer question, logging a restock. An OpenClaw agent handles the conversational front end so you spend less time context-switching between tools.',
    painPoints: [
      'Customer questions arriving on multiple channels at odd hours',
      'Manual lookups in spreadsheets or dashboards for order and stock status',
      'Repetitive first-response drafting for common support questions',
      'No time to build real automation, just enough time to duct-tape it',
    ],
    workflows: [
      { title: 'Order status lookup', description: 'Ask the agent to check an order or stock level in your connected sheet before replying to a customer.' },
      { title: 'First-response drafts', description: 'Let the agent draft a reply to a common customer question for you to review and send.' },
      { title: 'Daily digest', description: 'Have the agent summarise the day\'s orders or flagged issues into a single message each morning.' },
      { title: 'Restock reminders', description: 'Ask the agent to log or flag low-stock items you mention, so nothing falls through.' },
    ],
    integrations: ['google-sheets', 'airtable', 'gmail'],
    channelFit: 'Telegram or Discord work well for a solo or small-team store — quick to check from your phone between tasks.',
  },
  {
    slug: 'project-managers',
    title: 'OpenClaw for project managers',
    tagline: 'One workflow across the tools your team already uses',
    intro: 'A PM\'s day is spent moving information between tools — a ticket here, a doc there, a form somewhere else. An OpenClaw agent can sit across those tools via skills and MCP so you ask for an update instead of clicking through five apps.',
    painPoints: [
      'Status information spread across a ticket tracker, a doc, and a design tool',
      'Manually copying updates from one tool into another for stakeholders',
      'Chasing team members for status instead of pulling it directly',
      'Meeting prep that means opening the same five tabs every time',
    ],
    workflows: [
      { title: 'Cross-tool status pull', description: 'Ask the agent to check your issue tracker and doc together before a stand-up.' },
      { title: 'Meeting prep summary', description: 'Have the agent summarise recent activity across connected tools before a sync.' },
      { title: 'Stakeholder update draft', description: 'Let the agent draft a status update from what it can see, for you to edit and send.' },
      { title: 'Form-to-task capture', description: 'Ask the agent to turn a form response or message into a task in your tracker.' },
    ],
    integrations: ['github', 'notion', 'google-sheets', 'slack'],
    channelFit: 'Slack (Premium) or Discord fit PM workflows — the agent lives in the same channel your team already stands up in.',
  },
  {
    slug: 'founders',
    title: 'OpenClaw for founders and small business owners',
    tagline: 'The assistant you can\'t afford to hire yet',
    intro: 'Early on, a founder is doing support, ops, and admin themselves. An OpenClaw agent won\'t replace a hire, but it can take the repetitive parts of that work — drafting, summarising, looking things up — off your plate for a flat monthly fee.',
    painPoints: [
      'Doing support, admin, and ops work solo with no time to automate it properly',
      'Email and messages piling up across founder and business inboxes',
      'No budget yet for a full-time ops hire or VA',
      'Context-switching between "building" and "running the business"',
    ],
    workflows: [
      { title: 'Inbox triage', description: 'Ask the agent to summarise recent email so you can triage without opening every message.' },
      { title: 'Meeting and task recall', description: 'Ask "what did I say I\'d do this week" and have the agent check what you\'ve told it.' },
      { title: 'First-draft everything', description: 'Have the agent draft a reply, a summary, or a doc update for you to review.' },
      { title: 'Always-on support line', description: 'Point early customers at a channel your agent watches for common questions.' },
    ],
    integrations: ['gmail', 'google-calendar', 'notion'],
    channelFit: 'Telegram is the easiest starting point for a solo founder — set up in minutes, always in your pocket.',
  },
];

export function getVertical(slug: string): Vertical | undefined {
  return VERTICALS.find((v) => v.slug === slug);
}
