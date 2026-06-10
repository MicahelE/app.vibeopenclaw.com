'use client';

import { useEffect, useState } from 'react';
import { getApiKeys, addApiKey, deleteApiKey, testApiKey } from '@/lib/api';
import { PROVIDERS, getProvider } from '@/lib/providers';
import { Button, Select, PasswordInput, Badge, EmptyState, ConfirmDialog, useToast, FONT_DISPLAY } from '@/components/ui';
import { capture } from '@/lib/analytics';

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
  const { success, error: toastError } = useToast();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [provider, setProvider] = useState('openai');
  const [keyValue, setKeyValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadKeys() {
    try {
      setLoading(true);
      const data = await getApiKeys();
      setKeys(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to load keys');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKeys();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await addApiKey(provider, keyValue);
      setKeyValue('');
      capture('apikey_added', { provider });
      success(`${getProvider(provider)?.label || provider} key added`);
      loadKeys();
    } catch (err: any) {
      toastError(err.message || 'Failed to add key');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await deleteApiKey(confirmId);
      success('API key deleted');
      setConfirmId(null);
      loadKeys();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete key');
    } finally {
      setDeleting(false);
    }
  }

  async function handleTest(id: string) {
    setTesting(id);
    setTestResults((r) => ({ ...r, [id]: { ok: false } }));
    try {
      const res = await testApiKey(id);
      setTestResults((r) => ({ ...r, [id]: res }));
      capture('apikey_tested', { ok: res.ok });
      if (res.ok) success(`Key works — ${res.model} (${res.latency_ms}ms)`);
      else toastError(res.detail || 'Key test failed');
    } catch (err: any) {
      setTestResults((r) => ({ ...r, [id]: { ok: false, detail: err?.message || 'Request failed' } }));
      toastError(err?.message || 'Key test failed');
    } finally {
      setTesting(null);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-[#f0f4ff] mb-2" style={{ fontFamily: FONT_DISPLAY }}>
        API Keys
      </h1>
      <p className="text-sm text-[#5a6480] mb-6">
        Bring your own keys for any supported provider. Keys are encrypted at rest with AES-256-GCM.
      </p>

      <form onSubmit={handleAdd} className="glass-card rounded-2xl p-6 mb-6 border border-[rgba(136,146,176,0.15)]">
        <h2 className="text-sm font-semibold text-[#f0f4ff] mb-4" style={{ fontFamily: FONT_DISPLAY }}>
          Add New Key
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Select
            label="Provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            hint={
              <a
                href={getProvider(provider)?.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00e5cc] hover:text-[#00ffd5] transition-colors"
              >
                Get a {getProvider(provider)?.label} key →
              </a>
            }
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#0a0f1a]">
                {p.label}
              </option>
            ))}
          </Select>
          <div className="md:col-span-2">
            <PasswordInput
              label="API Key"
              required
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              placeholder={getProvider(provider)?.placeholder || 'sk-...'}
              className="ph-no-capture"
            />
          </div>
        </div>
        <Button type="submit" loading={saving} className="mt-4">
          {saving ? 'Saving…' : 'Add Key'}
        </Button>
      </form>

      <div className="glass-card rounded-2xl border border-[rgba(136,146,176,0.15)] overflow-hidden">
        <h2 className="text-sm font-semibold text-[#f0f4ff] p-5 pb-3 border-b border-[rgba(136,146,176,0.15)]" style={{ fontFamily: FONT_DISPLAY }}>
          Saved Keys
        </h2>
        {loading ? (
          <div className="p-5 space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-5 rounded bg-[rgba(136,146,176,0.12)] animate-pulse" />
            ))}
          </div>
        ) : keys.length === 0 ? (
          <div className="p-5">
            <p className="text-center text-[#8892b0] text-sm">No API keys saved yet. Add at least one to create agents.</p>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(136,146,176,0.1)]">
            {keys.map((k) => {
              const result = testResults[k.id];
              const isTesting = testing === k.id;
              return (
                <div key={k.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap min-w-0">
                    <span className="font-medium text-[#f0f4ff] text-sm capitalize">{k.provider}</span>
                    <Badge tone={k.is_active ? 'cyan' : 'gray'}>{k.is_active ? 'Active' : 'Inactive'}</Badge>
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
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => handleTest(k.id)}
                      disabled={isTesting}
                      className="text-xs text-[#00e5cc] hover:text-[#00ffd5] transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:underline"
                    >
                      {isTesting ? '…' : 'Test'}
                    </button>
                    <button
                      onClick={() => setConfirmId(k.id)}
                      className="text-xs text-[#ff4d4d] hover:text-[#ff6b6b] transition-colors focus-visible:outline-none focus-visible:underline"
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

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete API key?"
        body="Agents using this provider key will stop working until you add another."
        confirmLabel="Delete key"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
