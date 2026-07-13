import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['dockerode', 'pg'],
  async redirects() {
    // /pricing is a common direct hit (seen in Caddy access logs) but the
    // pricing section lives on the homepage — redirect instead of 404ing.
    return [
      { source: '/pricing', destination: '/#pricing', permanent: true },
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
