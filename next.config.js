/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: true,
  },
  generateBuildId: () => 'build',
  experimental: {
    instrumentationHook: false,
    isrMemoryCacheSize: 0,
  },
  trailingSlash: false,
  async rewrites() {
    return []
  },
}

module.exports = nextConfig