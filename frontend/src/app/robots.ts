import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com'

const DISALLOW = ['/dashboard', '/admin', '/billing', '/api/']

// AI search / answer-engine crawlers we explicitly welcome (GEO).
const AI_BOTS = [
  'GPTBot', // OpenAI / ChatGPT training + browsing
  'OAI-SearchBot', // ChatGPT search
  'ChatGPT-User', // ChatGPT on-demand fetch
  'ClaudeBot', // Anthropic / Claude
  'anthropic-ai',
  'PerplexityBot', // Perplexity
  'Perplexity-User',
  'Google-Extended', // Google Gemini / AI Overviews
  'Bingbot', // Bing / Copilot
  'Applebot-Extended', // Apple Intelligence
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      { userAgent: AI_BOTS, allow: '/', disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
