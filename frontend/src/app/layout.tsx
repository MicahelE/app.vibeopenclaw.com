import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.vibeopenclaw.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Host & Deploy OpenClaw + Hermes AI Agents | VibeOpenClaw",
  description:
    "Deploy OpenClaw & Hermes AI agents in one click. Managed hosting with Docker isolation, BYOK keys, and Telegram/Discord/Slack channels. From $24/mo.",
  keywords: [
    "openclaw hosting",
    "hermes agent hosting",
    "AI agent deployment",
    "managed AI agents",
    "openclaw saas",
    "hermes agent saas",
    "deploy openclaw",
    "deploy hermes agent",
    "AI agent hosting",
    "AI agent platform",
    "BYOK AI agent",
    "bring your own keys AI",
    "openclaw cloud",
    "hermes cloud",
    "AI agent management",
    "docker AI agent",
    "AI agent telegram bot",
    "AI agent discord bot",
    "AI agent slack bot",
    "managed AI agent service",
    "AI agent SaaS",
    "openclaw managed hosting",
    "hermes managed hosting",
    "AI chatbot hosting",
    "agent hosting platform",
    "openclaw vs hermes",
    "how to host openclaw",
    "deploy hermes agent docker",
    "byok ai agent platform",
    "managed openclaw hosting",
    "self-hosted ai agent telegram",
    "bring your own key ai agent",
    "hermes agent telegram setup",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "VibeOpenClaw",
    title: "VibeOpenClaw — Host and Deploy AI Agents",
    description:
      "Deploy OpenClaw and Hermes AI agents in one click. Managed hosting with Docker isolation, BYOK, and channel integrations. Start at $24/mo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeOpenClaw — Host and Deploy AI Agents",
    description:
      "Deploy OpenClaw and Hermes AI agents in one click. Managed SaaS with BYOK, Docker isolation, and channel integrations.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/satoshi-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/clash-display-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "VibeOpenClaw",
              url: "https://app.vibeopenclaw.com",
              description:
                "Managed SaaS platform for deploying OpenClaw and Hermes AI agents. Docker-isolated hosting with BYOK model support and channel integrations.",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              offers: [
                {
                  "@type": "Offer",
                  name: "Pro",
                  price: "24",
                  priceCurrency: "USD",
                  billingIncrement: "P1M",
                  description: "1 OpenClaw Agent, 2 GB RAM, BYOK, Telegram & Discord, Email Support",
                },
                {
                  "@type": "Offer",
                  name: "Premium",
                  price: "48",
                  priceCurrency: "USD",
                  billingIncrement: "P1M",
                  description: "3 OpenClaw or Hermes Agents, 4 GB RAM each, BYOK, All Channels + Slack, Priority Support, Usage Analytics",
                },
              ],
              featureList: [
                "Deploy OpenClaw (Node.js) and Hermes (Python) AI agents",
                "Docker-isolated containers with dedicated RAM",
                "BYOK — Bring Your Own API Keys (OpenAI, Anthropic, Google, NVIDIA)",
                "Telegram, Discord, and Slack bot integrations",
                "HTTPS endpoints with automatic SSL",
                "One-click agent creation and management",
                "Path-based routing for each agent",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "VibeOpenClaw",
              url: SITE_URL,
              logo: `${SITE_URL}/icon.svg`,
              description:
                "Managed SaaS platform for deploying OpenClaw and Hermes AI agents with Docker-isolated hosting, BYOK model support, and channel integrations.",
              sameAs: [
                "https://github.com/openclaw/openclaw",
                "https://github.com/NousResearch/hermes-agent",
                "https://clawhub.com",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "VibeOpenClaw",
              url: SITE_URL,
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
