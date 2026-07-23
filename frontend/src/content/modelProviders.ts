// The 13 BYOK model providers VibeOpenClaw supports, with distinct per-provider
// copy for the /openclaw-hosting/[provider] pages. Keep model names current and
// generic enough not to go stale; describe each provider's real strengths.

export interface ModelProvider {
  slug: string;
  name: string;
  /** Where you get a key. */
  keyUrl: string;
  /** One-line positioning of the provider. */
  blurb: string;
  /** What this provider is known for (2-3 sentences, distinct per provider). */
  strengths: string;
  /** Representative model families (kept general). */
  models: string;
  /** A reason someone running OpenClaw might pick this provider. */
  whyForAgents: string;
}

export const MODEL_PROVIDERS: ModelProvider[] = [
  {
    slug: 'openai', name: 'OpenAI', keyUrl: 'https://platform.openai.com/api-keys',
    blurb: 'The most widely used commercial LLM API, with strong general reasoning and tool use.',
    strengths: 'OpenAI’s GPT family is a safe default for agents: reliable function/tool calling, broad ecosystem support, and consistent instruction-following. It’s the model most OpenClaw skills are tested against first.',
    models: 'GPT-class chat and reasoning models',
    whyForAgents: 'If you want an OpenClaw agent that "just works" with the widest skill compatibility, OpenAI is the least-surprising choice.',
  },
  {
    slug: 'anthropic', name: 'Anthropic', keyUrl: 'https://console.anthropic.com/settings/keys',
    blurb: 'Claude models, known for long context, careful reasoning, and strong tool use.',
    strengths: 'Anthropic’s Claude models excel at multi-step reasoning, large context windows, and following nuanced instructions — a strong fit for agents that chain many tool calls. Claude is a frequent pick for coding and analysis-heavy assistants.',
    models: 'Claude Opus, Sonnet, and Haiku families',
    whyForAgents: 'Choose Anthropic for an OpenClaw agent that handles long, complex conversations and careful tool orchestration.',
  },
  {
    slug: 'google', name: 'Google', keyUrl: 'https://aistudio.google.com/apikey',
    blurb: 'Gemini models with very large context windows and strong multimodal support.',
    strengths: 'Google’s Gemini line offers some of the largest context windows available and competitive pricing, with solid multimodal understanding. Good when your agent needs to reason over large inputs.',
    models: 'Gemini Pro and Flash families',
    whyForAgents: 'Pick Google when your OpenClaw agent works with big documents or you want generous context at a low price.',
  },
  {
    slug: 'groq', name: 'Groq', keyUrl: 'https://console.groq.com/keys',
    blurb: 'Ultra-low-latency inference on open models via Groq’s LPU hardware.',
    strengths: 'Groq is built for speed — it serves open-weight models at very high tokens-per-second, so responses feel near-instant. Ideal when latency matters more than running the largest frontier model.',
    models: 'Hosted open-weight models (Llama-class and others)',
    whyForAgents: 'Use Groq for a snappy OpenClaw chat agent where fast replies on Telegram or Discord matter most.',
  },
  {
    slug: 'xai', name: 'xAI', keyUrl: 'https://console.x.ai',
    blurb: 'Grok models from xAI with strong general capability and real-time leanings.',
    strengths: 'xAI’s Grok models are capable general-purpose LLMs with a focus on up-to-date, conversational responses. A solid alternative frontier option for agents.',
    models: 'Grok family',
    whyForAgents: 'Choose xAI if you prefer Grok’s style for your OpenClaw assistant.',
  },
  {
    slug: 'mistral', name: 'Mistral', keyUrl: 'https://console.mistral.ai/api-keys',
    blurb: 'European LLM provider with efficient open and commercial models.',
    strengths: 'Mistral offers a strong line of efficient models with competitive pricing and an EU base, which some teams prefer for data-residency reasons. Good balance of cost and capability.',
    models: 'Mistral and Mixtral families',
    whyForAgents: 'Pick Mistral for a cost-efficient OpenClaw agent, or if you prefer an EU-based provider.',
  },
  {
    slug: 'deepseek', name: 'DeepSeek', keyUrl: 'https://platform.deepseek.com/api_keys',
    blurb: 'Highly cost-effective models with strong reasoning and coding performance.',
    strengths: 'DeepSeek has become popular for delivering strong reasoning and coding results at a fraction of frontier pricing. A favorite when you want capable output on a tight budget.',
    models: 'DeepSeek chat and reasoning models',
    whyForAgents: 'Use DeepSeek to run a capable OpenClaw agent while keeping your BYOK inference bill low.',
  },
  {
    slug: 'together', name: 'Together AI', keyUrl: 'https://api.together.ai/settings/api-keys',
    blurb: 'A broad catalog of open-weight models served through one API.',
    strengths: 'Together AI hosts a large selection of open models behind a single endpoint, so you can pick the exact open-weight model your agent needs without running your own GPUs.',
    models: 'Many hosted open-weight models',
    whyForAgents: 'Choose Together when you want flexibility to swap among open models for your OpenClaw agent.',
  },
  {
    slug: 'fireworks', name: 'Fireworks AI', keyUrl: 'https://fireworks.ai/account/api-keys',
    blurb: 'Serverless, pay-per-token serving of popular open-weight models with fast, optimized inference.',
    strengths: 'Fireworks AI runs a large catalog of open-weight models — including Llama, Mixtral, and Qwen families — on its own optimized inference stack, with serverless pricing so you only pay for tokens used and never provision idle GPU capacity. A strong pick when you want production-grade speed on open models without managing infrastructure.',
    models: 'Llama, Mixtral, Qwen, and other open-weight model families, served serverless',
    whyForAgents: 'Pick Fireworks for fast, serverless open-model inference behind your OpenClaw agent — no idle capacity to pay for or manage.',
  },
  {
    slug: 'perplexity', name: 'Perplexity', keyUrl: 'https://www.perplexity.ai/settings/api',
    blurb: 'Models with built-in web grounding for fresh, cited answers.',
    strengths: 'Perplexity’s API leans into web-grounded responses, returning answers informed by current sources. Useful when your agent needs up-to-date information rather than only its training data.',
    models: 'Sonar online models',
    whyForAgents: 'Use Perplexity when your OpenClaw agent needs current, web-grounded answers.',
  },
  {
    slug: 'openrouter', name: 'OpenRouter', keyUrl: 'https://openrouter.ai/keys',
    blurb: 'One API key that routes to hundreds of models across providers.',
    strengths: 'OpenRouter is an aggregator: a single key gives access to models from many providers, with easy switching and unified billing. Great for experimenting before you commit to one provider.',
    models: 'Hundreds of models across providers',
    whyForAgents: 'Choose OpenRouter to A/B different models for your OpenClaw agent without juggling separate keys.',
  },
  {
    slug: 'cohere', name: 'Cohere', keyUrl: 'https://dashboard.cohere.com/api-keys',
    blurb: 'Enterprise-oriented models with strong retrieval and RAG tooling.',
    strengths: 'Cohere focuses on enterprise use with capable command models and best-in-class retrieval/embedding tooling, a fit for agents that lean on retrieval-augmented workflows.',
    models: 'Command and Embed families',
    whyForAgents: 'Pick Cohere for an OpenClaw agent built around retrieval and enterprise needs.',
  },
  {
    slug: 'nvidia', name: 'NVIDIA', keyUrl: 'https://build.nvidia.com',
    blurb: 'NVIDIA’s hosted catalog of optimized open and partner models.',
    strengths: 'NVIDIA’s API catalog serves a range of optimized open and partner models on its inference stack, handy if you’re already in the NVIDIA ecosystem or want their optimized serving.',
    models: 'Hosted open and partner models',
    whyForAgents: 'Use NVIDIA when you want their optimized model catalog powering your OpenClaw agent.',
  },
];

export function getProvider(slug: string): ModelProvider | undefined {
  return MODEL_PROVIDERS.find((p) => p.slug === slug);
}
