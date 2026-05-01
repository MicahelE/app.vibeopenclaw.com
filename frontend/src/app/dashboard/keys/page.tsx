'use client';

import { useEffect, useState } from 'react';
import { getApiKeys, addApiKey, deleteApiKey, testApiKey } from '@/lib/api';
import { PROVIDERS, getProvider } from '@/lib/providers';

interface ApiKey {
  id: string;
  provider: string;
  is_active: boolean;
  created_at: string;
}

interface TestResult {
  ok: boolean;
  model?: string;
  latency_ms?: number;
  detail?: string;
}

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [provider, setProvider] = useState('openai');
  const [keyValue, setKeyValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [testing, setTesting] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});

  async function loadKeys() {
    try {
      setLoading(true);
      const data = await getApiKeys();
      setKeys(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKeys();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await addApiKey(provider, keyValue);
      setKeyValue('');
      loadKeys();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this API key?')) return;
    try {
      await deleteApiKey(id);
      loadKeys();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleTest(id: string) {
    setTesting(id);
    setTestResults((r) => ({ ...r, [id]: { ok: false } }));
    try {
      const res = await testApiKey(id);
      setTestResults((r) => ({ ...r, [id]: res }));
    } catch (err: any) {
      setTestResults((r) => ({ ...r, [id]: { ok: false, detail: err?.message || 'Request failed' } }));
    } finally {
      setTesting(null);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-[#f0f4ff] mb-2" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>API Keys</h1>
      <p className="text-sm text-[#5a6480] mb-6">Bring your own keys for any supported provider. Keys are encrypted at rest with AES-256-GCM.</p>

      {error && (
        <div className="bg-[rgba(255,77,77,0.15)] text-[#ff4d4d] p-3 rounded-xl mb-4 text-sm border border-[rgba(255,77,77,0.3)]">{error}</div>
      )}

      <form onSubmit={handleAdd} className="glass-card rounded-2xl p-6 mb-6 border border-[rgba(136,146,176,0.15)]">
        <h2 className="text-sm font-semibold text-[#f0f4ff] mb-4" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Add New Key</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-[#8892b0] mb-1.5">Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(136,146,176,0.15)] text-[#f0f4ff] text-sm outline-none transition-all focus:border-[#ff4d4d]"
            >
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#0a0f1a]">{p.label}</option>
              ))}
            </select>
            <a
              href={getProvider(provider)?.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1.5 text-[10px] text-[#00e5cc] hover:text-[#00ffd5] transition-colors"
            >
              Get a {getProvider(provider)?.label} key →
            </a>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-[#8892b0] mb-1.5">API Key</label>
            <input
              type="password"
              required
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(136,146,176,0.15)] text-[#f0f4ff] placeholder-[#5a6480] text-sm outline-none transition-all focus:border-[#ff4d4d]"
              placeholder={getProvider(provider)?.placeholder || 'sk-...'}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-4 py-2.5 px-5 rounded-xl text-white font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,77,0.35)] active:translate-y-0 disabled:opacity-50"
          style={{
            fontFamily: '"Clash Display", system-ui, sans-serif',
            background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)',
            boxShadow: '0 4px 20px rgba(255,77,77,0.25)',
          }}
        >
          {saving ? 'Saving...' : 'Add Key'}
        </button>
      </form>

      <div className="glass-card rounded-2xl border border-[rgba(136,146,176,0.15)] overflow-hidden">
        <h2 className="text-sm font-semibold text-[#f0f4ff] p-5 pb-3 border-b border-[rgba(136,146,176,0.15)]" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>Saved Keys</h2>
        {loading ? (
          <div className="p-5 text-center text-[#5a6480] text-sm">Loading...</div>
        ) : keys.length === 0 ? (
          <div className="p-5 text-center text-[#5a6480] text-sm">No API keys saved yet</div>
        ) : (
          <div className="divide-y divide-[rgba(136,146,176,0.1)]">
            {keys.map((k) => {
              const result = testResults[k.id];
              const isTesting = testing === k.id;
              return (
                <div key={k.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap min-w-0">
                    <span className="font-medium text-[#f0f4ff] text-sm capitalize">{k.provider}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${
                      k.is_active ? 'bg-[rgba(0,229,204,0.15)] text-[#00e5cc]' : 'bg-[rgba(136,146,176,0.15)] text-[#8892b0]'
                    }`}>
                      {k.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {isTesting ? (
                      <span className="text-[10px] text-[#5a6480]">Testing…</span>
                    ) : result?.ok ? (
                      <span className="text-[10px] text-[#00e5cc]">
                        ✓ {result.model} · {result.latency_ms}ms
                      </span>
                    ) : result ? (
                      <span className="text-[10px] text-[#ff4d4d] truncate" title={result.detail}>
                        ✗ {result.detail}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleTest(k.id)}
                      disabled={isTesting}
                      className="text-xs text-[#00e5cc] hover:text-[#00ffd5] transition-colors disabled:opacity-50"
                    >
                      {isTesting ? '…' : 'Test'}
                    </button>
                    <button
                      onClick={() => handleDelete(k.id)}
                      className="text-xs text-[#ff4d4d] hover:text-[#ff6b6b] transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
