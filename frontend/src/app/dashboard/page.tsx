'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAgents, startAgent, stopAgent, deleteAgent } from '@/lib/api';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  port: number | null;
}

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadAgents() {
    try {
      setLoading(true);
      const data = await getAgents();
      setAgents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAgents();
  }, []);

  async function handleStart(id: string) {
    try { await startAgent(id); loadAgents(); } catch (err: any) { setError(err.message); }
  }

  async function handleStop(id: string) {
    try { await stopAgent(id); loadAgents(); } catch (err: any) { setError(err.message); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this agent?')) return;
    try { await deleteAgent(id); loadAgents(); } catch (err: any) { setError(err.message); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#f0f4ff]" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Your Agents</h1>
        <Link
          href="/dashboard/agents/new"
          className="bg-gradient-to-r from-[#ff4d4d] to-[#991b1b] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-[0_4px_20px_rgba(255,77,77,0.35)] transition-all hover:-translate-y-0.5"
          style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
        >
          + New Agent
        </Link>
      </div>

      {error && (
        <div className="bg-[rgba(255,77,77,0.15)] text-[#ff4d4d] p-3 rounded-xl mb-4 text-sm border border-[rgba(255,77,77,0.3)]">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-12 text-[#5a6480]">Loading agents...</div>
      ) : agents.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-2xl border border-[rgba(136,146,176,0.15)]">
          <p className="text-[#5a6480] mb-4">No agents yet</p>
          <Link href="/dashboard/agents/new" className="text-[#ff4d4d] hover:underline font-medium text-sm">
            Create your first agent
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="glass-card rounded-xl p-5 flex items-center justify-between transition-all hover:border-[rgba(255,77,77,0.2)]"
            >
              <div>
                <h3 className="font-semibold text-[#f0f4ff] text-sm">{agent.name}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-[#5a6480]">
                  <span className="uppercase tracking-wide">{agent.type}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                    agent.status === 'RUNNING'
                      ? 'bg-[rgba(0,229,204,0.15)] text-[#00e5cc]'
                      : agent.status === 'STOPPED'
                      ? 'bg-[rgba(136,146,176,0.15)] text-[#8892b0]'
                      : 'bg-[rgba(255,77,77,0.15)] text-[#ff4d4d]'
                  }`}>
                    {agent.status}
                  </span>
                  {agent.port && <span className="text-[#5a6480]">Port: {agent.port}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {agent.status === 'RUNNING' ? (
                  <button
                    onClick={() => handleStop(agent.id)}
                    className="px-3 py-1.5 text-xs border border-[rgba(136,146,176,0.2)] rounded-lg text-[#8892b0] hover:text-[#f0f4ff] hover:border-[rgba(136,146,176,0.4)] transition-colors"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    onClick={() => handleStart(agent.id)}
                    className="px-3 py-1.5 text-xs bg-[rgba(0,229,204,0.15)] text-[#00e5cc] rounded-lg hover:bg-[rgba(0,229,204,0.25)] transition-colors"
                  >
                    Start
                  </button>
                )}
                <button
                  onClick={() => handleDelete(agent.id)}
                  className="px-3 py-1.5 text-xs text-[#ff4d4d] border border-[rgba(255,77,77,0.2)] rounded-lg hover:bg-[rgba(255,77,77,0.1)] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
