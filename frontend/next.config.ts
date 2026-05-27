import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Settings khusus untuk DEPLOY
  output: "standalone", // ← Diubah kembali ke 'standalone' karena Auth.js memerlukan serverless environment
  distDir: ".next",     // ← Output folder default .next



  images: {
    unoptimized: true,
  },
};

export default nextConfig;
