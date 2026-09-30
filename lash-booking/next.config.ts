import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app lives inside another repo that has its own lockfile; pin the root here.
  turbopack: { root: import.meta.dirname },
  // node:sqlite is a Node built-in; keep it out of any bundling attempt.
  serverExternalPackages: ["node:sqlite"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
