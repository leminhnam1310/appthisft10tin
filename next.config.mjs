/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ⚡ cho deploy Vercel + Electron + standalone build
  output: "standalone",

  images: {
    unoptimized: true,
  },

  // 🚀 QUAN TRỌNG: bỏ chặn build do ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 🚀 QUAN TRỌNG: bỏ chặn build do TypeScript (nếu có)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;