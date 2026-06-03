// JSON-LD builders for marketing pages. Each returns a plain object you stringify
// into a <script type="application/ld+json">. Matches the inline pattern already used
// in compare/openclaw-vs-hermes/page.tsx.

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';

export interface Faq {
  q: string;
  a: string;
}

export function faqPageLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function serviceLd(opts: {
  name: string;
  description: string;
  path: string;
  lowPrice: number;
  highPrice: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: opts.name,
    provider: { '@type': 'Organization', name: 'VibeOpenClaw', url: SITE_URL },
    areaServed: 'Worldwide',
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: String(opts.lowPrice),
      highPrice: String(opts.highPrice),
      offerCount: '2',
    },
  };
}

export function articleLd(opts: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified || opts.datePublished,
    author: { '@type': 'Organization', name: 'VibeOpenClaw', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'VibeOpenClaw', url: SITE_URL },
  };
}

/** Renders one or more JSON-LD blocks. */
export function jsonLd(...blocks: object[]): string {
  return blocks.map((b) => JSON.stringify(b)).join('');
}
