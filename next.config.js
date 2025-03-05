/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  // Ensure CSS processing works correctly in production
  webpack: (config) => {
    // Optimize CSS processing
    return config;
  },
};

module.exports = nextConfig;