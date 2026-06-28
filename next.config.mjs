const nextConfig = {
  reactStrictMode: true,

  // ⚡ giúp chạy ổn với Electron + dev server
  output: "standalone",

  images: {
    unoptimized: true,
  },
};

export default nextConfig;