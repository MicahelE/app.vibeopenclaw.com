'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getAdminStats } from '@/lib/api';

interface PlatformUser {
  id: string;
  email: string;
  name: string | null;
  plan_tier: string;
  subscription_status: string;
  created_at: string | null;
  agent_count: number;
}

interface AdminData {
  totals: { users: number; agents_active: number; agents_error: number; api_keys: number; api_calls_24h: number };
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
    container: { running: boolean; status: string; started_at: string; restart_count: number } | null;
    restart_count: number;
  }[];
  top_users_7d: { email: string; api_calls: number }[];
  users: PlatformUser[];
}

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/');
      return;
    }
    if (!user.is_admin) {
      router.push('/dashboard');
      return;
    }
    getAdminStats()
      .then((d) => { setData(d); setLastUpdated(new Date()); })
      .catch((err) => setError(err.message || 'Failed to load admin stats'));
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!data) return;
    const timer = setInterval(() => {
      getAdminStats().then((d) => { setData(d); setLastUpdated(new Date()); }).catch(() => {});
    }, 15000);
    return () => clearInterval(timer);
  }, [data]);

  if (isLoading || !user || !user.is_admin) {
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
      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <header className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
              Admin
            </h1>
            <p className="text-xs text-[#5a6480] mt-1">Platform overview &amp; user management</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[10px] text-[#5a6480]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e5cc] animate-pulse" />
              Live · updates every 15s
              {lastUpdated && <span>· {lastUpdated.toLocaleTimeString()}</span>}
            </span>
            <Link href="/dashboard" className="text-xs text-[#8892b0] hover:text-[#f0f4ff]">
              ← Dashboard
            </Link>
          </div>
        </header>

        {/* KPI cards */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Stat label="Total users" value={data.totals.users} accent="brand" />
          <Stat label="API calls (24h)" value={data.totals.api_calls_24h} />
          <Stat label="Agents running" value={data.totals.agents_active} accent="ok" />
          <Stat label="Agents errored" value={data.totals.agents_error} accent={data.totals.agents_error > 0 ? 'error' : undefined} />
          <Stat label="API keys" value={data.totals.api_keys} />
        </section>

        {/* Users — primary table */}
        <UsersSection users={data.users} />

        {/* Agents */}
        <Section title="Agents" subtitle={`${data.recent_agents.length} most recent`}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[#5a6480] border-b border-[rgba(136,146,176,0.15)]">
                  <th className="text-left py-2 pr-3 font-medium">User</th>
                  <th className="text-left py-2 pr-3 font-medium">Name</th>
                  <th className="text-left py-2 pr-3 font-medium">Type</th>
                  <th className="text-left py-2 pr-3 font-medium">Status</th>
                  <th className="text-left py-2 pr-3 font-medium">Container</th>
                  <th className="text-left py-2 pr-3 font-medium">Restarts</th>
                  <th className="text-left py-2 pr-3 font-medium">Model</th>
                  <th className="text-left py-2 pr-3 font-medium">Port</th>
                  <th className="text-left py-2 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_agents.map((a) => (
                  <tr key={a.id} className="border-b border-[rgba(136,146,176,0.05)] hover:bg-[rgba(255,255,255,0.02)]">
                    <td className="py-2 pr-3 text-[#8892b0]">{a.user_email}</td>
                    <td className="py-2 pr-3 text-[#f0f4ff]">{a.name}</td>
                    <td className="py-2 pr-3 text-[#5a6480] uppercase">{a.type}</td>
                    <td className="py-2 pr-3"><StatusPill status={a.status} /></td>
                    <td className="py-2 pr-3 text-[#5a6480]">
                      {a.container ? (a.container.running ? 'up' : a.container.status) : '—'}
                    </td>
                    <td className={`py-2 pr-3 ${a.restart_count >= 3 ? 'text-[#ff4d4d] font-semibold' : 'text-[#5a6480]'}`}>
                      {a.restart_count}
                    </td>
                    <td className="py-2 pr-3 text-[#5a6480]">{a.model}</td>
                    <td className="py-2 pr-3 text-[#5a6480]">{a.port ?? '—'}</td>
                    <td className="py-2 text-[#5a6480] whitespace-nowrap">{a.created_at ? new Date(a.created_at).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.recent_agents.length === 0 && (
              <div className="text-[#5a6480] text-xs py-4 text-center">No agents yet</div>
            )}
          </div>
        </Section>

        {/* Secondary: breakdowns + top users */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Section title="Breakdowns">
            <div className="space-y-4">
              <Breakdown title="Users by plan" rows={data.breakdown.users.map(r => [`${r.plan_tier} · ${r.subscription_status}`, r.count])} />
              <Breakdown title="Agents by status" rows={data.breakdown.agents.map(r => [`${r.agent_type} · ${r.status}`, r.count])} />
              <Breakdown title="Keys by provider" rows={data.breakdown.keys.map(r => [`${r.provider} · ${r.is_active ? 'active' : 'inactive'}`, r.count])} />
            </div>
          </Section>

          <Section title="Top users" subtitle="by API calls · last 7 days">
            {data.top_users_7d?.length > 0 ? (
              <div className="space-y-1.5">
                {data.top_users_7d.map((u, i) => (
                  <div key={u.email} className="flex justify-between items-center text-xs py-1">
                    <span className="text-[#8892b0]"><span className="text-[#5a6480] mr-2">{i + 1}.</span>{u.email}</span>
                    <span className="text-[#f0f4ff] font-medium">{u.api_calls.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[#5a6480] text-xs py-4 text-center">No API usage in the last 7 days</div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

function UsersSection({ users }: { users: PlatformUser[] }) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.email.toLowerCase().includes(q) || (u.name || '').toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <Section
      title="Users"
      subtitle={`${users.length} total`}
      action={
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search email or name…"
          className="w-56 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(136,146,176,0.15)] text-[#f0f4ff] placeholder-[#5a6480] text-xs outline-none focus:border-[#ff4d4d] transition-colors"
        />
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[#5a6480] border-b border-[rgba(136,146,176,0.15)]">
              <th className="text-left py-2 pr-3 font-medium">Email</th>
              <th className="text-left py-2 pr-3 font-medium">Name</th>
              <th className="text-left py-2 pr-3 font-medium">Plan</th>
              <th className="text-left py-2 pr-3 font-medium">Subscription</th>
              <th className="text-right py-2 pr-3 font-medium">Agents</th>
              <th className="text-left py-2 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-[rgba(136,146,176,0.05)] hover:bg-[rgba(255,255,255,0.02)]">
                <td className="py-2 pr-3 text-[#f0f4ff]">{u.email}</td>
                <td className="py-2 pr-3 text-[#8892b0]">{u.name || '—'}</td>
                <td className="py-2 pr-3"><PlanPill plan={u.plan_tier} /></td>
                <td className="py-2 pr-3"><SubPill status={u.subscription_status} /></td>
                <td className="py-2 pr-3 text-right text-[#c8d0e0] font-medium">{u.agent_count}</td>
                <td className="py-2 text-[#5a6480] whitespace-nowrap">
                  {u.created_at
                    ? new Date(u.created_at).toLocaleString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-[#5a6480] text-xs py-4 text-center">
            {users.length === 0 ? 'No users yet' : 'No users match your search'}
          </div>
        )}
      </div>
    </Section>
  );
}

function Section({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-card rounded-2xl p-5 border border-[rgba(136,146,176,0.15)]">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-semibold" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
            {title}
          </h2>
          {subtitle && <span className="text-[10px] text-[#5a6480]">{subtitle}</span>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: 'error' | 'ok' | 'brand' }) {
  const valueClass =
    accent === 'error' ? 'text-[#ff4d4d]'
    : accent === 'ok' ? 'text-[#00e5cc]'
    : accent === 'brand' ? 'text-[#ff4d4d]'
    : 'text-[#f0f4ff]';
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
    <div>
      <div className="text-xs font-semibold text-[#8892b0] mb-2">{title}</div>
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

function Pill({ children, className }: { children: React.ReactNode; className: string }) {
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${className}`}>{children}</span>;
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === 'RUNNING'
      ? 'bg-[rgba(0,229,204,0.15)] text-[#00e5cc]'
      : status === 'ERROR'
      ? 'bg-[rgba(255,77,77,0.15)] text-[#ff4d4d]'
      : 'bg-[rgba(136,146,176,0.15)] text-[#8892b0]';
  return <Pill className={cls}>{status}</Pill>;
}

function PlanPill({ plan }: { plan: string }) {
  const cls =
    plan === 'PREMIUM'
      ? 'bg-[rgba(255,77,77,0.15)] text-[#ff4d4d]'
      : plan === 'PRO'
      ? 'bg-[rgba(0,229,204,0.15)] text-[#00e5cc]'
      : 'bg-[rgba(136,146,176,0.15)] text-[#8892b0]';
  return <Pill className={cls}>{plan}</Pill>;
}

function SubPill({ status }: { status: string }) {
  const s = (status || 'none').toUpperCase();
  const cls =
    s === 'ACTIVE'
      ? 'bg-[rgba(0,229,204,0.15)] text-[#00e5cc]'
      : s === 'UNPAID' || s === 'CANCELED' || s === 'PAST_DUE'
      ? 'bg-[rgba(255,170,0,0.15)] text-[#ffaa00]'
      : 'bg-[rgba(136,146,176,0.12)] text-[#5a6480]';
  return <Pill className={cls}>{s.toLowerCase()}</Pill>;
}
