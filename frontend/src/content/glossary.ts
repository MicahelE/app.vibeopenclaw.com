// Glossary pages for /glossary/[slug]. Plain, accurate definitions of terms
// relevant to AI agent hosting — general industry definitions first, then how
// VibeOpenClaw specifically implements the concept. No invented specifics
// about other products; only state what's true of this platform.

export interface GlossaryTerm {
  slug: string;
  term: string;
  /** One-sentence definition, used as the lead paragraph and meta description. */
  shortDef: string;
  /** 2-4 paragraphs of general explanation. */
  paras: string[];
  /** How this specifically shows up on VibeOpenClaw. */
  hereParas: string[];
  /** Related glossary/product pages to link to. */
  related: { label: string; path: string }[];
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: 'byok',
    term: 'BYOK (Bring Your Own Key)',
    shortDef: 'BYOK means you supply your own API key for a model provider (e.g. OpenAI, Anthropic) instead of buying inference through a reseller markup.',
    paras: [
      'BYOK stands for "Bring Your Own Key." Instead of a platform reselling AI model usage at a markup, you create an account directly with a model provider (OpenAI, Anthropic, Google, etc.), generate an API key, and give that key to the platform to use on your behalf.',
      'The tradeoff is billing: you pay the model provider directly for tokens used, and pay the platform separately for hosting/orchestration. In exchange, you get provider-direct pricing, and you can switch providers or models without switching platforms.',
    ],
    hereParas: [
      'VibeOpenClaw is BYOK across 13 model providers with no inference markup — you add your own key, and every token you use is billed by that provider at their rate. VibeOpenClaw\'s flat $24/mo (Pro) or $48/mo (Premium) fee covers hosting and orchestration only.',
    ],
    related: [
      { label: 'What is a model provider?', path: '/glossary/model-provider' },
      { label: 'What is inference markup?', path: '/glossary/inference-markup' },
      { label: 'Managed OpenClaw hosting', path: '/openclaw-hosting' },
    ],
  },
  {
    slug: 'ai-agent',
    term: 'AI agent',
    shortDef: 'An AI agent is software that uses an LLM to decide and take actions — calling tools, running skills, or messaging on your behalf — rather than only answering a single question.',
    paras: [
      'An AI agent pairs a language model with the ability to act: calling APIs, running scripts, reading and writing files, or messaging over a channel. Where a plain chatbot returns text, an agent can chain multiple steps and use tools to complete a task.',
      'Agents typically run in a loop: read input, decide (via the LLM) what to do next, execute a tool or skill, observe the result, and repeat until the task is done or it needs your input.',
    ],
    hereParas: [
      'VibeOpenClaw hosts two open-source agent frameworks — OpenClaw and Hermes — each running in its own isolated Docker container, connected to messaging channels like Telegram, Discord, and Slack.',
    ],
    related: [
      { label: 'What is an agent skill?', path: '/glossary/agent-skill' },
      { label: 'What is a Docker container?', path: '/glossary/docker-container' },
      { label: 'What is OpenClaw?', path: '/what-is-openclaw' },
    ],
  },
  {
    slug: 'docker-container',
    term: 'Docker container',
    shortDef: 'A Docker container is an isolated, lightweight environment that packages an application with everything it needs to run, separate from other containers on the same machine.',
    paras: [
      'Docker containers share the host machine\'s kernel but keep each application\'s filesystem, processes, and network largely separate. That isolation means one container crashing, misbehaving, or being compromised doesn\'t directly affect another container on the same host.',
      'For AI agents specifically, container isolation matters because an agent often holds sensitive data — API keys, chat history, skill state. Running each agent in its own container limits the blast radius if any single agent misbehaves.',
    ],
    hereParas: [
      'Every agent on VibeOpenClaw — OpenClaw or Hermes — runs in its own dedicated Docker container with its own filesystem and environment, so one agent can\'t read another agent\'s memory or provider keys.',
    ],
    related: [
      { label: 'What is an AI agent?', path: '/glossary/ai-agent' },
      { label: 'Self-hosting vs. managed hosting', path: '/glossary/self-hosting-vs-managed' },
      { label: 'VibeOpenClaw vs xCloud', path: '/compare/vibeopenclaw-vs-xcloud' },
    ],
  },
  {
    slug: 'mcp',
    term: 'MCP (Model Context Protocol)',
    shortDef: 'MCP is an open protocol that lets an AI model or agent connect to external tools and data sources through a standard interface, instead of a one-off custom integration per tool.',
    paras: [
      'Model Context Protocol (MCP) defines a standard way for an AI application to discover and call external "tools" — for example, reading a file, querying a database, or hitting an API — without the model provider or agent framework needing bespoke code for every integration.',
      'Before MCP, connecting an agent to a new tool usually meant writing custom glue code for that specific combination. An MCP server exposes its capabilities in a standard shape, so any MCP-compatible agent can use it with the same client code.',
    ],
    hereParas: [
      'OpenClaw agents connect to external tools through its skills system, which can call webhooks, APIs, or MCP servers depending on the integration — see the integrations pages for specific tools like n8n, Notion, and GitHub.',
    ],
    related: [
      { label: 'What is an agent skill?', path: '/glossary/agent-skill' },
      { label: 'What is a webhook?', path: '/glossary/webhook' },
      { label: 'OpenClaw integrations', path: '/openclaw-hosting/integrations' },
    ],
  },
  {
    slug: 'agent-skill',
    term: 'Agent skill',
    shortDef: 'A skill is a discrete capability you add to an AI agent — a plugin that lets it perform a specific action, like calling a webhook, querying an API, or reading a file.',
    paras: [
      'Rather than hardcoding every possible action into an agent\'s core, most agent frameworks let you install "skills" — small, focused plugins that each handle one capability. The agent\'s underlying model decides when a skill is relevant and calls it.',
      'Skills are typically distributed through a marketplace or registry so you only install what you need, and third parties can build and share new capabilities without changing the agent\'s core code.',
    ],
    hereParas: [
      'OpenClaw skills are installed from the ClawHub marketplace and can call webhooks, third-party APIs, or MCP servers — this is how an OpenClaw agent connects to tools like n8n, Zapier, Notion, or GitHub.',
    ],
    related: [
      { label: 'What is MCP?', path: '/glossary/mcp' },
      { label: 'What is a webhook?', path: '/glossary/webhook' },
      { label: 'OpenClaw integrations', path: '/openclaw-hosting/integrations' },
    ],
  },
  {
    slug: 'webhook',
    term: 'Webhook',
    shortDef: 'A webhook is a URL that one system calls automatically to notify or trigger another system when something happens, instead of that system having to poll for updates.',
    paras: [
      'Instead of an application repeatedly asking "did anything change yet?", a webhook lets it register a URL that gets called the moment an event occurs. The caller sends an HTTP request (usually POST) with details about the event to that URL.',
      'Webhooks are the common glue between automation tools (n8n, Zapier, Make) and other software — you give the automation tool a URL, and it fires that URL to start a workflow.',
    ],
    hereParas: [
      'An OpenClaw skill can call an outbound webhook — for example, hitting an n8n or Zapier "Catch Hook" URL — so a chat message can trigger a multi-step automation in another tool.',
    ],
    related: [
      { label: 'What is an agent skill?', path: '/glossary/agent-skill' },
      { label: 'n8n integration', path: '/openclaw-hosting/integrations/n8n' },
      { label: 'Zapier integration', path: '/openclaw-hosting/integrations/zapier' },
    ],
  },
  {
    slug: 'model-provider',
    term: 'Model provider',
    shortDef: 'A model provider is a company that serves LLM inference over an API — OpenAI, Anthropic, and Google are examples — which you access with an API key you generate and control.',
    paras: [
      'A model provider hosts the actual language model and exposes it through an API. You (or the platform you use) send a request with a prompt, and the provider\'s API returns a completion, billing per token used.',
      'Different providers specialize differently: some optimize for speed, some for long context windows, some for tool-calling reliability or cost. Because access is just an API key, many agent platforms let you plug in whichever provider fits your use case.',
    ],
    hereParas: [
      'VibeOpenClaw supports 13 model providers for BYOK — OpenAI, Anthropic, Google, Groq, xAI, Mistral, DeepSeek, Together, Fireworks, Perplexity, OpenRouter, Cohere, and NVIDIA — each with its own provider page covering strengths and how to get a key.',
    ],
    related: [
      { label: 'What is BYOK?', path: '/glossary/byok' },
      { label: 'What is a context window?', path: '/glossary/context-window' },
      { label: 'Model providers', path: '/openclaw-hosting/openai' },
    ],
  },
  {
    slug: 'context-window',
    term: 'Context window',
    shortDef: 'A context window is the maximum amount of text (measured in tokens) a model can consider at once, including the prompt, conversation history, and its response.',
    paras: [
      'Every request to a language model has a token budget — the context window — that covers everything the model reads and generates in that call. If a conversation or document exceeds it, older content has to be dropped or summarized.',
      'Context window size varies significantly by provider and model, from tens of thousands of tokens to over a million. A larger window lets an agent hold more conversation history or reference bigger documents without losing earlier context.',
    ],
    hereParas: [
      'Which context window matters for an OpenClaw or Hermes agent depends on the model provider you choose — providers like Google are often picked specifically for large context windows when an agent needs to reason over long documents.',
    ],
    related: [
      { label: 'What is a model provider?', path: '/glossary/model-provider' },
      { label: 'What is BYOK?', path: '/glossary/byok' },
    ],
  },
  {
    slug: 'self-hosting-vs-managed',
    term: 'Self-hosting vs. managed hosting',
    shortDef: 'Self-hosting means running the software yourself on your own server; managed hosting means a provider runs it for you on their infrastructure for a fee.',
    paras: [
      'Self-hosting an open-source AI agent means provisioning a server, installing Docker (or the runtime it needs), configuring the agent yourself, and being responsible for keeping it running, patched, and secured.',
      'Managed hosting shifts that operational work to a provider: you get an account and a running agent without touching a server, in exchange for a subscription fee. The tradeoff is less infrastructure control for less operational burden.',
    ],
    hereParas: [
      'VibeOpenClaw is managed hosting for OpenClaw and Hermes: you add a model key, pick an agent type, connect a channel, and it deploys in about 30 seconds in an isolated Docker container — no server, Docker, or SSH access required on your side.',
    ],
    related: [
      { label: 'What is a Docker container?', path: '/glossary/docker-container' },
      { label: 'What is an AI agent?', path: '/glossary/ai-agent' },
      { label: 'Managed vs. self-hosting OpenClaw', path: '/blog/managed-vs-self-hosting-openclaw' },
    ],
  },
  {
    slug: 'inference-markup',
    term: 'Inference markup',
    shortDef: 'Inference markup is when a platform charges more per token than the underlying model provider\'s own rate, effectively reselling AI usage at a margin.',
    paras: [
      'Many AI products bundle model usage into their subscription and charge a margin on top of the provider\'s raw per-token price — often invisibly, since you never see the underlying provider\'s bill. This can make usage-heavy workloads unpredictable or expensive at scale.',
      'A BYOK platform avoids this by having you hold the provider relationship directly: you\'re billed by the model provider at their published rate, and the platform charges separately (usually a flat fee) for hosting or orchestration.',
    ],
    hereParas: [
      'VibeOpenClaw charges a flat $24/mo (Pro) or $48/mo (Premium) for hosting and never marks up inference — every token you use is billed by your chosen provider directly, at their rate.',
    ],
    related: [
      { label: 'What is BYOK?', path: '/glossary/byok' },
      { label: 'What is a model provider?', path: '/glossary/model-provider' },
    ],
  },
];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find((g) => g.slug === slug);
}
