# VibeOpenClaw — Project Status & Setup Guide

## What Has Been Done

### Architecture
- **Full-stack Next.js app** (no separate backend) running on the server at `157.151.188.58`
- Frontend: Next.js App Router with API routes handling auth, agents, billing, API keys
- Database: PostgreSQL 16 on the same server (`vib openclaw` DB, `voc` user)
- Docker: Agent containers managed via `dockerode` from the Next.js process
- Caddy: Reverse proxy providing HTTPS on `app.vibeopenclaw.com`

### Server Setup
- **Frontend service**: `voc-frontend` systemd unit running Next.js standalone on port 3000
- **Backend service**: `voc-backend` systemd unit exists but is **disabled** (FastAPI backend was removed — all logic is now in Next.js)
- **Database**: PostgreSQL 16, database `vibeopenclaw`, user `voc`, password in `.env`
- **.env file**: `/opt/vibeopenclaw/frontend/frontend/.env` with all env vars including `JWT_SECRET`, `ENCRYPTION_KEY`, Docker image names
- **Caddy**: Configured to reverse proxy `app.vibeopenclaw.com` → `localhost:3000`

### Key Migrations Completed
1. **Stripe → Polar.sh**: Frontend billing routes use `@polar-sh/sdk`. Backend Stripe code removed entirely. Polar credentials (`POLAR_ACCESS_TOKEN`, etc.) still need to be added to `.env`.
2. **FastAPI backend removed**: All backend code deleted from repo. The Python backend was redundant — Next.js handles everything.
3. **Playwright e2e tests removed**: No `@playwright/test` dependency. Testing done via Playwright MCP browser.
4. **PostgreSQL enum casing fixed**: All queries now use UPPERCASE enum values (`RUNNING`, `DELETED`, `OPENCLAW`, `PRO`, etc.) matching the PostgreSQL enum types.
5. **API key encryption**: Keys are now encrypted/decrypted with AES-256-GCM in Node.js (`src/lib/encrypt.ts`). Old Fernet-encrypted keys from the Python backend are effectively lost — users must re-enter them.
6. **OpenClaw agent deployment**: Uses the official `ghcr.io/openclaw/openclaw:latest` Docker image instead of inline stub commands. Includes health check polling (`/healthz`) and auto-image-pull.
7. **Hermes agent deployment**: Configured to use `hermes-agent:latest` Docker image (must be built from source — see below).

### Database Schema
- `users` table: `id`, `email`, `password_hash`, `name`, `plan_tier` (PRO/PREMIUM), `subscription_status`, `polar_customer_id`, timestamps
- `agents` table: `id`, `user_id`, `name`, `agent_type` (OPENCLAW/HERMES), `status` (CREATING/RUNNING/STOPPED/ERROR/DELETED), `container_id`, `container_name`, `port`, `model_provider`, `model_name`, channel tokens, timestamps
- `api_keys` table: `id`, `user_id`, `provider`, `encrypted_key` (AES-256-GCM), `is_active`, `created_at`
- `usage_logs` table: `id`, `user_id`, `agent_id`, `date`, `messages_sent`, `api_calls`, token counts

### SEO
- Title: "VibeOpenClaw — Host and Deploy AI Agents | OpenClaw & Hermes Managed SaaS"
- Meta description, keywords (24 SEO terms), Open Graph, Twitter Cards, canonical URL
- JSON-LD structured data: SoftwareApplication + FAQPage schemas
- robots.txt and sitemap.xml via Next.js metadata route handlers

---

## Local Development

```bash
cd frontend
npm install
npm run dev
```

Create a `.env.local` file (see `.env.example` for reference).

---

## Deployment

Pushing to `master` triggers GitHub Actions (`.github/workflows/deploy.yml`) which:
1. Runs `npm ci` + `npm run build` as a smoke test on the runner
2. SSHes to the server, pulls the latest code, runs `npm ci` + `npm run build`, and restarts the `voc-frontend` service

### Server .env File
Located at `/opt/vibeopenclaw/frontend/frontend/.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vibeopenclaw
DB_USER=voc
DB_PASSWORD=YOUR_DB_PASSWORD
JWT_SECRET=<generated-hex>
ENCRYPTION_KEY=<generated-base64>
POLAR_ACCESS_TOKEN=          # <-- NEEDS TO BE ADDED
POLAR_PRODUCT_PRO=           # <-- NEEDS TO BE ADDED
POLAR_PRODUCT_PREMIUM=      # <-- NEEDS TO BE ADDED
POLAR_WEBHOOK_SECRET=       # <-- NEEDS TO BE ADDED
NEXT_PUBLIC_APP_URL=https://app.vibeopenclaw.com
AGENT_NETWORK=voc-agents
DATA_DIR=/opt/vibeopenclaw/data/agents
OPENCLAW_IMAGE=ghcr.io/openclaw/openclaw:latest
HERMES_IMAGE=hermes-agent:latest
```

### SSH Access
```bash
ssh ubuntu@157.151.188.58
```

### Useful Server Commands
```bash
# Check service status
sudo systemctl status voc-frontend

# Restart frontend
sudo systemctl restart voc-frontend

# View logs
sudo journalctl -u voc-frontend -f

# Check running Docker containers
docker ps --filter name=voc-agent

# Pull latest OpenClaw image
docker pull ghcr.io/openclaw/openclaw:latest

# Database queries
sudo -u postgres psql -d vibeopenclaw -c "SELECT id, email, plan_tier FROM users;"
```

---

## Hermes Agent Docker Image

The Hermes agent doesn't have a pre-built Docker image. It must be built from source:

```bash
# On the server:
docker build -t hermes-agent:latest https://github.com/NousResearch/hermes-agent.git#main
```

This builds a ~1.5GB image. The build was started on the server but may need to be checked:
```bash
# Check if build is still running
ps aux | grep "docker build"

# Check if image exists
docker images hermes-agent
```

---

## Polar.sh Setup (Still Needed)

1. Create a Polar.sh account at https://polar.sh
2. Create two products: Pro ($60/mo) and Premium ($100/mo)
3. Get your access token and webhook secret from Polar.sh dashboard
4. Add the credentials to the server `.env` file:
   ```bash
   ssh ubuntu@157.151.188.58
   nano /opt/vibeopenclaw/frontend/frontend/.env
   # Add: POLAR_ACCESS_TOKEN=polar_pat_...
   # Add: POLAR_PRODUCT_PRO=<product-id>
   # Add: POLAR_PRODUCT_PREMIUM=<product-id>
   # Add: POLAR_WEBHOOK_SECRET=whsec_...
   sudo systemctl restart voc-frontend
   ```

---

## Known Issues / TODO

- [x] Add Polar.sh credentials to server `.env` (sandbox mode configured)
- [ ] Build Hermes Docker image on server (buildx installed, build in progress)
- [ ] Add `POLAR_WEBHOOK_SECRET` to server `.env` (needed for billing webhooks)
- [ ] Add `og:image` for social sharing (currently no image)
- [ ] The dashboard pages (`/dashboard/*`) are client-rendered — consider adding SSR for better SEO if they need to be indexed