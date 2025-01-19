import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    /**
     * https://nextjs.org/docs/app/api-reference/next-config-js/optimizePackageImports
     * https://github.com/vercel/next.js/issues/60246
     * https://github.com/vercel/next.js/issues/44039
     * https://github.com/vercel/next.js/issues/12557
     */
    optimizePackageImports: ["@navikt/ds-react", "@navikt/aksel-icons"],
  },
  publicRuntimeConfig: {
    // Standalone mode resolves all variables at build time
    env: process.env.NODE_ENV || "production",
    appName: process.env.APP_NAME || "my-copilot",
    faroUrl: process.env.FARO_API_URL || "https://telemetry.ekstern.nav.no/collect",
    faroAppName: process.env.FARO_APP_NAME || "shop-frontend-browser",
    faroNamespace: process.env.FARO_NAMESPACE || "nais",
  },
};

export default nextConfig;
