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
];
