import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: ['iyzipay'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

export default withNextIntl(nextConfig)
