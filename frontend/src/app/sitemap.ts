import { MetadataRoute } from 'next'
import { MODEL_PROVIDERS } from '@/content/modelProviders'
import { USE_CASES } from '@/content/useCases'
import { DOCS } from '@/content/docs'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com'

const BLOG_SLUGS = [
  'best-openclaw-hosting-providers-2026',
  'best-managed-openclaw-hosting',
  'managed-vs-self-hosting-openclaw',
  'how-to-deploy-openclaw',
  'openclaw-hosting-cost',
  'openclaw-security',
  'how-to-deploy-hermes-agent',
  'byok-ai-agent-platform',
  'openclaw-hosting-alternatives',
]

const COMPARE_SLUGS = [
  'openclaw-vs-hermes',
  'vibeopenclaw-vs-xcloud',
  'vibeopenclaw-vs-myclaw',
  'vibeopenclaw-vs-oneclaw',
  'vibeopenclaw-vs-digitalocean',
  'vibeopenclaw-vs-railway',
  'vibeopenclaw-vs-hostinger',
]

const OPENCLAW_SUBPAGES = [
  'telegram', 'discord', 'slack', 'xcloud-alternative', 'myclaw-alternative',
]

const HERMES_CHANNELS = ['telegram', 'discord', 'slack']

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const e = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly',
  ): MetadataRoute.Sitemap[number] => ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority })

  return [
    e('', 1.0, 'weekly'),

    // Commercial landing pages
    e('/openclaw-hosting', 0.9, 'weekly'),
    e('/hermes-agent-hosting', 0.9, 'weekly'),
    e('/managed-ai-agent-hosting', 0.8),
    e('/what-is-openclaw', 0.7),
    e('/what-is-hermes', 0.7),

    // OpenClaw subpages (channels + alternatives)
    ...OPENCLAW_SUBPAGES.map((s) => e(`/openclaw-hosting/${s}`, 0.7)),
    // OpenClaw × model provider
    ...MODEL_PROVIDERS.map((p) => e(`/openclaw-hosting/${p.slug}`, 0.6)),
    // OpenClaw use cases
    ...USE_CASES.map((u) => e(`/openclaw-hosting/use-cases/${u.slug}`, 0.6)),
    // Hermes channels
    ...HERMES_CHANNELS.map((c) => e(`/hermes-agent-hosting/${c}`, 0.6)),

    // Comparisons
    ...COMPARE_SLUGS.map((s) => e(`/compare/${s}`, 0.8)),

    // Blog
    e('/blog', 0.7, 'weekly'),
    ...BLOG_SLUGS.map((s) => e(`/blog/${s}`, 0.7)),

    // Docs
    e('/docs', 0.6, 'weekly'),
    ...DOCS.map((d) => e(`/docs/${d.slug}`, 0.5)),
  ]
}
