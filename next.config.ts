import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ['localhost', '127.0.0.1', 'cdn.arstechnica.net'],
  },
};

export default nextConfig;
