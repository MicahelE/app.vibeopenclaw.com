'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { login, register } from '@/lib/api';
import { Button, Input, PasswordInput } from '@/components/ui';
import { capture } from '@/lib/analytics';

// FAQ entries — visible HTML below and JSON-LD must stay in sync (Google rich snippet rule).
const FAQ: { q: string; a: string; href?: string; hrefText?: string }[] = [
  {
    q: "What is VibeOpenClaw?",
    a: "VibeOpenClaw is a managed SaaS platform for deploying AI agents powered by OpenClaw and Hermes. It provides Docker-isolated hosting, BYOK model support, and integrations with Telegram, Discord, and Slack, all from $24/month.",
  },
  {
    q: "What is OpenClaw?",
    a: "OpenClaw is an open-source personal AI assistant platform (Node.js) with 376k+ GitHub stars. It supports 20+ messaging channels including Telegram, Discord, Slack, WhatsApp, and iMessage, with multi-agent routing and a skills marketplace at clawhub.com.",
  },
  {
    q: "What is Hermes Agent?",
    a: "Hermes Agent is an open-source self-improving AI agent by Nous Research (Python). It features a learning loop that creates and improves skills from experience, supports messaging platforms, MCP integration, cron scheduling, and can migrate from OpenClaw.",
  },
  {
    q: "How do I deploy an AI agent on VibeOpenClaw?",
    a: "Sign up, choose OpenClaw or Hermes agent type, select your model provider, optionally add Telegram/Discord/Slack tokens, and click Create. Your agent starts in a Docker container within seconds.",
  },
  {
    q: "What does BYOK mean?",
    a: "BYOK stands for Bring Your Own Keys. Instead of paying for API calls through us, you add your own supported provider API keys. You control your LLM spend directly. We never mark up API costs.",
  },
  {
    q: "How much does VibeOpenClaw cost?",
    a: "The Pro plan is $24/month for 1 AI agent with 2 GB RAM, Telegram & Discord support. The Premium plan is $48/month for 3 AI agents with 4 GB RAM each, all channels including Slack, priority support, and usage analytics.",
  },
  {
    q: "Which AI model providers does VibeOpenClaw support?",
    a: "VibeOpenClaw supports 13 LLM providers via BYOK: OpenAI, Anthropic, Google, Groq, xAI, Mistral, DeepSeek, Together, Fireworks, Perplexity, OpenRouter, Cohere, and NVIDIA. You bring your own API keys and control your model spend directly.",
  },
  {
    q: "What is the difference between OpenClaw and Hermes agents?",
    a: "OpenClaw is a Node.js personal-assistant platform with 20+ messaging channels and a skills marketplace, exposing an HTTP endpoint. Hermes is a Python self-improving agent by Nous Research that learns skills from experience and runs as a messaging gateway (no public HTTP endpoint). Both deploy in one click on VibeOpenClaw.",
    href: "/compare/openclaw-vs-hermes",
    hrefText: "Read the full comparison →",
  },
  {
    q: "Is my data and API key secure on VibeOpenClaw?",
    a: "Each agent runs in its own isolated Docker container with dedicated RAM. Your provider API keys are encrypted at rest with AES-256-GCM and are never marked up or proxied for billing. You pay your provider directly.",
  },
  {
    q: "How do I host an OpenClaw agent?",
    a: "Create an account on VibeOpenClaw, choose OpenClaw as the agent type, paste your provider API key, optionally add a Telegram/Discord/Slack bot token, and click Create. VibeOpenClaw provisions an isolated Docker container with HTTPS in about 30 seconds. No VPS or server setup required.",
  },
  {
    q: "Can I deploy a Hermes agent in Docker without setting up a VPS?",
    a: "Yes. VibeOpenClaw runs each Hermes agent in its own managed Docker container with dedicated RAM. You don't need to provision a VPS, write a Dockerfile, or manage systemd. Just pick Hermes in the wizard and it deploys in seconds.",
  },
];

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'premium'>('pro');
  const { login: authLogin } = useAuth();
  const router = useRouter();

  function openSignup(plan: 'pro' | 'premium' = 'pro') {
    setSelectedPlan(plan);
    setShowAuth(true);
    setIsLogin(false);
  }

  function validate(): boolean {
    let ok = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address');
      ok = false;
    }
    // Only enforce length on signup; login just needs a non-empty password.
    if (!isLogin && password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      ok = false;
    } else if (!password) {
      setPasswordError('Enter your password');
      ok = false;
    }
    return ok;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');
    if (!validate()) return;
    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await login(email, password);
        await authLogin(res.access_token);
        capture('login_succeeded');
        router.push('/dashboard');
      } else {
        capture('signup_submitted', { plan: selectedPlan });
        res = await register(email, password, name || undefined, selectedPlan);
        await authLogin(res.access_token);
        capture('signup_succeeded', { plan: selectedPlan });
        // Let users into the product first; they subscribe when they deploy.
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background effects */}
      <div className="stars" />
      <div className="nebula" />

      {/* Main content */}
      <main className="relative z-10 max-w-[860px] mx-auto px-6 pt-16 pb-10 min-h-screen flex flex-col">
        {/* Hero */}
        <section className="text-center mb-14 animate-fade-in-up">
          {/* Logo */}
          <div className="mb-8 animate-float">
            <div className="w-20 h-20 mx-auto">
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_40px_rgba(255,77,77,0.4)]">
                <defs>
                  <linearGradient id="lobster-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff4d4d"/>
                    <stop offset="100%" stopColor="#991b1b"/>
                  </linearGradient>
                </defs>
                <path d="M60 10 C30 10 15 35 15 55 C15 75 30 95 45 100 L45 110 L55 110 L55 100 C55 100 60 102 65 100 L65 110 L75 110 L75 100 C90 95 105 75 105 55 C105 35 90 10 60 10Z" fill="url(#lobster-gradient)"/>
                <path d="M20 45 C5 40 0 50 5 60 C10 70 20 65 25 55 C28 48 25 45 20 45Z" fill="url(#lobster-gradient)"/>
                <path d="M100 45 C115 40 120 50 115 60 C110 70 100 65 95 55 C92 48 95 45 100 45Z" fill="url(#lobster-gradient)"/>
                <path d="M45 15 Q35 5 30 8" stroke="#ff4d4d" strokeWidth="3" strokeLinecap="round"/>
                <path d="M75 15 Q85 5 90 8" stroke="#ff4d4d" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="45" cy="35" r="6" fill="#050810"/>
                <circle cx="75" cy="35" r="6" fill="#050810"/>
                <circle cx="46" cy="34" r="2.5" fill="#00e5cc"/>
                <circle cx="76" cy="34" r="2.5" fill="#00e5cc"/>
              </svg>
            </div>
          </div>
          <p
            className="text-[#8892b0] text-xs md:text-sm mb-4"
            style={{ fontFamily: '"Clash Display", system-ui, sans-serif', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase' }}
          >
            VibeOpenClaw
          </p>

          <h1
            className="text-[clamp(2.5rem,8vw,4rem)] font-bold tracking-[-0.03em] leading-[1.05] mb-5"
            style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
          >
            <span className="gradient-text animate-gradient-shift">Host OpenClaw &amp; Hermes agents in one click</span>
          </h1>

          <p className="text-[#8892b0] text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Managed hosting for <strong className="text-[#f0f4ff]">OpenClaw</strong> and <strong className="text-[#f0f4ff]">Hermes</strong> AI agents. Deploy to Docker-isolated containers with BYOK model support, Telegram &amp; Discord integrations, and automatic SSL. No infrastructure headaches.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => openSignup('pro')}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,77,0.35)] active:translate-y-0"
              style={{
                fontFamily: '"Clash Display", system-ui, sans-serif',
                background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)',
                boxShadow: '0 4px 20px rgba(255,77,77,0.25)',
              }}
            >
              Get Started, $24/mo
            </button>
            <button
              onClick={() => { setShowAuth(true); setIsLogin(true); }}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-[#f0f4ff] font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(255,77,77,0.3)] hover:shadow-[0_8px_30px_rgba(255,77,77,0.15)] active:translate-y-0 glass-card"
              style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
            >
              Sign In
            </button>
          </div>

          {/* Quick stats / trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[#5a6480] text-sm">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e5cc]" />
              Docker Isolated
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d4d]" />
              BYOK: Bring Your Own Keys
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e5cc]" />
              HTTPS Included
            </span>
          </div>

          {/* Social proof — Product Hunt */}
          <div className="mt-8 flex justify-center">
            <a
              href="https://www.producthunt.com/products/vibeopenclaw?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-vibeopenclaw"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="VibeOpenClaw - Host OpenClaw & Hermes AI agents in one click | Product Hunt"
                width={250}
                height={54}
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1166596&theme=light&t=1780996614488"
              />
            </a>
          </div>
        </section>

        {/* Trust / stats bar — VERIFIED numbers only.
            ~30s deploy = product capability (matches existing copy);
            13 providers = providers.ts; 376k+ = upstream OpenClaw stars (framed as "built on").
            No "agents deployed" stat until a real figure exists. */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              { value: '~30s', label: 'To a live agent' },
              { value: '13', label: 'Model providers (BYOK)' },
              { value: '376k+', label: 'Built on OpenClaw ★' },
              { value: 'Nous', label: 'Hermes by Nous Research' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-[rgba(136,146,176,0.15)] bg-[rgba(10,15,26,0.4)] p-4 text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-[#f0f4ff]" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>{s.value}</div>
                <div className="text-[11px] text-[#5a6480] mt-1 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Product preview — in-code mockup mirroring the real dashboard UI
            (create-agent wizard + agent list). Honest representation, not a screenshot. */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2
              className="text-2xl md:text-3xl font-semibold text-[#f0f4ff] mb-3"
              style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
            >
              From signup to a running agent in minutes
            </h2>
            <p className="text-[#5a6480] text-sm md:text-base max-w-lg mx-auto">
              A guided wizard picks your framework, model, and channels, then deploys to an isolated container.
            </p>
          </div>

          {/* Browser-window chrome */}
          <div className="rounded-2xl border border-[rgba(136,146,176,0.2)] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.5)] glass-card">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[rgba(136,146,176,0.15)] bg-[rgba(5,8,16,0.6)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-[11px] text-[#5a6480] truncate">app.vibeopenclaw.com/dashboard/agents/new</span>
            </div>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: create-agent wizard preview */}
              <div className="p-5 border-b md:border-b-0 md:border-r border-[rgba(136,146,176,0.12)]">
                {/* Step indicator (mirrors agents/new) */}
                <div className="flex items-center gap-1.5 mb-5 flex-wrap">
                  {[
                    { n: '✓', label: 'Type', done: true, active: false },
                    { n: '2', label: 'Model', done: false, active: true },
                    { n: '3', label: 'Channels', done: false, active: false },
                    { n: '4', label: 'Deploy', done: false, active: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium ${
                        s.active
                          ? 'bg-[rgba(255,77,77,0.2)] text-[#ff4d4d] border border-[rgba(255,77,77,0.3)]'
                          : s.done
                          ? 'bg-[rgba(0,229,204,0.15)] text-[#00e5cc] border border-[rgba(0,229,204,0.2)]'
                          : 'bg-[rgba(255,255,255,0.05)] text-[#5a6480] border border-[rgba(136,146,176,0.1)]'
                      }`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          s.done ? 'bg-[#00e5cc] text-[#050810]' : s.active ? 'bg-[#ff4d4d] text-white' : 'bg-[rgba(255,255,255,0.1)] text-[#5a6480]'
                        }`}>{s.n}</span>
                        {s.label}
                      </span>
                      {i < 3 && <span className="w-3 h-px bg-[rgba(136,146,176,0.2)]" />}
                    </div>
                  ))}
                </div>
                <h3 className="text-sm font-semibold text-[#f0f4ff] mb-3" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
                  Choose your agent framework
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl border border-[#ff4d4d] bg-[rgba(255,77,77,0.08)] shadow-[0_0_20px_rgba(255,77,77,0.15)]">
                    <div className="text-base font-bold text-[#f0f4ff]" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>OpenClaw</div>
                    <div className="text-[10px] text-[#5a6480] mt-0.5">Node.js · 20+ channels · skills marketplace</div>
                  </div>
                  <div className="p-3 rounded-xl border border-[rgba(136,146,176,0.15)] bg-[rgba(255,255,255,0.02)] relative">
                    <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[rgba(0,229,204,0.15)] text-[#00e5cc] border border-[rgba(0,229,204,0.2)]">Premium</span>
                    <div className="text-base font-bold text-[#f0f4ff]" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Hermes</div>
                    <div className="text-[10px] text-[#5a6480] mt-0.5">Python · self-improving · by Nous</div>
                  </div>
                </div>
              </div>

              {/* Right: dashboard agent list preview */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-[#f0f4ff]" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Your Agents</span>
                  <span className="bg-gradient-to-r from-[#ff4d4d] to-[#991b1b] text-white px-3 py-1.5 rounded-lg text-[11px] font-semibold" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>+ New Agent</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { name: 'support-bot', type: 'OPENCLAW', status: 'RUNNING' },
                    { name: 'research-hermes', type: 'HERMES', status: 'RUNNING' },
                    { name: 'sales-assistant', type: 'OPENCLAW', status: 'CREATING' },
                  ].map((a) => (
                    <div key={a.name} className="glass-card rounded-xl p-3.5 flex items-center justify-between border border-[rgba(136,146,176,0.12)]">
                      <div>
                        <div className="text-xs font-semibold text-[#f0f4ff]">{a.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-[#5a6480] uppercase tracking-wide">{a.type}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wide ${
                            a.status === 'RUNNING'
                              ? 'bg-[rgba(0,229,204,0.15)] text-[#00e5cc]'
                              : 'bg-[rgba(255,77,77,0.15)] text-[#ff4d4d]'
                          }`}>{a.status}</span>
                        </div>
                      </div>
                      <svg className="w-3.5 h-3.5 text-[#5a6480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] text-[#5a6480] mt-3">Actual product UI. Each agent runs in its own Docker-isolated container.</p>
        </section>

        {/* Features */}
        <section className="mb-14">
          <div className="text-center mb-10">
            <h2
              className="text-2xl md:text-3xl font-semibold text-[#f0f4ff] mb-3"
              style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
            >
              Everything You Need
            </h2>
            <p className="text-[#5a6480] text-sm md:text-base max-w-lg mx-auto">
              Focus on building great agents. We handle the infrastructure, scaling, and operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: 'OpenClaw & Hermes Agents', desc: 'Deploy OpenClaw (366k+ GitHub stars, Node.js) or Hermes Agent (self-improving, Python) with one click. Both agents support 20+ messaging channels including Telegram, Discord, Slack, and WhatsApp.', accent: 'coral' },
              { title: 'BYOK Model Support', desc: 'Bring Your Own Keys for OpenAI, Anthropic, Google, NVIDIA, and more. Connect your API keys directly. No middleman, no markup on LLM costs. Switch providers anytime.', accent: 'cyan' },
              { title: 'One-Click Deploy', desc: 'Provision isolated Docker containers for each agent. Dedicated RAM and CPU limits, automatic health checks, and instant HTTPS endpoints at app.vibeopenclaw.com/agent/your-id.', accent: 'coral' },
              { title: 'Channel Integrations', desc: 'Connect your agents to Telegram, Discord, and Slack with just a bot token. OpenClaw also supports WhatsApp, Signal, iMessage, and Matrix. Go live in minutes.', accent: 'cyan' },
              { title: 'Unique Agent URLs', desc: 'Every agent gets a unique subpath URL at app.vibeopenclaw.com/agent/your-id. Share it instantly. No port forwarding, no DNS configuration needed.', accent: 'coral' },
              { title: 'Fully Managed Infrastructure', desc: 'We handle servers, Docker, SSL certificates, backups, and updates. OpenClaw and Hermes run their latest stable versions automatically.', accent: 'cyan' },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,77,77,0.3)] hover:shadow-[0_12px_40px_rgba(255,77,77,0.12)] cursor-default"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${feature.accent === 'coral' ? 'bg-[rgba(255,77,77,0.15)] text-[#ff4d4d]' : 'bg-[rgba(0,229,204,0.15)] text-[#00e5cc]'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    {i === 0 && <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />}
                    {i === 1 && <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />}
                    {i === 2 && <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />}
                    {i === 3 && <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />}
                    {i === 4 && <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />}
                    {i === 5 && <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />}
                  </svg>
                </div>
                <h3 className="text-[#f0f4ff] font-semibold text-base mb-2" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>{feature.title}</h3>
                <p className="text-[#5a6480] text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mb-14 scroll-mt-24">
          <div className="text-center mb-10">
            <h2
              className="text-2xl md:text-3xl font-semibold text-[#f0f4ff] mb-3"
              style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
            >
              Simple Pricing
            </h2>
            <p className="text-[#5a6480] text-sm md:text-base">
              Start free — pay only when you deploy. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Pro */}
            <div className="glass-card rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,77,77,0.3)] hover:shadow-[0_12px_40px_rgba(255,77,77,0.12)]">
              <h3 className="text-lg font-semibold text-[#f0f4ff] mb-2" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Pro</h3>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl font-bold text-[#f0f4ff]">$24</span>
                <span className="text-[#5a6480]">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['1 OpenClaw Agent', '2 GB RAM', 'BYOK: Bring Your Own Keys', 'Telegram & Discord', 'Email Support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#8892b0]">
                    <svg className="w-5 h-5 text-[#00e5cc] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openSignup('pro')}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,77,0.35)] active:translate-y-0"
                style={{
                  fontFamily: '"Clash Display", system-ui, sans-serif',
                  background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)',
                  boxShadow: '0 4px 20px rgba(255,77,77,0.25)',
                }}
              >
                Get Started
              </button>
            </div>

            {/* Premium */}
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,77,77,0.3)] hover:shadow-[0_12px_40px_rgba(255,77,77,0.12)]">
              <div className="absolute top-0 right-0 bg-[#ff4d4d] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Popular</div>
              <h3 className="text-lg font-semibold text-[#f0f4ff] mb-2" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Premium</h3>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl font-bold text-[#f0f4ff]">$48</span>
                <span className="text-[#5a6480]">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['3 OpenClaw or Hermes Agents', '4 GB RAM each', 'BYOK: Bring Your Own Keys', 'All Channels + Slack', 'Priority Support', 'Usage Analytics'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#8892b0]">
                    <svg className="w-5 h-5 text-[#00e5cc] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openSignup('premium')}
                className="w-full py-3 rounded-xl text-[#050810] font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)] active:translate-y-0 bg-white"
                style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
              >
                Get Started
              </button>
            </div>
          </div>
        </section>

        {/* Testimonials — confirmed accurate by the site owner (Peace, Michael are real
            users; wording approved). Do NOT add more entries unless they are real. */}
        <section className="mb-14">
          <div className="text-center mb-8">
            <h2
              className="text-2xl md:text-3xl font-semibold text-[#f0f4ff] mb-3"
              style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
            >
              What builders are saying
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {[
              {
                quote: 'I had a Telegram agent live before my coffee went cold. No VPS, no Docker files. I pasted my key and it just worked. BYOK means I see exactly what I spend on the model.',
                name: 'Peace',
                role: 'Digital Fintech Marketer',
                accent: 'coral' as const,
              },
              {
                quote: 'I deploy agents for clients constantly, and VibeOpenClaw cut the setup from an afternoon to a few minutes. Isolated containers and bring-your-own-keys are exactly what I need to hand something off safely.',
                name: 'Michael',
                role: 'Software & Tech Consultant',
                accent: 'cyan' as const,
              },
            ].map((t) => (
              <figure
                key={t.name}
                className="glass-card rounded-2xl p-6 border border-[rgba(136,146,176,0.15)] flex flex-col"
              >
                <blockquote className="text-[#c8d0e0] text-sm leading-relaxed mb-5">“{t.quote}”</blockquote>
                <figcaption className="flex items-center gap-3 mt-auto">
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      t.accent === 'coral'
                        ? 'bg-[rgba(255,77,77,0.15)] text-[#ff4d4d]'
                        : 'bg-[rgba(0,229,204,0.15)] text-[#00e5cc]'
                    }`}
                    style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
                    aria-hidden="true"
                  >
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[#f0f4ff]">{t.name}</span>
                    <span className="block text-xs text-[#5a6480]">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-14">
          <div
            className="text-center py-12 px-8 rounded-2xl border border-[rgba(136,146,176,0.15)]"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 77, 77, 0.05) 0%, rgba(10, 15, 26, 0.8) 50%, rgba(0, 229, 204, 0.03) 100%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <h2
              className="text-2xl md:text-3xl font-bold text-[#f0f4ff] mb-4"
              style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
            >
              Ready to Deploy Your First OpenClaw or Hermes Agent?
            </h2>
            <p className="text-[#8892b0] mb-8 max-w-md mx-auto">
              Host AI agents with Docker isolation, BYOK model support, and instant channel integrations. No infrastructure setup required.
            </p>
            <button
              onClick={() => openSignup('pro')}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,77,0.35)] active:translate-y-0"
              style={{
                fontFamily: '"Clash Display", system-ui, sans-serif',
                background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)',
                boxShadow: '0 4px 20px rgba(255,77,77,0.25)',
              }}
            >
              Create Account
            </button>
          </div>
        </section>

        {/* FAQ — visible content (mirrors FAQPage JSON-LD below for Google rich snippets) */}
        <section id="faq" aria-labelledby="faq-heading" className="mb-14">
          <h2
            id="faq-heading"
            className="text-2xl md:text-3xl font-bold text-[#f0f4ff] mb-6 text-center"
            style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
          >
            Frequently asked questions
          </h2>
          <div className="space-y-3 max-w-2xl mx-auto">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-[rgba(136,146,176,0.15)] bg-[rgba(10,15,26,0.4)] p-5 open:border-[rgba(136,146,176,0.3)]"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                  <span className="font-semibold text-[#f0f4ff]" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
                    {f.q}
                  </span>
                  <span className="text-[#8892b0] text-xl leading-none mt-0.5 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[#c8d0e0] text-sm leading-relaxed">
                  {f.a}
                  {f.href && (
                    <>
                      {' '}
                      <a href={f.href} className="text-[#00e5cc] hover:text-[#33ebd6] underline underline-offset-2">
                        {f.hrefText}
                      </a>
                    </>
                  )}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* JSON-LD: FAQPage — answers must match visible <details> text above */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQ.map(({ q, a }) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: { "@type": "Answer", text: a },
              })),
            }),
          }}
        />

        {/* Footer */}
        <footer className="mt-auto text-center py-8 border-t border-[rgba(136,146,176,0.15)]">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6"><svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><defs><linearGradient id="foot-logo" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ff4d4d"/><stop offset="100%" stopColor="#991b1b"/></linearGradient></defs><path d="M60 10 C30 10 15 35 15 55 C15 75 30 95 45 100 L45 110 L55 110 L55 100 C55 100 60 102 65 100 L65 110 L75 110 L75 100 C90 95 105 75 105 55 C105 35 90 10 60 10Z" fill="url(#foot-logo)"/><path d="M20 45 C5 40 0 50 5 60 C10 70 20 65 25 55 C28 48 25 45 20 45Z" fill="url(#foot-logo)"/><path d="M100 45 C115 40 120 50 115 60 C110 70 100 65 95 55 C92 48 95 45 100 45Z" fill="url(#foot-logo)"/><circle cx="45" cy="35" r="6" fill="#050810"/><circle cx="75" cy="35" r="6" fill="#050810"/><circle cx="46" cy="34" r="2.5" fill="#00e5cc"/><circle cx="76" cy="34" r="2.5" fill="#00e5cc"/></svg></div>
            <span className="text-[#f0f4ff] font-semibold text-sm" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>VibeOpenClaw</span>
          </div>
          <p className="text-[#5a6480] text-xs mb-4">Managed hosting for OpenClaw &amp; Hermes AI agents</p>
          <div className="flex justify-center gap-6 text-xs text-[#5a6480]">
            <a href="/openclaw-hosting" className="hover:text-[#f0f4ff] transition-colors">OpenClaw Hosting</a>
            <a href="/hermes-agent-hosting" className="hover:text-[#f0f4ff] transition-colors">Hermes Hosting</a>
            <a href="#pricing" className="hover:text-[#f0f4ff] transition-colors">Pricing</a>
            <a href="/blog" className="hover:text-[#f0f4ff] transition-colors">Blog</a>
            <a href="/compare/openclaw-vs-hermes" className="hover:text-[#f0f4ff] transition-colors">Compare Agents</a>
            <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener noreferrer" className="hover:text-[#f0f4ff] transition-colors">OpenClaw</a>
            <a href="https://github.com/NousResearch/hermes-agent" target="_blank" rel="noopener noreferrer" className="hover:text-[#f0f4ff] transition-colors">Hermes Agent</a>
          </div>
          <div className="mt-6 flex justify-center">
            <a
              href="https://www.producthunt.com/products/vibeopenclaw?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-vibeopenclaw"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="VibeOpenClaw - Host OpenClaw & Hermes AI agents in one click | Product Hunt"
                width={250}
                height={54}
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1166596&theme=light&t=1780996614488"
              />
            </a>
          </div>
        </footer>
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowAuth(false); setEmailError(''); setPasswordError(''); }} />
          <div
            className="relative rounded-2xl p-8 w-full max-w-md border border-[rgba(136,146,176,0.15)] max-h-[90vh] overflow-y-auto"
            style={{
              background: 'rgba(10, 15, 26, 0.9)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <button
              onClick={() => { setShowAuth(false); setEmailError(''); setPasswordError(''); }}
              className="absolute top-4 right-4 text-[#5a6480] hover:text-[#f0f4ff] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-[#f0f4ff] text-center mb-2" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p className="text-[#5a6480] text-center text-sm mb-6">
              {isLogin ? 'Sign in to manage your agents' : 'Create your account free — explore the dashboard, subscribe when you deploy'}
            </p>

            {error && (
              <div className="bg-[rgba(255,77,77,0.15)] text-[#ff4d4d] p-3 rounded-xl mb-4 text-sm border border-[rgba(255,77,77,0.3)]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm text-[#8892b0] mb-1.5">Plan</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'pro' as const, label: 'Pro', price: '$24/mo', features: ['1 OpenClaw Agent', '2 GB RAM', 'Telegram & Discord'] },
                      { id: 'premium' as const, label: 'Premium', price: '$48/mo', features: ['3 OpenClaw or Hermes Agents', '4 GB RAM each', 'All Channels + Slack'] },
                    ].map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`rounded-xl border px-3 py-2 text-left transition-all relative ${
                          selectedPlan === plan.id
                            ? 'border-[#ff4d4d] bg-[rgba(255,77,77,0.08)]'
                            : 'border-[rgba(136,146,176,0.15)] bg-[rgba(255,255,255,0.03)]'
                        }`}
                      >
                        {plan.id === 'premium' && (
                          <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[rgba(0,229,204,0.15)] text-[#00e5cc] border border-[rgba(0,229,204,0.2)]">Hermes</span>
                        )}
                        <span className="block text-sm font-semibold text-[#f0f4ff]">{plan.label}</span>
                        <span className="block text-xs text-[#5a6480] mb-1.5">{plan.price}</span>
                        <ul className="space-y-0.5">
                          {plan.features.map((f, i) => (
                            <li key={i} className="text-[11px] text-[#8892b0] flex items-center gap-1">
                              <span className="text-[#00e5cc]">✓</span> {f}
                            </li>
                          ))}
                        </ul>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {!isLogin && (
                <Input
                  label="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              )}
              <Input
                label="Email"
                type="email"
                required
                value={email}
                error={emailError}
                onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); if (error) setError(''); }}
                placeholder="you@example.com"
              />
              <PasswordInput
                label="Password"
                required
                value={password}
                error={passwordError}
                onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(''); if (error) setError(''); }}
                placeholder={isLogin ? 'Your password' : 'Min 8 characters'}
                className="ph-no-capture"
              />
              <Button type="submit" loading={loading} fullWidth size="lg">
                {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center mt-4 text-sm text-[#5a6480]">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); setEmailError(''); setPasswordError(''); }}
                className="text-[#ff4d4d] hover:underline font-medium"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
