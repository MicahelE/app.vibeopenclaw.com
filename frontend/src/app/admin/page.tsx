'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getAdminStats } from '@/lib/api';

interface AdminData {
  totals: { users: number; agents_active: number; agents_error: number; api_keys: number };
  breakdown: {
    users: { plan_tier: string; subscription_status: string; count: number }[];
    agents: { agent_type: string; status: string; count: number }[];
    keys: { provider: string; is_active: boolean; count: number }[];
  };
  recent_agents: {
    id: string;
    name: string;
    type: string;
    status: string;
    port: number | null;
    model: string;
    user_email: string;
    created_at: string;
    container: { running: boolean; status: string; started_at: string } | null;
  }[];
}

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/');
      return;
    }
    getAdminStats()
      .then(setData)
      .catch((err) => setError(err.message || 'Failed to load admin stats'));
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!data) return;
    const timer = setInterval(() => {
      getAdminStats().then(setData).catch(() => {});
    }, 15000);
    return () => clearInterval(timer);
  }, [data]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#ff4d4d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050810] text-[#f0f4ff] flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="text-[#ff4d4d] text-sm mb-2">Admin access required</div>
          <div className="text-[#5a6480] text-xs">{error}</div>
          <Link href="/dashboard" className="inline-block mt-4 text-xs text-[#00e5cc] hover:text-[#00ffd5]">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#ff4d4d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050810] text-[#f0f4ff] relative">
      <div className="stars" />
      <div className="nebula" />
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            Admin
          </h1>
          <Link href="/dashboard" className="text-xs text-[#8892b0] hover:text-[#f0f4ff]">
            ← Back to dashboard
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Stat label="Users" value={data.totals.users} />
          <Stat label="Agents (running/stopped)" value={data.totals.agents_active} />
          <Stat label="Agents (errored)" value={data.totals.agents_error} accent={data.totals.agents_error > 0 ? 'error' : undefined} />
          <Stat label="API keys" value={data.totals.api_keys} />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Breakdown title="Users by plan" rows={data.breakdown.users.map(r => [`${r.plan_tier} · ${r.subscription_status}`, r.count])} />
          <Breakdown title="Agents by status" rows={data.breakdown.agents.map(r => [`${r.agent_type} · ${r.status}`, r.count])} />
          <Breakdown title="Keys by provider" rows={data.breakdown.keys.map(r => [`${r.provider} · ${r.is_active ? 'active' : 'inactive'}`, r.count])} />
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[rgba(136,146,176,0.15)]">
          <h2 className="text-sm font-semibold mb-3" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            Recent agents
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[#5a6480] border-b border-[rgba(136,146,176,0.15)]">
                  <th className="text-left py-2 pr-3">User</th>
                  <th className="text-left py-2 pr-3">Name</th>
                  <th className="text-left py-2 pr-3">Type</th>
                  <th className="text-left py-2 pr-3">Status</th>
                  <th className="text-left py-2 pr-3">Container</th>
                  <th className="text-left py-2 pr-3">Model</th>
                  <th className="text-left py-2 pr-3">Port</th>
                  <th className="text-left py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_agents.map((a) => (
                  <tr key={a.id} className="border-b border-[rgba(136,146,176,0.05)]">
                    <td className="py-1.5 pr-3 text-[#8892b0]">{a.user_email}</td>
                    <td className="py-1.5 pr-3 text-[#f0f4ff]">{a.name}</td>
                    <td className="py-1.5 pr-3 text-[#5a6480] uppercase">{a.type}</td>
                    <td className="py-1.5 pr-3">
                      <StatusPill status={a.status} />
                    </td>
                    <td className="py-1.5 pr-3 text-[#5a6480]">
                      {a.container ? (a.container.running ? 'up' : a.container.status) : '—'}
                    </td>
                    <td className="py-1.5 pr-3 text-[#5a6480]">{a.model}</td>
                    <td className="py-1.5 pr-3 text-[#5a6480]">{a.port ?? '—'}</td>
                    <td className="py-1.5 text-[#5a6480]">{new Date(a.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.recent_agents.length === 0 && (
              <div className="text-[#5a6480] text-xs py-4 text-center">No agents yet</div>
            )}
          </div>
        </div>

        <div className="text-[10px] text-[#5a6480] mt-4">Auto-refreshes every 15s</div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: 'error' }) {
  const valueClass = accent === 'error' ? 'text-[#ff4d4d]' : 'text-[#f0f4ff]';
  return (
    <div className="glass-card rounded-xl p-4 border border-[rgba(136,146,176,0.15)]">
      <div className="text-[10px] text-[#5a6480] uppercase tracking-wide">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${valueClass}`} style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
        {value}
      </div>
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: [string, number][] }) {
  return (
    <div className="glass-card rounded-2xl p-4 border border-[rgba(136,146,176,0.15)]">
      <div className="text-xs font-semibold text-[#f0f4ff] mb-2" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
        {title}
      </div>
      <div className="space-y-1">
        {rows.length === 0 && <div className="text-[10px] text-[#5a6480]">No data</div>}
        {rows.map(([label, count]) => (
          <div key={label} className="flex justify-between text-xs">
            <span className="text-[#8892b0]">{label}</span>
            <span className="text-[#f0f4ff] font-medium">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === 'RUNNING'
      ? 'bg-[rgba(0,229,204,0.15)] text-[#00e5cc]'
      : status === 'ERROR'
      ? 'bg-[rgba(255,77,77,0.15)] text-[#ff4d4d]'
      : 'bg-[rgba(136,146,176,0.15)] text-[#8892b0]';
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${cls}`}>{status}</span>;
}
