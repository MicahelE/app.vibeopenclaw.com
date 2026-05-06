'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { login, register } from '@/lib/api';

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await login(email, password);
      } else {
        res = await register(email, password, name || undefined);
      }
      await authLogin(res.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
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
                    <stop offset="0%" stop-color="#ff4d4d"/>
                    <stop offset="100%" stop-color="#991b1b"/>
                  </linearGradient>
                </defs>
                <path d="M60 10 C30 10 15 35 15 55 C15 75 30 95 45 100 L45 110 L55 110 L55 100 C55 100 60 102 65 100 L65 110 L75 110 L75 100 C90 95 105 75 105 55 C105 35 90 10 60 10Z" fill="url(#lobster-gradient)"/>
                <path d="M20 45 C5 40 0 50 5 60 C10 70 20 65 25 55 C28 48 25 45 20 45Z" fill="url(#lobster-gradient)"/>
                <path d="M100 45 C115 40 120 50 115 60 C110 70 100 65 95 55 C92 48 95 45 100 45Z" fill="url(#lobster-gradient)"/>
                <path d="M45 15 Q35 5 30 8" stroke="#ff4d4d" stroke-width="3" stroke-linecap="round"/>
                <path d="M75 15 Q85 5 90 8" stroke="#ff4d4d" stroke-width="3" stroke-linecap="round"/>
                <circle cx="45" cy="35" r="6" fill="#050810"/>
                <circle cx="75" cy="35" r="6" fill="#050810"/>
                <circle cx="46" cy="34" r="2.5" fill="#00e5cc"/>
                <circle cx="76" cy="34" r="2.5" fill="#00e5cc"/>
              </svg>
            </div>
          </div>
          <h1
            className="text-[clamp(3rem,10vw,4.5rem)] font-bold tracking-[-0.03em] leading-none mb-4"
            style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
          >
            <span className="gradient-text animate-gradient-shift">VibeOpenClaw</span>
          </h1>

          <p
            className="text-[#8892b0] text-lg md:text-xl max-w-xl mx-auto mb-2"
            style={{ fontFamily: '"Clash Display", system-ui, sans-serif', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}
          >
            Host AI Agents in One Click
          </p>

          <p className="text-[#8892b0] text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Managed hosting for <strong className="text-[#f0f4ff]">OpenClaw</strong> and <strong className="text-[#f0f4ff]">Hermes</strong> AI agents. Deploy to Docker-isolated containers with BYOK model support, Telegram &amp; Discord integrations, and automatic SSL. No infrastructure headaches.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => { setShowAuth(true); setIsLogin(false); }}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,77,0.35)] active:translate-y-0"
              style={{
                fontFamily: '"Clash Display", system-ui, sans-serif',
                background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)',
                boxShadow: '0 4px 20px rgba(255,77,77,0.25)',
              }}
            >
              Get Started — $60/mo
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
              BYOK — Bring Your Own Keys
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e5cc]" />
              HTTPS Included
            </span>
          </div>
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
              { title: 'BYOK Model Support', desc: 'Bring Your Own Keys for OpenAI, Anthropic, Google, NVIDIA, and more. Connect your API keys directly — no middleman, no markup on LLM costs. Switch providers anytime.', accent: 'cyan' },
              { title: 'One-Click Deploy', desc: 'Provision isolated Docker containers for each agent. Dedicated RAM and CPU limits, automatic health checks, and instant HTTPS endpoints at app.vibeopenclaw.com/agent/your-id.', accent: 'coral' },
              { title: 'Channel Integrations', desc: 'Connect your agents to Telegram, Discord, and Slack with just a bot token. OpenClaw also supports WhatsApp, Signal, iMessage, and Matrix. Go live in minutes.', accent: 'cyan' },
              { title: 'Unique Agent URLs', desc: 'Every agent gets a unique subpath URL at app.vibeopenclaw.com/agent/your-id. Share it instantly — no port forwarding, no DNS configuration needed.', accent: 'coral' },
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
        <section className="mb-14">
          <div className="text-center mb-10">
            <h2
              className="text-2xl md:text-3xl font-semibold text-[#f0f4ff] mb-3"
              style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
            >
              Simple Pricing
            </h2>
            <p className="text-[#5a6480] text-sm md:text-base">
              No free trials. No hidden fees. Pay only for what you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Pro */}
            <div className="glass-card rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,77,77,0.3)] hover:shadow-[0_12px_40px_rgba(255,77,77,0.12)]">
              <h3 className="text-lg font-semibold text-[#f0f4ff] mb-2" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Pro</h3>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl font-bold text-[#f0f4ff]">$60</span>
                <span className="text-[#5a6480]">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['1 OpenClaw or Hermes Agent', '2 GB RAM', 'BYOK — Bring Your Own Keys', 'Telegram & Discord', 'Email Support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#8892b0]">
                    <svg className="w-5 h-5 text-[#00e5cc] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => { setShowAuth(true); setIsLogin(false); }}
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
                <span className="text-4xl font-bold text-[#f0f4ff]">$100</span>
                <span className="text-[#5a6480]">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['3 OpenClaw or Hermes Agents', '4 GB RAM each', 'BYOK — Bring Your Own Keys', 'All Channels + Slack', 'Priority Support', 'Usage Analytics'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#8892b0]">
                    <svg className="w-5 h-5 text-[#00e5cc] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => { setShowAuth(true); setIsLogin(false); }}
                className="w-full py-3 rounded-xl text-[#050810] font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)] active:translate-y-0 bg-white"
                style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}
              >
                Get Started
              </button>
            </div>
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
              onClick={() => { setShowAuth(true); setIsLogin(false); }}
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

        {/* Footer */}
        <footer className="mt-auto text-center py-8 border-t border-[rgba(136,146,176,0.15)]">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6"><svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><defs><linearGradient id="foot-logo" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff4d4d"/><stop offset="100%" stop-color="#991b1b"/></linearGradient></defs><path d="M60 10 C30 10 15 35 15 55 C15 75 30 95 45 100 L45 110 L55 110 L55 100 C55 100 60 102 65 100 L65 110 L75 110 L75 100 C90 95 105 75 105 55 C105 35 90 10 60 10Z" fill="url(#foot-logo)"/><path d="M20 45 C5 40 0 50 5 60 C10 70 20 65 25 55 C28 48 25 45 20 45Z" fill="url(#foot-logo)"/><path d="M100 45 C115 40 120 50 115 60 C110 70 100 65 95 55 C92 48 95 45 100 45Z" fill="url(#foot-logo)"/><circle cx="45" cy="35" r="6" fill="#050810"/><circle cx="75" cy="35" r="6" fill="#050810"/><circle cx="46" cy="34" r="2.5" fill="#00e5cc"/><circle cx="76" cy="34" r="2.5" fill="#00e5cc"/></svg></div>
            <span className="text-[#f0f4ff] font-semibold text-sm" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>VibeOpenClaw</span>
          </div>
          <p className="text-[#5a6480] text-xs mb-4">Managed hosting for OpenClaw &amp; Hermes AI agents</p>
          <div className="flex justify-center gap-6 text-xs text-[#5a6480]">
            <a href="https://clawhub.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#f0f4ff] transition-colors">Skills Marketplace</a>
            <a href="#pricing" className="hover:text-[#f0f4ff] transition-colors">Pricing</a>
            <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener noreferrer" className="hover:text-[#f0f4ff] transition-colors">OpenClaw</a>
            <a href="https://github.com/NousResearch/hermes-agent" target="_blank" rel="noopener noreferrer" className="hover:text-[#f0f4ff] transition-colors">Hermes Agent</a>
          </div>
        </footer>
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAuth(false)} />
          <div
            className="relative rounded-2xl p-8 w-full max-w-md border border-[rgba(136,146,176,0.15)]"
            style={{
              background: 'rgba(10, 15, 26, 0.9)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <button
              onClick={() => setShowAuth(false)}
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
              {isLogin ? 'Sign in to manage your agents' : 'Create your account to deploy agents'}
            </p>

            {error && (
              <div className="bg-[rgba(255,77,77,0.15)] text-[#ff4d4d] p-3 rounded-xl mb-4 text-sm border border-[rgba(255,77,77,0.3)]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm text-[#8892b0] mb-1.5">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(136,146,176,0.15)] text-[#f0f4ff] placeholder-[#5a6480] text-sm outline-none transition-all focus:border-[#ff4d4d] focus:shadow-[0_0_0_3px_rgba(255,77,77,0.15)]"
                    placeholder="Your name"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm text-[#8892b0] mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(136,146,176,0.15)] text-[#f0f4ff] placeholder-[#5a6480] text-sm outline-none transition-all focus:border-[#ff4d4d] focus:shadow-[0_0_0_3px_rgba(255,77,77,0.15)]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-[#8892b0] mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(136,146,176,0.15)] text-[#f0f4ff] placeholder-[#5a6480] text-sm outline-none transition-all focus:border-[#ff4d4d] focus:shadow-[0_0_0_3px_rgba(255,77,77,0.15)]"
                  placeholder="Min 8 characters"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,77,0.35)] active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
                style={{
                  fontFamily: '"Clash Display", system-ui, sans-serif',
                  background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)',
                  boxShadow: '0 4px 20px rgba(255,77,77,0.25)',
                }}
              >
                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="text-center mt-4 text-sm text-[#5a6480]">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
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
