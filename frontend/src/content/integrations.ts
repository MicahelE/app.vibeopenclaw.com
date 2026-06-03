// Integration pages: /openclaw-hosting/integrations/[tool].
// ACCURACY: OpenClaw connects to external tools through its skills system
// (and, where supported, MCP or webhooks) — NOT a turnkey native one-click
// connector we provide. Frame every page that way: "an OpenClaw agent can work
// with [tool] via OpenClaw skills / webhooks / MCP." Don't claim official
// partnerships or features we can't verify.

export interface Integration {
  slug: string;
  name: string;
  url: string;
  /** What the tool is (neutral, accurate). */
  what: string;
  /** How OpenClaw connects to it (skills / webhook / MCP — generic + true). */
  how: string;
  /** Example tasks the combined setup can do. */
  examples: string[];
}

export const INTEGRATIONS: Integration[] = [
  { slug: 'n8n', name: 'n8n', url: 'https://n8n.io',
    what: 'n8n is an open-source workflow-automation tool that connects apps and runs multi-step automations.',
    how: 'An OpenClaw agent calls an n8n webhook from a skill: you create a webhook trigger in n8n, give the URL to the OpenClaw skill, and the agent fires the workflow in natural language.',
    examples: ['Message the agent on Telegram to kick off a multi-app n8n workflow', 'Let the agent decide when to trigger an automation based on your request', 'Use n8n for the deterministic steps and OpenClaw for the reasoning'] },
  { slug: 'zapier', name: 'Zapier', url: 'https://zapier.com',
    what: 'Zapier is a no-code automation platform that links thousands of apps with triggers and actions.',
    how: 'An OpenClaw agent triggers a Zapier webhook (Catch Hook) from a skill, so the agent can start any Zap from a chat message.',
    examples: ['Trigger a Zap to log a request to a spreadsheet or CRM', 'Let the agent route a task to the right Zapier workflow', 'Combine AI reasoning with Zapier’s app catalog'] },
  { slug: 'make', name: 'Make', url: 'https://www.make.com',
    what: 'Make (formerly Integromat) is a visual automation platform for connecting apps and APIs.',
    how: 'An OpenClaw skill calls a Make webhook to start a scenario, so the agent can launch complex automations conversationally.',
    examples: ['Start a Make scenario from a Telegram message', 'Have the agent pass structured data into a scenario', 'Use Make for branching logic, OpenClaw for intent'] },
  { slug: 'notion', name: 'Notion', url: 'https://www.notion.so',
    what: 'Notion is a workspace for notes, docs, and databases.',
    how: 'An OpenClaw agent reads and updates Notion through a skill that calls the Notion API with your integration token.',
    examples: ['Ask the agent to add a page or database row in Notion', 'Have it summarise a Notion doc you point it at', 'Query your Notion workspace from chat'] },
  { slug: 'github', name: 'GitHub', url: 'https://github.com',
    what: 'GitHub is the platform for hosting and collaborating on code.',
    how: 'An OpenClaw agent works with GitHub through a skill using the GitHub API and your token — reading issues, PRs, and repos.',
    examples: ['Ask the agent to summarise open issues or a PR', 'Have it draft an issue from a chat description', 'Query repo activity from Telegram or Slack'] },
  { slug: 'gmail', name: 'Gmail', url: 'https://www.google.com/gmail/',
    what: 'Gmail is Google’s email service.',
    how: 'An OpenClaw agent can read and draft email through a skill that uses the Gmail API with your authorised credentials.',
    examples: ['Ask the agent to summarise recent email', 'Have it draft a reply for your review', 'Search your inbox from chat'] },
  { slug: 'google-calendar', name: 'Google Calendar', url: 'https://calendar.google.com',
    what: 'Google Calendar is Google’s scheduling and calendar service.',
    how: 'An OpenClaw agent reads and creates events through a skill that calls the Google Calendar API with your credentials.',
    examples: ['Ask “what’s on my calendar today?” from Telegram', 'Have the agent create an event from a message', 'Get reminders pushed to your channel'] },
  { slug: 'google-sheets', name: 'Google Sheets', url: 'https://www.google.com/sheets/about/',
    what: 'Google Sheets is Google’s spreadsheet app.',
    how: 'An OpenClaw agent reads and writes rows through a skill that uses the Google Sheets API with your credentials.',
    examples: ['Log entries to a sheet from chat', 'Ask the agent to summarise a sheet’s data', 'Append structured data the agent collects'] },
  { slug: 'slack', name: 'Slack', url: 'https://slack.com',
    what: 'Slack is a team messaging platform.',
    how: 'OpenClaw connects to Slack as a first-class channel on VibeOpenClaw (Premium) — and can also call the Slack API from a skill for richer actions.',
    examples: ['Run the agent as a Slack bot your team can talk to', 'Post summaries or alerts to a channel', 'Trigger skills from Slack messages'] },
  { slug: 'airtable', name: 'Airtable', url: 'https://airtable.com',
    what: 'Airtable is a spreadsheet-database hybrid for structured data.',
    how: 'An OpenClaw agent reads and updates Airtable through a skill using the Airtable API and your key.',
    examples: ['Add or update records from a chat message', 'Ask the agent to look up a record', 'Keep a base in sync with data the agent gathers'] },
  { slug: 'hubspot', name: 'HubSpot', url: 'https://www.hubspot.com',
    what: 'HubSpot is a CRM and marketing platform.',
    how: 'An OpenClaw agent works with HubSpot through a skill that calls the HubSpot API with your token — reading or updating contacts and deals.',
    examples: ['Ask the agent to log a contact or note', 'Summarise a deal from chat', 'Enrich CRM records with data the agent collects'] },
  { slug: 'linear', name: 'Linear', url: 'https://linear.app',
    what: 'Linear is an issue tracker for software teams.',
    how: 'An OpenClaw agent works with Linear through a skill using the Linear API and your key — creating and querying issues.',
    examples: ['Create a Linear issue from a chat description', 'Ask the agent to summarise your open issues', 'Triage incoming requests into Linear'] },
  { slug: 'trello', name: 'Trello', url: 'https://trello.com',
    what: 'Trello is a kanban-style project board.',
    how: 'An OpenClaw agent reads and updates cards through a skill using the Trello API and your key.',
    examples: ['Add a card from a Telegram message', 'Ask what’s on a board', 'Move cards as the agent completes steps'] },
];

export function getIntegration(slug: string): Integration | undefined {
  return INTEGRATIONS.find((i) => i.slug === slug);
}
