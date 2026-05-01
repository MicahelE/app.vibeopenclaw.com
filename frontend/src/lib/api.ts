const API_BASE = '';

function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('voc_token');
  }
  return null;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

export async function login(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Login failed' }));
    throw new Error(err.detail);
  }
  return res.json();
}

export async function register(email: string, password: string, name?: string) {
  const params = new URLSearchParams();
  params.append('email', email);
  params.append('password', password);
  if (name) params.append('name', name);
  const res = await fetch(`${API_BASE}/api/auth/register?${params}`, {
    method: 'POST',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
    throw new Error(err.detail);
  }
  return res.json();
}

export async function getMe() {
  return apiFetch('/api/auth/me');
}

export async function getAgents() {
  return apiFetch('/api/agents/');
}

export async function createAgent(data: {
  name: string;
  agent_type: string;
  model_provider?: string;
  model_name?: string;
  telegram_token?: string;
  discord_token?: string;
  slack_token?: string;
}) {
  return apiFetch('/api/agents/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteAgent(id: string) {
  return apiFetch(`/api/agents/${id}`, { method: 'DELETE' });
}

export async function updateAgent(id: string, data: {
  name?: string;
  telegram_bot_token?: string | null;
  discord_bot_token?: string | null;
  slack_bot_token?: string | null;
}) {
  return apiFetch(`/api/agents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function getAgentLogs(id: string, tail = 200): Promise<{ logs: string; tail?: number; detail?: string }> {
  return apiFetch(`/api/agents/${id}/logs?tail=${tail}`);
}

export async function startAgent(id: string) {
  return apiFetch(`/api/agents/${id}/start`, { method: 'POST' });
}

export async function stopAgent(id: string) {
  return apiFetch(`/api/agents/${id}/stop`, { method: 'POST' });
}

export async function getApiKeys() {
  return apiFetch('/api/keys/');
}

export async function addApiKey(provider: string, key: string) {
  const params = new URLSearchParams();
  params.append('provider', provider);
  params.append('key', key);
  return apiFetch(`/api/keys/?${params}`, { method: 'POST' });
}

export async function deleteApiKey(id: string) {
  return apiFetch(`/api/keys/${id}`, { method: 'DELETE' });
}

export async function testApiKey(id: string) {
  return apiFetch(`/api/keys/${id}/test`, { method: 'POST' });
}

export async function createCheckout(plan: string) {
  return apiFetch('/api/billing/checkout', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });
}

export async function createPortal() {
  return apiFetch('/api/billing/portal', { method: 'POST' });
}

export async function getAdminStats() {
  return apiFetch('/api/admin');
}