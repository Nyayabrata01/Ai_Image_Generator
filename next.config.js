/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export', // ❌ Remove or comment this line

  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    config.cache = false;
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 100000,
        cacheGroups: {
          default: false,
          vendors: false,
        },
      },
      runtimeChunk: false,
    };
    return config;
  },
  experimental: {
    optimizeCss: false,
    optimizePackageImports: false,
  },
};

module.exports = nextConfig;
