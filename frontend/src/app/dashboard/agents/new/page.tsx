'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAgent } from '@/lib/api';

export default function NewAgentPage() {
  const [name, setName] = useState('');
  const [agentType, setAgentType] = useState('openclaw');
  const [modelProvider, setModelProvider] = useState('openai');
  const [modelName, setModelName] = useState('gpt-4o');
  const [telegramToken, setTelegramToken] = useState('');
  const [discordToken, setDiscordToken] = useState('');
  const [slackToken, setSlackToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-[#f0f4ff] mb-6" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Create New Agent</h1>

      {error && (
        <div className="bg-[rgba(255,77,77,0.15)] text-[#ff4d4d] p-3 rounded-xl mb-4 text-sm border border-[rgba(255,77,77,0.3)]">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4 border border-[rgba(136,146,176,0.15)]">
        <div>
          <label className="block text-xs text-[#8892b0] mb-1.5">Agent Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(136,146,176,0.15)] text-[#f0f4ff] placeholder-[#5a6480] text-sm outline-none transition-all focus:border-[#ff4d4d] focus:shadow-[0_0_0_3px_rgba(255,77,77,0.15)]"
            placeholder="My Awesome Agent"
          />
        </div>

        <div>
          <label className="block text-xs text-[#8892b0] mb-1.5">Agent Type</label>
          <select
            value={agentType}
            onChange={(e) => setAgentType(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(136,146,176,0.15)] text-[#f0f4ff] text-sm outline-none transition-all focus:border-[#ff4d4d]"
          >
            <option value="openclaw" className="bg-[#0a0f1a]">OpenClaw (Node.js)</option>
            <option value="hermes" className="bg-[#0a0f1a]">Hermes (Python)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#8892b0] mb-1.5">Model Provider</label>
            <select
              value={modelProvider}
              onChange={(e) => setModelProvider(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(136,146,176,0.15)] text-[#f0f4ff] text-sm outline-none transition-all focus:border-[#ff4d4d]"
            >
              <option value="openai" className="bg-[#0a0f1a]">OpenAI</option>
              <option value="anthropic" className="bg-[#0a0f1a]">Anthropic</option>
              <option value="google" className="bg-[#0a0f1a]">Google</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#8892b0] mb-1.5">Model Name</label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(136,146,176,0.15)] text-[#f0f4ff] text-sm outline-none transition-all focus:border-[#ff4d4d]"
            />
          </div>
        </div>

        <div className="border-t border-[rgba(136,146,176,0.15)] pt-4">
          <h3 className="text-xs font-medium text-[#8892b0] mb-3">Channel Integrations (Optional)</h3>
          <div className="space-y-3">
            {[
              { label: 'Telegram Bot Token', value: telegramToken, setter: setTelegramToken },
              { label: 'Discord Bot Token', value: discordToken, setter: setDiscordToken },
              { label: 'Slack Bot Token', value: slackToken, setter: setSlackToken },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-[10px] text-[#5a6480] mb-1">{field.label}</label>
                <input
                  type="password"
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(136,146,176,0.15)] text-[#f0f4ff] placeholder-[#5a6480] text-sm outline-none transition-all focus:border-[#ff4d4d]"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,77,0.35)] active:translate-y-0 disabled:opacity-50"
            style={{
              fontFamily: '"Clash Display", system-ui, sans-serif',
              background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)',
              boxShadow: '0 4px 20px rgba(255,77,77,0.25)',
            }}
          >
            {loading ? 'Creating...' : 'Create Agent'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-4 py-3 border border-[rgba(136,146,176,0.2)] rounded-xl text-[#8892b0] text-sm hover:text-[#f0f4ff] hover:border-[rgba(136,146,176,0.4)] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
