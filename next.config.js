/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  outputFileTracingRoot: __dirname,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      encoding: false
    };

    return config;
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co'
      }
    ]
  }
};

module.exports = nextConfig;
