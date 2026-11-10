import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/be/:path*",
        destination: "http://localhost:5161/api/:path*",
      },
    ];
  },
};

export default nextConfig;
