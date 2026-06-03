// Competitor "alternative" pages: /openclaw-hosting/alternatives/[slug].
// CONSERVATIVE accuracy: state only facts we're confident about; where unsure,
// describe generically ("a managed OpenClaw host") rather than inventing specifics.
// xCloud and MyClaw have their own bespoke pages and are intentionally excluded here.

export interface Alternative {
  slug: string;
  name: string;
  url: string;
  /** A confident, non-fabricated one-liner about the competitor. */
  known: string;
  /** Honest "consider an alternative if…" angle. */
  switchReason: string;
}

export const ALTERNATIVES: Alternative[] = [
  {
    slug: 'kilocaw', name: 'KiloClaw', url: 'https://kilo.ai/kiloclaw',
    known: 'KiloClaw is a managed OpenClaw host that emphasizes strong tenant isolation (microVM boundaries), encrypted credential storage, and a fast, no-SSH setup.',
    switchReason: 'you want a managed OpenClaw host that also runs Hermes, with per-agent Docker isolation and AES-256-GCM key encryption under simple flat pricing.',
  },
  {
    slug: 'ampere', name: 'Ampere', url: 'https://ampere.sh',
    known: 'Ampere is a managed OpenClaw host positioned for beginners and non-technical users, with a fast guided deploy.',
    switchReason: 'you want the same hands-off experience but with both OpenClaw and Hermes, explicit Docker isolation, and BYOK with no inference markup.',
  },
  {
    slug: 'getclawhosting', name: 'GetClawHosting', url: 'https://getclawhosting.com',
    known: 'GetClawHosting is a managed OpenClaw host that has offered a free trial to get started.',
    switchReason: 'you want a managed host that runs both agents with per-agent Docker isolation and encrypted keys, and pay only for the model usage you bring (BYOK, no markup).',
  },
  {
    slug: 'oneclaw', name: 'OneClaw', url: 'https://www.oneclaw.net',
    known: 'OneClaw is a budget-friendly managed OpenClaw host known for a low entry price, a mobile management app, templates, and a built-in firewall.',
    switchReason: 'you want to run Hermes as well as OpenClaw, with explicit per-agent Docker isolation and AES-256-GCM key encryption, and don’t mind a slightly higher entry price for that.',
  },
  {
    slug: 'elestio', name: 'Elestio', url: 'https://elest.io',
    known: 'Elestio is a managed hosting platform for open-source software that can run OpenClaw among many other apps.',
    switchReason: 'you want a host purpose-built for AI agents — both OpenClaw and Hermes — with one-click agent deploys, per-agent isolation, and BYOK rather than a general open-source app platform.',
  },
];

export function getAlternative(slug: string): Alternative | undefined {
  return ALTERNATIVES.find((a) => a.slug === slug);
}
