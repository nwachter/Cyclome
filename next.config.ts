import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // sortie autonome : image Docker de production légère
  output: "standalone",
  experimental: {
    // les photos d'intervention arrivent compressées côté client
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
