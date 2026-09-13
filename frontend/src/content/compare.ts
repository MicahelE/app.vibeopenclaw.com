// Single source of truth for the /compare/* pages (which are hand-written,
// not templated — see AGENTS.md / programmatic-seo analysis). Used by the
// /compare hub page and sitemap.ts so both stay in sync automatically.

export interface ComparePage {
  slug: string;
  title: string;
}

export const COMPARE_PAGES: ComparePage[] = [
  { slug: 'vibeopenclaw-vs-xcloud', title: 'VibeOpenClaw vs xCloud' },
  { slug: 'vibeopenclaw-vs-myclaw', title: 'VibeOpenClaw vs MyClaw' },
  { slug: 'vibeopenclaw-vs-oneclaw', title: 'VibeOpenClaw vs OneClaw' },
  { slug: 'vibeopenclaw-vs-digitalocean', title: 'VibeOpenClaw vs DigitalOcean' },
  { slug: 'vibeopenclaw-vs-railway', title: 'VibeOpenClaw vs Railway' },
  { slug: 'vibeopenclaw-vs-hostinger', title: 'VibeOpenClaw vs Hostinger' },
  { slug: 'openclaw-vs-hermes', title: 'OpenClaw vs Hermes' },
  { slug: 'openclaw-vs-big-tech-ai-agents', title: 'OpenClaw vs Meta Muse, Gemini Spark & Grok Bot' },
  { slug: 'openclaw-vs-grok-bot', title: 'OpenClaw vs Grok Bot' },
  { slug: 'openclaw-vs-meta-muse', title: 'OpenClaw vs Meta Muse' },
  { slug: 'openclaw-vs-gemini-spark', title: 'OpenClaw vs Google Gemini Spark' },
];
