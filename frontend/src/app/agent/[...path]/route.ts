import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { logProxyCall } from '@/lib/usage';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, params);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, params);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, params);
}

async function proxyRequest(req: NextRequest, paramsPromise: Promise<{ path: string[] }>) {
  const { path } = await paramsPromise;
  const agentId = path[0];
  const subPath = path.slice(1).join('/');
  
  if (!agentId) {
    return NextResponse.json({ detail: 'Agent ID required' }, { status: 400 });
  }
  
  const result = await query(
    'SELECT user_id, status, port, agent_type FROM agents WHERE id = $1',
    [agentId]
  );
  const agent = result.rows[0];

  if (!agent) return NextResponse.json({ detail: 'Agent not found' }, { status: 404 });
  if (agent.status !== 'RUNNING' || !agent.port) {
    return NextResponse.json({ detail: 'Agent is not running' }, { status: 503 });
  }

  void logProxyCall(agent.user_id, agentId);
  
  const targetUrl = `http://localhost:${agent.port}/${subPath}`;
  const url = new URL(req.url);
  const search = url.search;
  
  const forwardHeaders: Record<string, string> = {};
  for (const name of ['content-type', 'accept', 'authorization', 'x-api-key', 'anthropic-version']) {
    const v = req.headers.get(name);
    if (v) forwardHeaders[name] = v;
  }

  try {
    const response = await fetch(targetUrl + search, {
      method: req.method,
      headers: forwardHeaders,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      // @ts-expect-error duplex required for streaming bodies
      duplex: 'half',
    });

    const respHeaders = new Headers();
    response.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (lower === 'content-encoding' || lower === 'content-length' || lower === 'transfer-encoding') return;
      respHeaders.set(key, value);
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: respHeaders,
    });
  } catch (err: any) {
    return NextResponse.json({ detail: `Agent unreachable: ${err.message}` }, { status: 502 });
  }
}
