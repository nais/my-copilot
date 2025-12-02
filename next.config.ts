import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["pino", "thread-stream"],
  turbopack: {
    // Empty config to silence Turbopack migration warning
  },
  experimental: {
    optimizePackageImports: ["@navikt/ds-react", "@navikt/aksel-icons"],
  },
  // Keep webpack config for compatibility
  webpack: (config, { dev, isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'pino', 'thread-stream'];
    }
    return config;
  },
};

export default nextConfig;
