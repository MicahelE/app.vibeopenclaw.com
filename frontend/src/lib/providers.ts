export interface ProviderConfig {
  id: string;
  label: string;
  envKeyName: string;
  envModelName?: string;
  baseUrl?: string;
  openclawApi: string;
  openclawBaseUrl: string;
  models: string[];
  placeholder: string;
  docsUrl: string;
}

export const PROVIDERS: ProviderConfig[] = [
  {
    id: 'openai',
    label: 'OpenAI',
    envKeyName: 'OPENAI_API_KEY',
    envModelName: 'OPENAI_MODEL',
    openclawApi: 'openai-completions',
    openclawBaseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'o1', 'o1-mini', 'o3-mini'],
    placeholder: 'sk-...',
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    envKeyName: 'ANTHROPIC_API_KEY',
    envModelName: 'ANTHROPIC_MODEL',
    openclawApi: 'anthropic-messages',
    openclawBaseUrl: 'https://api.anthropic.com',
    models: [
      'claude-opus-4-7',
      'claude-sonnet-4-6',
      'claude-haiku-4-5-20251001',
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
    ],
    placeholder: 'sk-ant-...',
    docsUrl: 'https://console.anthropic.com/settings/keys',
  },
  {
    id: 'google',
    label: 'Google',
    envKeyName: 'GOOGLE_API_KEY',
    envModelName: 'GOOGLE_MODEL',
    openclawApi: 'google-generative-ai',
    openclawBaseUrl: 'https://generativelanguage.googleapis.com',
    models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'],
    placeholder: 'AIza...',
    docsUrl: 'https://aistudio.google.com/apikey',
  },
  {
    id: 'groq',
    label: 'Groq',
    envKeyName: 'GROQ_API_KEY',
    baseUrl: 'https://api.groq.com/openai/v1',
    openclawApi: 'openai-completions',
    openclawBaseUrl: 'https://api.groq.com/openai/v1',
    models: [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'mixtral-8x7b-32768',
      'gemma2-9b-it',
      'deepseek-r1-distill-llama-70b',
    ],
    placeholder: 'gsk_...',
    docsUrl: 'https://console.groq.com/keys',
  },
  {
    id: 'xai',
    label: 'xAI (Grok)',
    envKeyName: 'XAI_API_KEY',
    baseUrl: 'https://api.x.ai/v1',
    openclawApi: 'openai-completions',
    openclawBaseUrl: 'https://api.x.ai/v1',
    models: ['grok-2-latest', 'grok-2-vision-latest', 'grok-beta'],
    placeholder: 'xai-...',
    docsUrl: 'https://console.x.ai',
  },
  {
    id: 'mistral',
    label: 'Mistral',
    envKeyName: 'MISTRAL_API_KEY',
    baseUrl: 'https://api.mistral.ai/v1',
    openclawApi: 'openai-completions',
    openclawBaseUrl: 'https://api.mistral.ai/v1',
    models: [
      'mistral-large-latest',
      'mistral-medium-latest',
      'mistral-small-latest',
      'codestral-latest',
      'ministral-8b-latest',
      'ministral-3b-latest',
    ],
    placeholder: '...',
    docsUrl: 'https://console.mistral.ai/api-keys/',
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    envKeyName: 'DEEPSEEK_API_KEY',
    baseUrl: 'https://api.deepseek.com/v1',
    openclawApi: 'openai-completions',
    openclawBaseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    placeholder: 'sk-...',
    docsUrl: 'https://platform.deepseek.com/api_keys',
  },
  {
    id: 'together',
    label: 'Together AI',
    envKeyName: 'TOGETHER_API_KEY',
    baseUrl: 'https://api.together.xyz/v1',
    openclawApi: 'openai-completions',
    openclawBaseUrl: 'https://api.together.xyz/v1',
    models: [
      'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
      'mistralai/Mixtral-8x22B-Instruct-v0.1',
      'Qwen/Qwen2.5-72B-Instruct-Turbo',
      'deepseek-ai/DeepSeek-V3',
    ],
    placeholder: '...',
    docsUrl: 'https://api.together.ai/settings/api-keys',
  },
  {
    id: 'fireworks',
    label: 'Fireworks AI',
    envKeyName: 'FIREWORKS_API_KEY',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    openclawApi: 'openai-completions',
    openclawBaseUrl: 'https://api.fireworks.ai/inference/v1',
    models: [
      'accounts/fireworks/models/llama-v3p3-70b-instruct',
      'accounts/fireworks/models/deepseek-v3',
      'accounts/fireworks/models/qwen2p5-72b-instruct',
    ],
    placeholder: 'fw_...',
    docsUrl: 'https://fireworks.ai/account/api-keys',
  },
  {
    id: 'perplexity',
    label: 'Perplexity',
    envKeyName: 'PERPLEXITY_API_KEY',
    baseUrl: 'https://api.perplexity.ai',
    openclawApi: 'openai-completions',
    openclawBaseUrl: 'https://api.perplexity.ai',
    models: ['sonar', 'sonar-pro', 'sonar-reasoning', 'sonar-deep-research'],
    placeholder: 'pplx-...',
    docsUrl: 'https://www.perplexity.ai/settings/api',
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    envKeyName: 'OPENROUTER_API_KEY',
    baseUrl: 'https://openrouter.ai/api/v1',
    openclawApi: 'openai-completions',
    openclawBaseUrl: 'https://openrouter.ai/api/v1',
    models: [
      'anthropic/claude-3.5-sonnet',
      'openai/gpt-4o',
      'google/gemini-2.0-flash-exp',
      'meta-llama/llama-3.3-70b-instruct',
      'deepseek/deepseek-r1',
    ],
    placeholder: 'sk-or-...',
    docsUrl: 'https://openrouter.ai/keys',
  },
  {
    id: 'cohere',
    label: 'Cohere',
    envKeyName: 'COHERE_API_KEY',
    openclawApi: 'openai-completions',
    openclawBaseUrl: 'https://api.cohere.com/compatibility/v1',
    models: ['command-r-plus', 'command-r', 'command-r-08-2024'],
    placeholder: '...',
    docsUrl: 'https://dashboard.cohere.com/api-keys',
  },
];

export const PROVIDER_BY_ID: Record<string, ProviderConfig> = Object.fromEntries(
  PROVIDERS.map((p) => [p.id, p])
);

export function getProvider(id: string): ProviderConfig | undefined {
  return PROVIDER_BY_ID[id.toLowerCase()];
}
