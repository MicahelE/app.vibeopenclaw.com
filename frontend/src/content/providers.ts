// Competitor comparison data for listicle / "vs" / alternative pages.
// Figures are sourced from each provider's public pricing/marketing pages as of
// June 2026. Re-verify before major edits — prices drift. Keep claims defensible:
// where a detail is uncertain, say "varies" rather than inventing a number.

export interface Provider {
  id: string;
  name: string;
  url: string;
  /** Entry monthly price as a display string. */
  fromPrice: string;
  /** One-line positioning. */
  blurb: string;
  hostsOpenClaw: boolean;
  hostsHermes: boolean;
  /** True BYOK with no inference markup. */
  byokNoMarkup: boolean;
  /** Per-agent container/VM isolation. */
  isolation: string;
  channels: string;
  /** Where they sit vs us — used for honest positioning. */
  note: string;
}

// Us first; competitors follow. `self` flag marks our own row for highlight styling.
export const VIBEOPENCLAW: Provider = {
  id: 'vibeopenclaw',
  name: 'VibeOpenClaw',
  url: 'https://app.vibeopenclaw.com',
  fromPrice: '$24/mo',
  blurb: 'Managed hosting for both OpenClaw and Hermes with true BYOK and per-agent Docker isolation.',
  hostsOpenClaw: true,
  hostsHermes: true,
  byokNoMarkup: true,
  isolation: 'Per-agent Docker container',
  channels: 'Telegram, Discord, Slack',
  note: 'Only managed host that runs both OpenClaw and Hermes, with keys encrypted at rest (AES-256-GCM) and no markup on inference.',
};

export const COMPETITORS: Provider[] = [
  {
    id: 'xcloud',
    name: 'xCloud',
    url: 'https://xcloud.host/openclaw-hosting/',
    fromPrice: '$24/mo',
    blurb: 'VPS-based managed hosting (WordPress/Laravel/n8n/OpenClaw) with a 5-minute deploy.',
    hostsOpenClaw: true,
    hostsHermes: true,
    byokNoMarkup: true,
    isolation: 'Dedicated VPS',
    channels: 'Telegram, WhatsApp, Slack, Discord',
    note: 'Broad host (also WordPress/Laravel). Prices scale with VPS size up to ~$225/mo. Strong trust signals (Trustpilot, 30+ locations).',
  },
  {
    id: 'myclaw',
    name: 'MyClaw.ai',
    url: 'https://myclaw.ai/',
    fromPrice: '$19/mo',
    blurb: 'OpenClaw-focused managed hosting with isolated containers and one-click deploy.',
    hostsOpenClaw: true,
    hostsHermes: false,
    byokNoMarkup: true,
    isolation: 'Isolated container',
    channels: 'Telegram, WhatsApp, Slack, Discord',
    note: 'OpenClaw-only. Three tiers ($19/$39/$79). No Hermes option.',
  },
  {
    id: 'oneclaw',
    name: 'OneClaw',
    url: 'https://www.oneclaw.net/',
    fromPrice: '$9.99/mo',
    blurb: 'Budget OpenClaw host with a mobile management app, templates, and built-in firewall.',
    hostsOpenClaw: true,
    hostsHermes: false,
    byokNoMarkup: true,
    isolation: 'Managed instance',
    channels: 'Telegram, Discord',
    note: 'Cheapest entry. OpenClaw-only; lighter on enterprise controls.',
  },
  {
    id: 'diy-vps',
    name: 'DIY VPS (Hetzner/Contabo)',
    url: 'https://www.hetzner.com/cloud',
    fromPrice: '$5–15/mo',
    blurb: 'Rent a raw VPS and self-host OpenClaw with Docker, SSH, and your own ops.',
    hostsOpenClaw: true,
    hostsHermes: true,
    byokNoMarkup: true,
    isolation: 'Whatever you configure',
    channels: 'Whatever you wire up',
    note: 'Cheapest sticker price, highest time cost: you own Docker, SSL, patching, backups, monitoring, and 24/7 uptime.',
  },
];

export const ALL_PROVIDERS: Provider[] = [VIBEOPENCLAW, ...COMPETITORS];
