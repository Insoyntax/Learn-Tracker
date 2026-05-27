import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Settings khusus untuk DEPLOY
  output: "standalone", // ← Diubah kembali ke 'standalone' karena Auth.js memerlukan serverless environment
  distDir: ".next",     // ← Output folder default .next

  // 2. Settings khusus untuk DEVELOPMENT
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/:path*",
      },
    ];
  },

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
