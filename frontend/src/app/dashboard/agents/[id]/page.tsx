'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAgents, startAgent, stopAgent } from '@/lib/api';

const CHANNEL_FIELDS = [
  { key: 'has_telegram', label: 'Telegram Bot Token', provider: 'telegram' },
  { key: 'has_discord', label: 'Discord Bot Token', provider: 'discord' },
  { key: 'has_slack', label: 'Slack Bot Token', provider: 'slack' },
] as const;

interface AgentData {
  id: string;
  name: string;
  type: string;
  status: string;
  port: number | null;
  model_provider: string;
  model_name: string;
  has_telegram: boolean;
  has_discord: boolean;
  has_slack: boolean;
}

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const agents = await getAgents();
        const found = agents.find((a: AgentData) => a.id === params.id);
        if (found) setAgent(found);
        else setError('Agent not found');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) return <div className="text-center py-12 text-[#5a6480]">Loading...</div>;
  if (error || !agent) return <div className="text-[#ff4d4d]">{error || 'Agent not found'}</div>;

  const statusColor = agent.status === 'RUNNING'
    ? 'bg-[rgba(0,229,204,0.15)] text-[#00e5cc]'
    : agent.status === 'STOPPED'
    ? 'bg-[rgba(136,146,176,0.15)] text-[#8892b0]'
    : 'bg-[rgba(255,77,77,0.15)] text-[#ff4d4d]';

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => router.push('/dashboard')}
        className="text-xs text-[#5a6480] hover:text-[#f0f4ff] flex items-center gap-1 mb-4 transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Agents
      </button>

      <div className="glass-card rounded-2xl p-6 border border-[rgba(136,146,176,0.15)] mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#f0f4ff]" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
              {agent.name}
            </h1>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-[#5a6480]">
              <span className="uppercase tracking-wide">{agent.type}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${statusColor}`}>
                {agent.status}
              </span>
              {agent.port && <span>Port: {agent.port}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            {agent.status === 'RUNNING' ? (
              <button
                onClick={async () => { try { await stopAgent(agent.id); } catch {} router.push('/dashboard'); }}
                className="px-4 py-2 text-xs border border-[rgba(136,146,176,0.2)] rounded-lg text-[#8892b0] hover:text-[#f0f4ff] hover:border-[rgba(136,146,176,0.4)] transition-colors"
              >
                Stop
              </button>
            ) : (
              <button
                onClick={async () => { try { await startAgent(agent.id); } catch {} router.push('/dashboard'); }}
                className="px-4 py-2 text-xs bg-[rgba(0,229,204,0.15)] text-[#00e5cc] rounded-lg hover:bg-[rgba(0,229,204,0.25)] transition-colors"
              >
                Start
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex justify-between py-2 border-b border-[rgba(136,146,176,0.1)]">
            <span className="text-[#8892b0]">Model Provider</span>
            <span className="text-[#f0f4ff] capitalize">{agent.model_provider}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[rgba(136,146,176,0.1)]">
            <span className="text-[#8892b0]">Model</span>
            <span className="text-[#f0f4ff]">{agent.model_name}</span>
          </div>
        </div>

        {agent.port && (
          <div className="mt-4 p-3 rounded-xl bg-[rgba(0,229,204,0.06)] border border-[rgba(0,229,204,0.15)]">
            <div className="text-xs text-[#8892b0] mb-1">Agent Endpoint</div>
            <code className="text-sm text-[#00e5cc] font-mono">
              {process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com'}/agent/{agent.id}/
            </code>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6 border border-[rgba(136,146,176,0.15)]">
        <h2 className="text-sm font-semibold text-[#f0f4ff] mb-4" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
          Connected Channels
        </h2>
        <p className="text-xs text-[#5a6480] mb-4">
          Manage messaging platform connections. Changes take effect after restarting the agent.
        </p>
        <div className="space-y-3">
          {CHANNEL_FIELDS.map((field) => {
            const hasToken = !!(agent as any)[field.key];
            return (
              <div key={field.key} className="flex items-center justify-between p-3 rounded-xl border border-[rgba(136,146,176,0.1)]">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    field.provider === 'telegram' ? 'bg-[rgba(0,136,204,0.15)] text-[#0088cc]' :
                    field.provider === 'discord' ? 'bg-[rgba(88,101,242,0.15)] text-[#5865F2]' :
                    'bg-[rgba(74,21,75,0.3)] text-[#E01E5A]'
                  }`}>
                    {field.provider === 'telegram' ? 'TG' : field.provider === 'discord' ? 'DC' : 'SL'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#f0f4ff]">{field.label}</div>
                    <div className="text-[10px] text-[#5a6480]">
                      {hasToken ? 'Connected' : 'Not connected'}
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  hasToken ? 'bg-[rgba(0,229,204,0.15)] text-[#00e5cc]' : 'bg-[rgba(136,146,176,0.1)] text-[#5a6480]'
                }`}>
                  {hasToken ? 'Active' : 'Inactive'}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-[#5a6480] mt-3">
          To update channel tokens, create a new agent with the desired channels or contact support.
        </p>
      </div>

      <div className="mt-4">
        <button
          onClick={async () => {
            if (!confirm('Delete this agent? This cannot be undone.')) return;
            try {
              const { deleteAgent } = await import('@/lib/api');
              await deleteAgent(agent.id);
              router.push('/dashboard');
            } catch (err: any) {
              setError(err.message);
            }
          }}
          className="text-xs text-[#ff4d4d] hover:text-[#ff6b6b] transition-colors"
        >
          Delete this agent
        </button>
      </div>
    </div>
  );
}