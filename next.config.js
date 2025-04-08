/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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
    optimizePackageImports: ["lucide-react"], // ✅ Must be an array or just remove it entirely
  },
};

module.exports = nextConfig;
