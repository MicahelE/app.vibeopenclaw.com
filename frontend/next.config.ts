import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['dockerode', 'pg'],
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
