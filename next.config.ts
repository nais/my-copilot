import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    optimizePackageImports: ["@navikt/ds-react", "@navikt/aksel-icons"],
  },
  webpack: (config, { isServer }) => {
    // Suppress OpenTelemetry warnings for client-side builds
    if (!isServer) {
      config.ignoreWarnings = [
        {
          module: /require-in-the-middle/,
          message: /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
        },
      ];
    }
    return config;
  },
};

export default nextConfig;
