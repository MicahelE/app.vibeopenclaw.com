# VibeOpenClaw — Project Status & Handoff Guide

> **For the next agent (Claude / opencode / whoever):** read this doc top to bottom before making any changes. The "Critical gotchas" section captures things that took hours to discover and aren't obvious from the code.

## Architecture

- **Full-stack Next.js 16 app** (no separate backend) on `157.151.188.58` (Oracle ARM, 23 GB RAM).
- **Frontend**: Next.js App Router with API routes for auth, agents, billing, keys, admin, usage.
- **Database**: PostgreSQL 16 on the same host (`vibeopenclaw` DB, `voc` user).
- **Docker**: Agent containers (one per user-agent) provisioned via `dockerode` from the Next.js process.
- **Caddy**: Reverse proxy giving HTTPS at `app.vibeopenclaw.com` → `localhost:3000`.

### Server layout

- `voc-frontend.service` — Next.js standalone, port 3000, **enabled**.
- `voc-backend.service` — disabled (FastAPI is gone).
- `/opt/vibeopenclaw/frontend/` — git checkout of this repo.
- `/opt/vibeopenclaw/frontend/frontend/.env` — runtime env vars.
- `/opt/vibeopenclaw/data/agents/<agentId>/` — per-agent state (chmod 0o777 by `docker.ts`).
- `/opt/vibeopenclaw/data/openclaw-plugin-cache/` — shared OpenClaw plugin runtime deps cache (~150 MB), bind-mounted into every OpenClaw container.

### Database schema

- `users(id, email, password_hash, name, plan_tier {PRO|PREMIUM}, subscription_status, polar_customer_id, ...)`
- `agents(id, user_id, name, agent_type {OPENCLAW|HERMES}, status {CREATING|RUNNING|STOPPED|ERROR|DELETED}, container_id, container_name, port, model_provider, model_name, telegram_bot_token, discord_bot_token, slack_bot_token, ...)`
- `api_keys(id, user_id, provider, encrypted_key, is_active, created_at)` — AES-256-GCM via `lib/encrypt.ts`.
- `usage_logs(id, user_id, agent_id, date, messages_sent, api_calls, input_tokens, output_tokens, total_tokens)` — one row per proxy call (no aggregation at write time, summed at read time).

### Plan limits (current — `api/agents/route.ts:8`)

- **Pro**: 1 agent, 2 GB RAM (matches OpenClaw's documented minimum).
- **Premium**: 3 agents, 4 GB RAM each (matches "comfortable production" recommendation).

If you change these, also update the marketing copy in `app/page.tsx`, `app/dashboard/billing/page.tsx`, and the JSON-LD Offer + FAQPage in `app/layout.tsx`.

---

## What got built

The Sept-2026 / April-2026 work cycle shipped **18 PRs**. Highlights you should know are live:

- **12-provider BYOK** with config in `lib/providers.ts` (OpenAI, Anthropic, Google, Groq, xAI, Mistral, DeepSeek, Together, Fireworks, Perplexity, OpenRouter, Cohere). Each has an `openclawApi` + `openclawBaseUrl` for OpenClaw's `pi-ai` adapter routing, and a `hermesProvider` for Hermes' inference taxonomy.
- **OpenClaw config seeding**: `docker.ts` writes `${agentDir}/openclaw.json` with `models.providers` + `agents.defaults.model.primary` before container start, then bind-mounts `${agentDir}` to `/home/node/.openclaw`. Plus a shared plugin cache at `/opt/vibeopenclaw/data/openclaw-plugin-cache` so the second OpenClaw container onwards starts in seconds instead of ~90s.
- **Hermes config seeding**: writes `${agentDir}/config.yaml` with `model.default` + `model.provider` (+ `base_url`/`api_key` for `custom`). Hermes containers run `gateway run` only — **no public HTTP exposure** because the Hermes dashboard would expose key management. `HERMES_UID=1001`/`HERMES_GID=1001` chowns the bind cleanly.
- **Status reconciler** in `instrumentation.ts` → `lib/reconciler.ts`: every 30s, reconciles `agents.status` against actual Docker state. Marks `ERROR` if the container is missing, exited non-zero, or flapping (RestartCount ≥ 3 or `State.Restarting`).
- **Streaming agent proxy** at `/agent/[...path]/`: forwards request body + selected headers (content-type, accept, authorization, x-api-key, anthropic-version), streams response body straight through (no buffering), strips content-encoding/content-length/transfer-encoding from the response.
- **Usage tracking**: `/agent/[...path]/` does fire-and-forget `INSERT INTO usage_logs (api_calls=1)` on every proxied request.
- **Admin dashboard** at `/admin`: gated by `ADMIN_EMAILS` env var (defaults to `imohgenius@yahoo.com`). Stat cards (users, calls 24h, agents active/errored, keys), three breakdown panels, recent-agents table with **live container status + restart count** (red+bold at flap threshold), top users by API calls last 7 days. Auto-refreshes every 15s.
- **Agent detail page**: rename inline (click name → input → Save), expandable channel sections per platform with paste-to-add / Disconnect (token change redeploys the container with refreshed env), collapsible "Container logs" section (stdout+stderr, 200-line tail, optional 5s auto-refresh), agent endpoint URL when the agent has a port.
- **API keys page**: add key + "Test" button per saved key (fires a 4-token probe at the provider's chat/completions or messages endpoint, returns ✓ model · latency or ✗ HTTP error).
- **Wizard at `/dashboard/agents/new`**: 4 steps. The "no channels connected" warning text branches by agent type — Hermes users see "your agent will sit idle until you add a token" since Hermes has no HTTP endpoint.
- **Rate limiting** (`lib/rate-limit.ts`) on `/api/auth/login` (10/min IP), `/api/auth/register` (5/h IP), `POST /api/agents` (10/h user), `/agent/[...path]` (120/min per agent+IP). In-memory; swap to Redis if the app ever runs across workers.
- **og:image** at `/opengraph-image` (Next.js convention) — auto-injected into every page's meta.
- **JSON-LD** SoftwareApplication + FAQPage schemas in `app/layout.tsx`. Keep the RAM/pricing strings in sync with `PLAN_LIMITS` if you change either.

---

## Critical gotchas (read these first)

1. **Master gets force-pushed by the deploy workflow.** `.github/workflows/deploy.yml` does `git reset --hard origin/master` on the server. If you push from a stale local clone, things break. Always `git fetch && git reset --hard origin/master` if your local can't fast-forward.

2. **The mode `0o777` on `agentDir`** in `docker.ts` is intentional — host's voc-frontend runs as `ubuntu` (uid 1001) but OpenClaw's container user is `node` (uid 1000). They don't match, and we can't `chown` to a uid that doesn't exist on the host. Single-tenant box, encrypted keys live in postgres, so the dir-mode opening is acceptable. If you ever go multi-tenant, fix this with a privileged init container that chowns properly.

3. **OpenClaw and Hermes have completely different config systems.** Don't try to unify them with a single env-var pass-through; both have file-based registries that we pre-seed before container start. See `writeOpenclawConfig` and `writeHermesConfig` in `lib/docker.ts`.

4. **Hermes' oneshot CLI (`hermes -z "prompt"`) silently exits with no output** for both the `custom` and `openrouter` provider paths — it saves the user message to a session JSON but no assistant response. This is an upstream bug in `run_agent.py:13383` (`KeyError: 'final_response'`). Real messaging traffic through `gateway run` works correctly; the CLI doesn't. Don't waste a day debugging this — file an issue at `nousresearch/hermes-agent` if it's not already known.

5. **Auth flow has a quirk you'll trip over.** `useAuth().user` was previously a UUID string (the auth provider stored `user_id` as the user object). PR #6 fixed it to fetch `/api/auth/me` after login and store the real User object. If you see `user.email` returning undefined somewhere, suspect a stale localStorage entry — `localStorage.removeItem('voc_user')` fixes it.

6. **The `/agent/[...path]` proxy is unauthed.** It looks up by agent UUID, no JWT check. The UUID acts as a weak shared secret. Rate-limited at 120/min per (agentId, IP) but if you need real auth, that's a future PR.

7. **Caddy fronts everything on port 3000.** Don't add another listener; route through Next.js routes.

8. **The `voc-frontend` service is `enabled` and managed by systemd.** After config or .env changes, `sudo systemctl restart voc-frontend`. The service runs Next.js standalone build (`output: 'standalone'` in `next.config.ts`).

---

## Local development

```bash
cd frontend
npm install
npm run dev     # http://localhost:3000, talks to local Postgres if DB_HOST=localhost in .env.local
```

Create `.env.local` from `.env.example`. The reconciler runs on `npm run dev` too (instrumentation.ts) — set `VOC_DISABLE_RECONCILER=1` to opt out for tests.

---

## Deployment

`git push origin master` → GitHub Actions builds + SSH-deploys. The workflow at `.github/workflows/deploy.yml`:

1. `npm ci && npm run build` smoke test on the runner
2. SSH to the server, `git reset --hard origin/master` in `/opt/vibeopenclaw/frontend`, `npm ci && npm run build`, `sudo systemctl restart voc-frontend`

### Server `.env` (`/opt/vibeopenclaw/frontend/frontend/.env`)

Already populated:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vibeopenclaw
DB_USER=voc
DB_PASSWORD=<set>
JWT_SECRET=<set>
ENCRYPTION_KEY=<set>
POLAR_ENVIRONMENT=<set>
POLAR_ACCESS_TOKEN=<set>
POLAR_PRODUCT_PRO=<set>
POLAR_PRODUCT_PREMIUM=<set>
POLAR_WEBHOOK_SECRET=<set>
NEXT_PUBLIC_APP_URL=https://app.vibeopenclaw.com
AGENT_NETWORK=voc-agents
DATA_DIR=/opt/vibeopenclaw/data/agents
OPENCLAW_IMAGE=ghcr.io/openclaw/openclaw:latest
HERMES_IMAGE=hermes-agent:latest
```

Optional overrides not yet set:
- `ADMIN_EMAILS` — comma-separated allowlist (defaults to `imohgenius@yahoo.com`)
- `OPENCLAW_PLUGIN_CACHE` — defaults to `/opt/vibeopenclaw/data/openclaw-plugin-cache`
- `VOC_DISABLE_RECONCILER=1` — disable the 30s status reconciler

### Useful commands

```bash
sudo systemctl status voc-frontend
sudo systemctl restart voc-frontend
sudo journalctl -u voc-frontend -f                          # tail app logs
docker ps --filter name=voc-agent                           # list agent containers
docker stats --no-stream                                    # live mem/cpu per agent
sudo -u postgres psql -d vibeopenclaw                       # DB shell
sudo -u postgres psql -d vibeopenclaw -c "SELECT email, plan_tier FROM users ORDER BY created_at DESC LIMIT 10;"
```

---

## Hermes Docker image

The Nous Research Hermes agent has no published image. We build from source on the server:

```bash
docker build -t hermes-agent:latest https://github.com/NousResearch/hermes-agent.git#main
```

The image is **8.18 GB** as built. Most of that is justified by the full Python ML stack + Playwright Chromium + Camoufox stealth-browser cache. You can recover ~2 GB by `rm -rf /tmp/camoufox-* /root/.cache/camoufox` in a downstream Dockerfile if you want, but it's not pressing.

---

## Open work — what to do next

Priorities in order. Each is roughly self-contained.

### High value, code-only

1. **Anthropic + Google E2E test pass.** We've verified Groq + OpenRouter end-to-end through Hermes but haven't done a full e2e chat completion through OpenClaw with Anthropic or Google. Likely works (config writer handles the right `openclawApi`) but worth confirming. Use the Playwright MCP (`mcp__playwright__*`) tools — `claude-in-chrome` should not be used for tests in this repo.

2. **Token-count tracking in usage_logs.** The fire-and-forget INSERT in `lib/usage.ts` writes `api_calls=1` only. Inspecting streaming responses to extract input/output tokens needs a streaming-aware parser in `/agent/[...path]/route.ts` — read the response chunks as they pass through, parse SSE for OpenAI-compat / NDJSON for Anthropic, and update the row at end of stream. ~half a day.

3. **Add the user-side "calls last 7 days" panel to the billing page.** Admin already has it; users would benefit from seeing their own. Reuse the `/api/admin` query pattern, drop the admin gate, scope by `user_id`.

4. **Password reset / forgot-password flow.** Currently zero way to recover an account. Standard email-link reset; `lib/jwt.ts` already has the primitives. Polar billing emails are already going out, so adding a transactional send isn't blocked on infra.

5. **Replace localhost-fetch in /agent proxy with docker network resolution.** `getContainerPort` finds the host port; we then `fetch http://localhost:<port>`. Fine for now, but mounting via the agent network IP would be cleaner and stops needing host port bindings.

### Medium value

6. **Hermes Dockerfile-on-top to reclaim ~2 GB.** A 5-line Dockerfile in this repo that does `FROM hermes-agent:latest` + `RUN rm -rf /tmp/camoufox-* /root/.cache/camoufox /usr/share/doc /usr/share/man /var/cache/apt`. Reduces image to ~6 GB, no feature impact.

7. **Patch the upstream Hermes oneshot bug** (or pin a Hermes version that doesn't have it) so users have a working CLI inside their containers. Currently real messaging traffic works but `hermes -z` does not.

8. **Channel webhook validation.** Hermes' messaging gateway accepts Telegram/Discord/Slack tokens at face value. If a token is wrong, the gateway logs a warning but the agent appears RUNNING. Validate tokens at the wizard step before deploy (call Telegram `getMe`, Discord `users/@me`, Slack `auth.test`).

9. **Restart count on the user-facing detail page.** Admin shows it; users don't. Add a `/api/agents/[id]/inspect` endpoint that returns the live container status (or extend the existing `/api/agents/[id]` GET to include it consistently — the field is there but the detail page reads from the list endpoint).

10. **JWT lifetime + refresh tokens.** Tokens currently last forever. Move to short-lived access tokens + refresh-token endpoint.

### Operations / infra (won't fit in a code-only PR)

11. **Backups.** Postgres has every user, agent, key. Nightly `pg_dump` to S3/B2 or another off-host destination. ~$0.50/mo. Without this, a single drive failure ends the business.
12. **Monitoring/alerting.** When `voc-frontend` goes down or an agent ERRORs, no one knows. Healthcheck.io / BetterStack URL ping every minute, plus a webhook into Slack/email when status changes.
13. **Multi-host scaling.** Caddy + Next.js + Postgres + every agent on one VM. If a noisy agent saturates CPU, everything goes. Long term: separate the agent execution plane onto worker hosts and add an internal Docker daemon RPC.

---

## Memory aid for whoever continues

- The wizard at `/dashboard/agents/new` is 4 steps; if you change wording, also branch the warning by agent type.
- The reconciler tags `RUNNING` containers with `RestartCount >= 3` as `ERROR`. If you change the flap threshold, also update the admin table cell coloring (currently `>= 3` triggers red+bold).
- `getContainerStatus` returns `restart_count` since the og-image PR. Don't break it.
- All paths that do per-agent docker inspect have a try/catch and return `null` on failure — the admin page handles that cleanly.
- `instrumentation.ts` is a Next.js convention for boot hooks. Don't rename it; it's auto-discovered.
- The Cohere provider uses Cohere's OpenAI-compat endpoint (`api.cohere.com/compatibility/v1`) because pi-ai has no native Cohere adapter.
- `OPENCLAW_PLUGIN_CACHE` is shared read-write across all OpenClaw containers — any of them can populate it. First fresh boot still pays the install cost; thereafter all read the cache.

If something here is wrong, fix this doc in the same PR as your code change. It's the only contract between contributors.
