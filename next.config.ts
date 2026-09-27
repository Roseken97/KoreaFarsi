import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product covers uploaded to Supabase Storage (public buckets).
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
};

export default nextConfig;
