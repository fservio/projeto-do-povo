/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@cms/database'],
  images: {
    domains: ['localhost', process.env.NEXT_PUBLIC_MEDIA_DOMAIN],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
