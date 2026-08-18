import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // sortie autonome : image Docker léger
  output: "standalone",
  //le job quality du ci fait délà lint+typecheck
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    // les photos d'intervention arrivent compressées côté client
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
