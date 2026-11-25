import type { NextConfig } from "next";

const backendUrl = process.env.ROG_BACKEND_INTERNAL_URL || "http://localhost:5161";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/be/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

