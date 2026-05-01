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
  
  try {
    const response = await fetch(targetUrl + search, {
      method: req.method,
      headers: {
        'Content-Type': req.headers.get('content-type') || 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.arrayBuffer() : undefined,
      // @ts-ignore
      duplex: 'half',
    });
    
    const body = await response.arrayBuffer();
    return new NextResponse(body, {
      status: response.status,
      headers: Object.fromEntries(response.headers),
    });
  } catch (err: any) {
    return NextResponse.json({ detail: `Agent unreachable: ${err.message}` }, { status: 502 });
  }
}
