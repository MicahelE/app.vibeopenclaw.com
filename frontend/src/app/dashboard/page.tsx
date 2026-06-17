'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getAgents } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { ButtonLink, StatusBadge, EmptyState, SkeletonCards, FONT_DISPLAY } from '@/components/ui';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  port: number | null;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const subscribed = user?.subscription_status === 'ACTIVE';
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function loadAgents() {
    try {
      const data = await getAgents();
      setAgents(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAgents();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Auto-refresh while any agent is still booting (CREATING) so the UI flips
  // to RUNNING without a manual reload. Stop polling once everything settles.
  useEffect(() => {
    const anyCreating = agents.some((a) => a.status?.toUpperCase() === 'CREATING');
    if (anyCreating && !pollRef.current) {
      pollRef.current = setInterval(loadAgents, 4000);
    } else if (!anyCreating && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, [agents]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#f0f4ff]" style={{ fontFamily: FONT_DISPLAY }}>
          Your Agents
        </h1>
        <ButtonLink href={subscribed ? '/dashboard/agents/new' : '/dashboard/billing'} size="md">
          {subscribed ? '+ New Agent' : 'Subscribe to deploy'}
        </ButtonLink>
      </div>

      {error && (
        <div className="bg-[rgba(255,77,77,0.15)] text-[#ff4d4d] p-3 rounded-xl mb-4 text-sm border border-[rgba(255,77,77,0.3)]">
          {error}
        </div>
      )}

      {loading ? (
        <SkeletonCards count={3} />
      ) : agents.length === 0 ? (
        <EmptyState
          title={subscribed ? 'No agents yet' : 'Deploy your first agent'}
          body={
            subscribed
              ? "Deploy your first OpenClaw or Hermes agent — pick a model, add a channel, and it's live in about 30 seconds."
              : 'Your account is ready. Choose a plan to deploy your first OpenClaw or Hermes agent — Docker-isolated, BYOK, live in about 30 seconds.'
          }
          action={
            subscribed
              ? { label: '+ Create your first agent', href: '/dashboard/agents/new' }
              : { label: 'Choose a plan →', href: '/dashboard/billing' }
          }
        />
      ) : (
        <div className="grid gap-3">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              href={`/dashboard/agents/${agent.id}`}
              className="glass-card rounded-xl p-5 flex items-center justify-between transition-all hover:border-[rgba(255,77,77,0.2)] block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4d4d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050810]"
            >
              <div>
                <h3 className="font-semibold text-[#f0f4ff] text-sm">{agent.name}</h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-[#5a6480]">
                  <span className="uppercase tracking-wide">{agent.type}</span>
                  <StatusBadge status={agent.status} />
                  {agent.port && <span className="text-[#5a6480]">Port: {agent.port}</span>}
                </div>
              </div>
              <svg className="w-4 h-4 text-[#5a6480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
