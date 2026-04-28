import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "VibeOpenClaw — Host and Deploy AI Agents | OpenClaw & Hermes Managed SaaS",
  description:
    "Deploy OpenClaw and Hermes AI agents in one click. Managed hosting with Docker isolation, BYOK model support, Telegram/Discord/Slack integrations, and automatic SSL. Start at $60/mo.",
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
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://app.vibeopenclaw.com",
    siteName: "VibeOpenClaw",
    title: "VibeOpenClaw — Host and Deploy AI Agents",
    description:
      "Deploy OpenClaw and Hermes AI agents in one click. Managed hosting with Docker isolation, BYOK, and channel integrations. Start at $60/mo.",
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
    canonical: "https://app.vibeopenclaw.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@700,600,500&f[]=satoshi@400,500,700&display=swap" rel="stylesheet" />
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
                  price: "60",
                  priceCurrency: "USD",
                  billingIncrement: "P1M",
                  description: "1 AI Agent, 1.5 GB RAM, BYOK, Telegram & Discord, Email Support",
                },
                {
                  "@type": "Offer",
                  name: "Premium",
                  price: "100",
                  priceCurrency: "USD",
                  billingIncrement: "P1M",
                  description: "3 AI Agents, 3 GB RAM each, BYOK, All Channels + Slack, Priority Support, Usage Analytics",
                },
              ],
              featureList: [
                "Deploy OpenClaw (Node.js) and Hermes (Python) AI agents",
                "Docker-isolated containers with dedicated RAM",
                "BYOK — Bring Your Own API Keys (OpenAI, Anthropic, Google)",
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
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is VibeOpenClaw?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "VibeOpenClaw is a managed SaaS platform for deploying AI agents powered by OpenClaw and Hermes. It provides Docker-isolated hosting, BYOK model support, and integrations with Telegram, Discord, and Slack — all from $60/month.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is OpenClaw?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "OpenClaw is an open-source personal AI assistant platform (Node.js) with 366k+ GitHub stars. It supports 20+ messaging channels including Telegram, Discord, Slack, WhatsApp, and iMessage, with multi-agent routing and a skills marketplace at clawhub.com.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is Hermes Agent?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Hermes Agent is an open-source self-improving AI agent by Nous Research (Python). It features a learning loop that creates and improves skills from experience, supports messaging platforms, MCP integration, cron scheduling, and can migrate from OpenClaw.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How do I deploy an AI agent on VibeOpenClaw?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Sign up, choose OpenClaw or Hermes agent type, select your model provider (OpenAI, Anthropic, or Google), optionally add Telegram/Discord/Slack tokens, and click Create. Your agent starts in a Docker container within seconds.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What does BYOK mean?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "BYOK stands for Bring Your Own Keys. Instead of paying for API calls through us, you add your own OpenAI, Anthropic, or Google API keys. You control your LLM spend directly — we never mark up API costs.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How much does VibeOpenClaw cost?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "The Pro plan is $60/month for 1 AI agent with 1.5 GB RAM, Telegram & Discord support. The Premium plan is $100/month for 3 AI agents with 3 GB RAM each, all channels including Slack, priority support, and usage analytics.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}