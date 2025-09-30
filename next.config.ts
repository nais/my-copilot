import type { NextConfig } from "next";

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
};

export default nextConfig;
