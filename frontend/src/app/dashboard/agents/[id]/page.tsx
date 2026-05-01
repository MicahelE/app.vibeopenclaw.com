'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAgents, startAgent, stopAgent, deleteAgent, updateAgent, getAgentLogs } from '@/lib/api';

const CHANNELS = [
  { key: 'telegram', tokenKey: 'telegram_bot_token', has: 'has_telegram', label: 'Telegram', placeholder: '123456789:ABCdef...', guide: 'https://t.me/BotFather' },
  { key: 'discord', tokenKey: 'discord_bot_token', has: 'has_discord', label: 'Discord', placeholder: 'MTk4NjIyNjI5...', guide: 'https://discord.com/developers/applications' },
  { key: 'slack', tokenKey: 'slack_bot_token', has: 'has_slack', label: 'Slack', placeholder: 'xoxb-...', guide: 'https://api.slack.com/apps' },
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
  const [editingName, setEditingName] = useState(false);
  const [pendingName, setPendingName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [openChannel, setOpenChannel] = useState<string | null>(null);
  const [pendingToken, setPendingToken] = useState<Record<string, string>>({});
  const [savingChannel, setSavingChannel] = useState<string | null>(null);

  async function reload() {
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

  useEffect(() => { reload(); }, [params.id]);

  async function saveName() {
    if (!agent || !pendingName.trim() || pendingName === agent.name) {
      setEditingName(false);
      return;
    }
    setSavingName(true);
    setError('');
    try {
      await updateAgent(agent.id, { name: pendingName.trim() });
      setEditingName(false);
      await reload();
    } catch (err: any) {
      setError(err.message || 'Failed to rename agent');
    } finally {
      setSavingName(false);
    }
  }

  async function saveToken(channel: typeof CHANNELS[number]) {
    if (!agent) return;
    const token = pendingToken[channel.key];
    setSavingChannel(channel.key);
    setError('');
    try {
      await updateAgent(agent.id, { [channel.tokenKey]: token || null });
      setPendingToken((p) => ({ ...p, [channel.key]: '' }));
      setOpenChannel(null);
      await reload();
    } catch (err: any) {
      setError(err.message || `Failed to update ${channel.label}`);
    } finally {
      setSavingChannel(null);
    }
  }

  async function clearToken(channel: typeof CHANNELS[number]) {
    if (!agent) return;
    setSavingChannel(channel.key);
    setError('');
    try {
      await updateAgent(agent.id, { [channel.tokenKey]: null });
      await reload();
    } catch (err: any) {
      setError(err.message || `Failed to disconnect ${channel.label}`);
    } finally {
      setSavingChannel(null);
    }
  }

  if (loading) return <div className="text-center py-12 text-[#5a6480]">Loading...</div>;
  if (!agent) return <div className="text-[#ff4d4d]">{error || 'Agent not found'}</div>;

  const statusColor = agent.status === 'RUNNING'
    ? 'bg-[rgba(0,229,204,0.15)] text-[#00e5cc]'
    : agent.status === 'STOPPED'
    ? 'bg-[rgba(136,146,176,0.15)] text-[#8892b0]'
    : agent.status === 'CREATING'
    ? 'bg-[rgba(255,193,7,0.15)] text-[#ffc107]'
    : 'bg-[rgba(255,77,77,0.15)] text-[#ff4d4d]';

  const isBusy = savingChannel !== null || savingName || agent.status === 'CREATING';

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => router.push('/dashboard')}
        className="text-xs text-[#5a6480] hover:text-[#f0f4ff] flex items-center gap-1 mb-4 transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Agents
      </button>

      {error && (
        <div className="bg-[rgba(255,77,77,0.15)] text-[#ff4d4d] p-3 rounded-xl mb-4 text-sm border border-[rgba(255,77,77,0.3)]">
          {error}
        </div>
      )}

      <div className="glass-card rounded-2xl p-6 border border-[rgba(136,146,176,0.15)] mb-6">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={pendingName}
                  onChange={(e) => setPendingName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(136,146,176,0.3)] text-[#f0f4ff] text-lg font-bold outline-none focus:border-[#ff4d4d]"
                  style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
                />
                <button onClick={saveName} disabled={savingName} className="px-3 py-1.5 text-xs bg-[rgba(0,229,204,0.15)] text-[#00e5cc] rounded-lg hover:bg-[rgba(0,229,204,0.25)] disabled:opacity-50">
                  {savingName ? '...' : 'Save'}
                </button>
                <button onClick={() => setEditingName(false)} disabled={savingName} className="px-3 py-1.5 text-xs text-[#5a6480] hover:text-[#f0f4ff]">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => { setPendingName(agent.name); setEditingName(true); }}
                className="text-xl font-bold text-[#f0f4ff] hover:text-[#ff4d4d] transition-colors text-left"
                style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
                title="Click to rename"
              >
                {agent.name}
              </button>
            )}
            <div className="flex items-center gap-3 mt-1.5 text-xs text-[#5a6480]">
              <span className="uppercase tracking-wide">{agent.type}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${statusColor}`}>
                {agent.status}
              </span>
              {agent.port && <span>Port: {agent.port}</span>}
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {agent.status === 'RUNNING' ? (
              <button
                onClick={async () => { try { await stopAgent(agent.id); } catch {} await reload(); }}
                disabled={isBusy}
                className="px-4 py-2 text-xs border border-[rgba(136,146,176,0.2)] rounded-lg text-[#8892b0] hover:text-[#f0f4ff] hover:border-[rgba(136,146,176,0.4)] transition-colors disabled:opacity-50"
              >
                Stop
              </button>
            ) : agent.status === 'STOPPED' ? (
              <button
                onClick={async () => { try { await startAgent(agent.id); } catch {} await reload(); }}
                disabled={isBusy}
                className="px-4 py-2 text-xs bg-[rgba(0,229,204,0.15)] text-[#00e5cc] rounded-lg hover:bg-[rgba(0,229,204,0.25)] transition-colors disabled:opacity-50"
              >
                Start
              </button>
            ) : null}
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
        {!agent.port && agent.type === 'HERMES' && (
          <div className="mt-4 p-3 rounded-xl bg-[rgba(136,146,176,0.06)] border border-[rgba(136,146,176,0.15)]">
            <div className="text-xs text-[#8892b0]">
              Hermes agents communicate through messaging channels (Telegram, Discord, Slack) — there&apos;s no public HTTP endpoint. Connect a channel below to start chatting.
            </div>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6 border border-[rgba(136,146,176,0.15)]">
        <h2 className="text-sm font-semibold text-[#f0f4ff] mb-1" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
          Connected Channels
        </h2>
        <p className="text-xs text-[#5a6480] mb-4">
          Saving a token redeploys the container with the new env — takes about 30 seconds.
        </p>
        <div className="space-y-3">
          {CHANNELS.map((channel) => {
            const connected = !!(agent as any)[channel.has];
            const isOpen = openChannel === channel.key;
            const draftToken = pendingToken[channel.key] || '';
            const saving = savingChannel === channel.key;
            const accent = channel.key === 'telegram' ? '#0088cc' : channel.key === 'discord' ? '#5865F2' : '#E01E5A';
            return (
              <div key={channel.key} className="border border-[rgba(136,146,176,0.15)] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenChannel(isOpen ? null : channel.key)}
                  disabled={isBusy && !saving}
                  className="w-full flex items-center justify-between p-3 hover:bg-[rgba(255,255,255,0.02)] transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold"
                      style={{ background: `${accent}26`, color: accent }}
                    >
                      {channel.key === 'telegram' ? 'TG' : channel.key === 'discord' ? 'DC' : 'SL'}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-[#f0f4ff]">{channel.label}</div>
                      <div className="text-[10px] text-[#5a6480]">
                        {connected ? 'Connected' : 'Not connected'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      connected ? 'bg-[rgba(0,229,204,0.15)] text-[#00e5cc]' : 'bg-[rgba(136,146,176,0.1)] text-[#5a6480]'
                    }`}>
                      {connected ? 'Active' : 'Inactive'}
                    </span>
                    <svg className={`w-4 h-4 text-[#5a6480] transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {isOpen && (
                  <div className="px-3 pb-3 border-t border-[rgba(136,146,176,0.1)] mt-1 space-y-2">
                    <input
                      type="password"
                      value={draftToken}
                      onChange={(e) => setPendingToken((p) => ({ ...p, [channel.key]: e.target.value }))}
                      placeholder={connected ? 'Replace existing token (or leave blank)' : channel.placeholder}
                      className="w-full mt-3 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(136,146,176,0.15)] text-[#f0f4ff] placeholder-[#5a6480] text-xs outline-none focus:border-[#ff4d4d]"
                      disabled={saving}
                    />
                    <div className="flex items-center justify-between">
                      <a
                        href={channel.guide}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#00e5cc] hover:text-[#00ffd5] transition-colors"
                      >
                        Get a {channel.label} bot token →
                      </a>
                      <div className="flex items-center gap-2">
                        {connected && (
                          <button
                            onClick={() => clearToken(channel)}
                            disabled={saving || isBusy}
                            className="text-[10px] text-[#ff4d4d] hover:text-[#ff6b6b] transition-colors disabled:opacity-50"
                          >
                            Disconnect
                          </button>
                        )}
                        <button
                          onClick={() => saveToken(channel)}
                          disabled={!draftToken || saving || isBusy}
                          className="px-3 py-1.5 text-[11px] rounded-lg text-white font-semibold transition-all disabled:opacity-40"
                          style={{ background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)' }}
                        >
                          {saving ? 'Redeploying...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AgentLogs agentId={agent.id} />

      <div className="mt-4">
        <button
          onClick={async () => {
            if (!confirm('Delete this agent? This cannot be undone.')) return;
            try {
              await deleteAgent(agent.id);
              router.push('/dashboard');
            } catch (err: any) {
              setError(err.message);
            }
          }}
          disabled={isBusy}
          className="text-xs text-[#ff4d4d] hover:text-[#ff6b6b] transition-colors disabled:opacity-50"
        >
          Delete this agent
        </button>
      </div>
    </div>
  );
}

function AgentLogs({ agentId }: { agentId: string }) {
  const [logs, setLogs] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [err, setErr] = useState<string>('');

  async function load() {
    setLoading(true);
    setErr('');
    try {
      const data = await getAgentLogs(agentId, 200);
      setLogs(data.logs || data.detail || '');
    } catch (e: any) {
      setErr(e?.message || 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, agentId]);

  useEffect(() => {
    if (!open || !autoRefresh) return;
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, autoRefresh, agentId]);

  return (
    <div className="mt-6 glass-card rounded-2xl border border-[rgba(136,146,176,0.15)] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[rgba(255,255,255,0.02)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#f0f4ff]" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            Container logs
          </h2>
          <span className="text-[10px] text-[#5a6480]">last 200 lines</span>
        </div>
        <svg className={`w-4 h-4 text-[#5a6480] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-5 border-t border-[rgba(136,146,176,0.1)]">
          <div className="flex items-center justify-between mt-3 mb-2 gap-2">
            <label className="flex items-center gap-1.5 text-[10px] text-[#8892b0] cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="accent-[#ff4d4d]"
              />
              Auto-refresh every 5s
            </label>
            <button
              onClick={load}
              disabled={loading}
              className="text-[10px] text-[#00e5cc] hover:text-[#00ffd5] transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>
          {err ? (
            <div className="text-[11px] text-[#ff4d4d]">{err}</div>
          ) : (
            <pre className="text-[10px] text-[#8892b0] bg-[rgba(0,0,0,0.4)] rounded-lg p-3 max-h-[420px] overflow-auto whitespace-pre-wrap break-all font-mono">
              {logs || (loading ? 'Loading…' : 'No logs yet')}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
