import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Uses the Render URL in production, falls back to local Python server for dev
    const backendUrl = process.env.AI_BACKEND_URL || "http://127.0.0.1:8000";
    return [
      {
        source: "/api/ai/:path*",
        destination: `${backendUrl}/api/ai/:path*`,
      },
    ];
  },
};

export default nextConfig;
