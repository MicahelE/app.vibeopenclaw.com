import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VibeOpenClaw — Host and Deploy AI Agents',
    short_name: 'VibeOpenClaw',
    description:
      'Managed hosting for OpenClaw and Hermes AI agents. Docker-isolated, BYOK, channel integrations, instant HTTPS.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050810',
    theme_color: '#050810',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
