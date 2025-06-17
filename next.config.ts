import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // appDir: true, // ✅ App Router 사용 명시
  },
};

export default nextConfig;
