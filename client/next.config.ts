import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Add the rewrites configuration here
  async rewrites() {
    return [
      {
        // Source path: Catches requests starting with /api/
        source: '/api/:path*',
        // Destination URL: Proxies them to your Flask server
        destination: 'http://localhost:8080/api/:path*',
      },
    ]
  },
};

export default nextConfig;
