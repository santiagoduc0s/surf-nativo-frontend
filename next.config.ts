import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker: .next/standalone trae server.js + solo los node_modules que usa
  // el servidor (ver Dockerfile).
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "http2.mlstatic.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cms.puntadelesteinternacional.com" },
      { protocol: "http", hostname: "localhost", port: "8087" },
      { protocol: "http", hostname: "127.0.0.1", port: "8087" },
    ],
  },
};

export default nextConfig;
