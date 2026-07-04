import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['dockerode', 'pg'],
  async redirects() {
    // /pricing is a common direct hit (seen in Caddy access logs) but the
    // pricing section lives on the homepage — redirect instead of 404ing.
    return [
      { source: '/pricing', destination: '/#pricing', permanent: true },
      // Bare /compare 404s (seen in access logs); no index page exists, so send
      // it to the most-trafficked comparison.
      { source: '/compare', destination: '/compare/vibeopenclaw-vs-xcloud', permanent: true },
    ];
  },
  async headers() {
    const noindex = {
      key: 'X-Robots-Tag',
      value: 'noindex, nofollow',
    };
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      { source: '/dashboard/:path*', headers: [noindex] },
      { source: '/admin', headers: [noindex] },
      { source: '/billing/:path*', headers: [noindex] },
    ];
  },
};

export default nextConfig;
