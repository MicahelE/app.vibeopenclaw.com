'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAgent } from '@/lib/api';

const MODEL_OPTIONS: Record<string, string[]> = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'o1', 'o1-mini', 'o3-mini'],
  anthropic: ['claude-sonnet-4-20250514', 'claude-3.5-sonnet-20241022', 'claude-3.5-haiku-20241022', 'claude-3-opus-20240229'],
  google: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'],
};

const CHANNEL_GUIDES = {
  telegram: {
    name: 'Telegram',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.21.03.304.103.093.07.156.175.183.296.06.24.4 2.482.4 2.482l-3.762 1.264-3.762 1.264s-1.848.71-2.496.386c-.064-.033-.125-.07-.166-.138-.041-.07-.058-.165-.04-.28.018-.117.07-.255.183-.43l1.392-2.046 1.392-2.046s.972-1.654 1.752-2.024c.156-.074.312-.072.432-.006.12.066.2.188.232.356.063.335.44 2.616.44 2.616s.326 1.924.4 2.616c.012.144.006.27-.04.356a.364.364 0 0 1-.234.152c-.122.035-.278.01-.448-.072-.68-.326-2.554-1.422-2.554-1.422l3.142-2.136 3.142-2.136s.212-.147.352-.166z"/>
      </svg>
    ),
    color: '#0088cc',
    steps: [
      'Open Telegram and search for @BotFather',
      'Send /newbot and follow the prompts to name your bot',
      'Copy the bot token BotFather gives you (looks like 123456789:ABCdef...)',
      'Paste it below',
    ],
    placeholder: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',
    link: 'https://t.me/BotFather',
    linkLabel: 'Open BotFather',
  },
  discord: {
    name: 'Discord',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
    color: '#5865F2',
    steps: [
      'Go to Discord Developer Portal and create a New Application',
      'Navigate to Bot settings and click "Reset Token" to reveal your token',
      'Enable MESSAGE CONTENT INTENT and SERVER MEMBERS INTENT under Privileged Gateway Intents',
      'Copy the bot token and paste it below',
    ],
    placeholder: 'MTk4NjIyNjI5...',
    link: 'https://discord.com/developers/applications',
    linkLabel: 'Open Discord Dev Portal',
  },
  slack: {
    name: 'Slack',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M5.042 15.165a2.285 2.285 0 0 1-2.284 2.285 2.285 2.285 0 0 1 0-4.57h2.284v2.285zm1.144 0a2.285 2.285 0 0 1 2.285-2.285 2.285 2.285 0 0 1 0 4.57H6.186v-2.285zm-1.144-5.865a2.285 2.285 0 0 1-2.284-2.285 2.285 2.285 0 0 1 4.569 0v2.285H5.042zm0-1.144a2.285 2.285 0 0 1 2.285-2.285 2.285 2.285 0 0 1 0 4.569H5.042V8.156z"/>
        <path d="M18.958 8.835a2.285 2.285 0 0 1 2.284 2.285 2.285 2.285 0 0 1-4.569 0V8.835h2.285zm-1.143 0a2.285 2.285 0 0 1-2.285 2.285 2.285 2.285 0 0 1 0-4.569h2.285v2.284zm1.143 5.865a2.285 2.285 0 0 1 2.284 2.285 2.285 2.285 0 0 1-4.569 0v-2.285h2.285zm-5.865-5.865a2.285 2.285 0 0 1 2.284-2.285 2.285 2.285 0 0 1 0 4.57H12.3V8.835zm-2.285 0a2.285 2.285 0 0 1 2.285-2.285 2.285 2.285 0 0 1 0 4.569H9.444V8.835z"/>
      </svg>
    ),
    color: '#4A154B',
    steps: [
      'Go to Slack API and click "Create New App"',
      'Choose "From scratch" and pick your workspace',
      'Under OAuth & Permissions, add bot scopes: chat:write, channels:history, groups:history',
      'Install the app to your workspace and copy the Bot User OAuth Token (starts with xoxb-)',
    ],
    placeholder: 'xoxb-1234-abcdef...',
    link: 'https://api.slack.com/apps',
    linkLabel: 'Open Slack API',
  },
};

type Step = 'type' | 'model' | 'channels' | 'confirm';

export default function NewAgentPage() {
  const [step, setStep] = useState<Step>('type');
  const [name, setName] = useState('');
  const [agentType, setAgentType] = useState('OPENCLAW');
  const [modelProvider, setModelProvider] = useState('openai');
  const [modelName, setModelName] = useState('gpt-4o');
  const [telegramToken, setTelegramToken] = useState('');
  const [discordToken, setDiscordToken] = useState('');
  const [slackToken, setSlackToken] = useState('');
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const steps: { key: Step; label: string; num: number }[] = [
    { key: 'type', label: 'Agent Type', num: 1 },
    { key: 'model', label: 'Model', num: 2 },
    { key: 'channels', label: 'Channels', num: 3 },
    { key: 'confirm', label: 'Deploy', num: 4 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      await createAgent({
        name,
        agent_type: agentType,
        model_provider: modelProvider,
        model_name: modelName,
        telegram_token: telegramToken || undefined,
        discord_token: discordToken || undefined,
        slack_token: slackToken || undefined,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create agent');
    } finally {
      setLoading(false);
    }
  }

  function nextStep() {
    if (step === 'type') setStep('model');
    else if (step === 'model') setStep('channels');
    else if (step === 'channels') setStep('confirm');
  }

  function prevStep() {
    if (step === 'model') setStep('type');
    else if (step === 'channels') setStep('model');
    else if (step === 'confirm') setStep('channels');
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-[#f0f4ff] mb-2" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
        Create New Agent
      </h1>
      <p className="text-sm text-[#5a6480] mb-6">Set up your AI agent in a few simple steps.</p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <button
              onClick={() => { if (i <= currentStepIndex || i === currentStepIndex + 1) setStep(s.key); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                step === s.key
                  ? 'bg-[rgba(255,77,77,0.2)] text-[#ff4d4d] border border-[rgba(255,77,77,0.3)]'
                  : i < currentStepIndex
                  ? 'bg-[rgba(0,229,204,0.15)] text-[#00e5cc] border border-[rgba(0,229,204,0.2)]'
                  : 'bg-[rgba(255,255,255,0.05)] text-[#5a6480] border border-[rgba(136,146,176,0.1)]'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                i < currentStepIndex ? 'bg-[#00e5cc] text-[#050810]' : step === s.key ? 'bg-[#ff4d4d] text-white' : 'bg-[rgba(255,255,255,0.1)] text-[#5a6480]'
              }`}>
                {i < currentStepIndex ? '✓' : s.num}
              </span>
              {s.label}
            </button>
            {i < steps.length - 1 && <div className="w-4 h-px bg-[rgba(136,146,176,0.2)]" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-[rgba(255,77,77,0.15)] text-[#ff4d4d] p-3 rounded-xl mb-4 text-sm border border-[rgba(255,77,77,0.3)]">
          {error}
        </div>
      )}

      {/* Step 1: Agent Type & Name */}
      {step === 'type' && (
        <div className="glass-card rounded-2xl p-6 border border-[rgba(136,146,176,0.15)]">
          <h2 className="text-sm font-semibold text-[#f0f4ff] mb-4" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            What would you like to name your agent?
          </h2>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(136,146,176,0.15)] text-[#f0f4ff] placeholder-[#5a6480] text-sm outline-none transition-all focus:border-[#ff4d4d] focus:shadow-[0_0_0_3px_rgba(255,77,77,0.15)] mb-6"
            placeholder="e.g. My Assistant"
          />

          <h2 className="text-sm font-semibold text-[#f0f4ff] mb-3" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            Choose your agent framework
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAgentType('OPENCLAW')}
              className={`p-4 rounded-xl border text-left transition-all ${
                agentType === 'OPENCLAW'
                  ? 'border-[#ff4d4d] bg-[rgba(255,77,77,0.08)] shadow-[0_0_20px_rgba(255,77,77,0.15)]'
                  : 'border-[rgba(136,146,176,0.15)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(136,146,176,0.3)]'
              }`}
            >
              <div className="text-lg font-bold text-[#f0f4ff] mb-1" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>OpenClaw</div>
              <div className="text-xs text-[#5a6480]">Node.js agent with 20+ channels, skills marketplace, and multi-agent routing</div>
            </button>
            <button
              type="button"
              onClick={() => setAgentType('HERMES')}
              className={`p-4 rounded-xl border text-left transition-all ${
                agentType === 'HERMES'
                  ? 'border-[#00e5cc] bg-[rgba(0,229,204,0.08)] shadow-[0_0_20px_rgba(0,229,204,0.15)]'
                  : 'border-[rgba(136,146,176,0.15)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(136,146,176,0.3)]'
              }`}
            >
              <div className="text-lg font-bold text-[#f0f4ff] mb-1" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Hermes</div>
              <div className="text-xs text-[#5a6480]">Python self-improving agent by Nous Research with learning loop and skill creation</div>
            </button>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={nextStep}
              disabled={!name}
              className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,77,0.35)] disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              style={{ fontFamily: '"Clash Display", system-ui, sans-serif', background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)', boxShadow: '0 4px 20px rgba(255,77,77,0.25)' }}
            >
              Next: Choose Model
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Model Selection */}
      {step === 'model' && (
        <div className="glass-card rounded-2xl p-6 border border-[rgba(136,146,176,0.15)]">
          <h2 className="text-sm font-semibold text-[#f0f4ff] mb-1" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            Pick your AI model
          </h2>
          <p className="text-xs text-[#5a6480] mb-4">
            Your agent will use this model to think and respond. Add your API key on the &quot;API Keys&quot; page first.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#8892b0] mb-1.5">Provider</label>
              <div className="grid grid-cols-3 gap-2">
                {(['openai', 'anthropic', 'google'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => { setModelProvider(p); setModelName(MODEL_OPTIONS[p][0]); }}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      modelProvider === p
                        ? 'border-[#ff4d4d] bg-[rgba(255,77,77,0.08)] text-[#f0f4ff]'
                        : 'border-[rgba(136,146,176,0.15)] bg-[rgba(255,255,255,0.02)] text-[#8892b0] hover:border-[rgba(136,146,176,0.3)]'
                    }`}
                  >
                    {p === 'openai' ? 'OpenAI' : p === 'anthropic' ? 'Anthropic' : 'Google'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#8892b0] mb-1.5">Model</label>
              <select
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(136,146,176,0.15)] text-[#f0f4ff] text-sm outline-none focus:border-[#ff4d4d]"
              >
                {MODEL_OPTIONS[modelProvider]?.map((m) => (
                  <option key={m} value={m} className="bg-[#0a0f1a]">{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={prevStep} className="px-4 py-2.5 border border-[rgba(136,146,176,0.2)] rounded-xl text-[#8892b0] text-sm hover:text-[#f0f4ff] hover:border-[rgba(136,146,176,0.4)] transition-colors">
              Back
            </button>
            <button
              onClick={nextStep}
              className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,77,0.35)]"
              style={{ fontFamily: '"Clash Display", system-ui, sans-serif', background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)', boxShadow: '0 4px 20px rgba(255,77,77,0.25)' }}
            >
              Next: Connect Channels
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Channel Integrations */}
      {step === 'channels' && (
        <div className="glass-card rounded-2xl p-6 border border-[rgba(136,146,176,0.15)]">
          <h2 className="text-sm font-semibold text-[#f0f4ff] mb-1" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            Connect messaging channels
          </h2>
          <p className="text-xs text-[#5a6480] mb-4">
            Optional — add channels so users can talk to your agent. You can always connect these later.
          </p>

          <div className="space-y-3">
            {(Object.entries(CHANNEL_GUIDES) as [keyof typeof CHANNEL_GUIDES, typeof CHANNEL_GUIDES.telegram][]).map(([key, guide]) => {
              const tokenValue = key === 'telegram' ? telegramToken : key === 'discord' ? discordToken : slackToken;
              const setToken = key === 'telegram' ? setTelegramToken : key === 'discord' ? setDiscordToken : setSlackToken;
              const isExpanded = expandedChannel === key;

              return (
                <div key={key} className="border border-[rgba(136,146,176,0.15)] rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedChannel(isExpanded ? null : key)}
                    className="w-full flex items-center justify-between p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${guide.color}20`, color: guide.color }}>
                        {guide.icon}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-[#f0f4ff]">{guide.name}</div>
                        <div className="text-[10px] text-[#5a6480]">
                          {tokenValue ? 'Connected' : 'Not connected'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {tokenValue && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(0,229,204,0.15)] text-[#00e5cc] font-semibold">Active</span>
                      )}
                      <svg className={`w-4 h-4 text-[#5a6480] transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-[rgba(136,146,176,0.1)]">
                      <div className="mt-3 mb-3 p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(136,146,176,0.1)]">
                        <div className="text-xs font-medium text-[#8892b0] mb-2">How to get your {guide.name} bot token:</div>
                        <ol className="space-y-1">
                          {guide.steps.map((s, i) => (
                            <li key={i} className="text-xs text-[#5a6480] flex gap-2">
                              <span className="text-[#ff4d4d] font-bold min-w-[16px]">{i + 1}.</span>
                              {s}
                            </li>
                          ))}
                        </ol>
                        <a
                          href={guide.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-[#00e5cc] hover:text-[#00ffd5] transition-colors"
                        >
                          {guide.linkLabel}
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                      <input
                        type="password"
                        value={tokenValue}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(136,146,176,0.15)] text-[#f0f4ff] placeholder-[#5a6480] text-sm outline-none transition-all focus:border-[#ff4d4d]"
                        placeholder={guide.placeholder}
                      />
                      {tokenValue && (
                        <button
                          type="button"
                          onClick={() => setToken('')}
                          className="mt-2 text-xs text-[#ff4d4d] hover:text-[#ff6b6b] transition-colors"
                        >
                          Remove token
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={prevStep} className="px-4 py-2.5 border border-[rgba(136,146,176,0.2)] rounded-xl text-[#8892b0] text-sm hover:text-[#f0f4ff] hover:border-[rgba(136,146,176,0.4)] transition-colors">
              Back
            </button>
            <button
              onClick={nextStep}
              className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,77,0.35)]"
              style={{ fontFamily: '"Clash Display", system-ui, sans-serif', background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)', boxShadow: '0 4px 20px rgba(255,77,77,0.25)' }}
            >
              Next: Review & Deploy
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm & Deploy */}
      {step === 'confirm' && (
        <div className="glass-card rounded-2xl p-6 border border-[rgba(136,146,176,0.15)]">
          <h2 className="text-sm font-semibold text-[#f0f4ff] mb-4" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            Review your agent
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-[rgba(136,146,176,0.1)]">
              <span className="text-xs text-[#8892b0]">Name</span>
              <span className="text-sm text-[#f0f4ff] font-medium">{name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[rgba(136,146,176,0.1)]">
              <span className="text-xs text-[#8892b0]">Type</span>
              <span className="text-sm text-[#f0f4ff] font-medium">{agentType === 'OPENCLAW' ? 'OpenClaw (Node.js)' : 'Hermes (Python)'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[rgba(136,146,176,0.1)]">
              <span className="text-xs text-[#8892b0]">Model</span>
              <span className="text-sm text-[#f0f4ff] font-medium">{modelProvider}/{modelName}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[rgba(136,146,176,0.1)]">
              <span className="text-xs text-[#8892b0]">Telegram</span>
              <span className={`text-sm font-medium ${telegramToken ? 'text-[#00e5cc]' : 'text-[#5a6480]'}`}>
                {telegramToken ? 'Connected' : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[rgba(136,146,176,0.1)]">
              <span className="text-xs text-[#8892b0]">Discord</span>
              <span className={`text-sm font-medium ${discordToken ? 'text-[#00e5cc]' : 'text-[#5a6480]'}`}>
                {discordToken ? 'Connected' : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[rgba(136,146,176,0.1)]">
              <span className="text-xs text-[#8892b0]">Slack</span>
              <span className={`text-sm font-medium ${slackToken ? 'text-[#00e5cc]' : 'text-[#5a6480]'}`}>
                {slackToken ? 'Connected' : 'Not set'}
              </span>
            </div>
          </div>

          {!telegramToken && !discordToken && !slackToken && (
            <div className="mt-3 p-3 rounded-lg bg-[rgba(255,77,77,0.08)] border border-[rgba(255,77,77,0.15)]">
              <p className="text-xs text-[#ff8a8a]">
                No channels connected — your agent will be accessible via HTTP only. You can add channels later from the agent settings.
              </p>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button onClick={prevStep} className="px-4 py-2.5 border border-[rgba(136,146,176,0.2)] rounded-xl text-[#8892b0] text-sm hover:text-[#f0f4ff] hover:border-[rgba(136,146,176,0.4)] transition-colors">
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,77,0.35)] disabled:opacity-50 disabled:hover:translate-y-0"
              style={{ fontFamily: '"Clash Display", system-ui, sans-serif', background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)', boxShadow: '0 4px 20px rgba(255,77,77,0.25)' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deploying...
                </span>
              ) : (
                'Deploy Agent'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}