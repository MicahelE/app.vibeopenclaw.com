import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { decrypt } from '@/lib/encrypt';
import { getProvider, ProviderConfig } from '@/lib/providers';

const TIMEOUT_MS = 15000;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ ok: false, detail: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  const result = await query(
    'SELECT id, provider, encrypted_key FROM api_keys WHERE id = $1 AND user_id = $2',
    [id, user.id]
  );
  const row = result.rows[0];
  if (!row) return NextResponse.json({ ok: false, detail: 'Key not found' }, { status: 404 });

  const cfg = getProvider(row.provider);
  if (!cfg) return NextResponse.json({ ok: false, detail: `Unknown provider: ${row.provider}` }, { status: 400 });

  let plaintext: string;
  try {
    plaintext = decrypt(row.encrypted_key);
  } catch {
    return NextResponse.json({ ok: false, detail: 'Could not decrypt stored key' }, { status: 500 });
  }

  const start = Date.now();
  try {
    const probe = await runProbe(cfg, plaintext);
    return NextResponse.json({
      ok: true,
      provider: cfg.id,
      model: probe.model,
      latency_ms: Date.now() - start,
    });
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      provider: cfg.id,
      latency_ms: Date.now() - start,
      detail: err?.message || 'Probe failed',
    });
  }
}

async function runProbe(cfg: ProviderConfig, key: string): Promise<{ model: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    if (cfg.openclawApi === 'anthropic-messages') {
      const model = cfg.models[0];
      const res = await fetch(`${cfg.openclawBaseUrl}/v1/messages`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model,
          max_tokens: 4,
          messages: [{ role: 'user', content: 'Reply with the digit 1' }],
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await truncatedBody(res)}`);
      return { model };
    }

    const baseUrl = cfg.openclawApi === 'google-generative-ai'
      ? `${cfg.openclawBaseUrl}/v1beta/openai`
      : cfg.openclawBaseUrl;
    const model = cfg.models[0];
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        'content-type': 'application/json',
        'user-agent': 'voc-key-test/1.0',
      },
      body: JSON.stringify({
        model,
        max_tokens: 4,
        messages: [{ role: 'user', content: 'Reply with the digit 1' }],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await truncatedBody(res)}`);
    return { model };
  } finally {
    clearTimeout(timer);
  }
}

async function truncatedBody(res: Response): Promise<string> {
  try {
    const text = await res.text();
    return text.slice(0, 200);
  } catch {
    return res.statusText;
  }
}
