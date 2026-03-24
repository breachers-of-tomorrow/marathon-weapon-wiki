/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import { withSentryConfig } from "@sentry/nextjs";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    unoptimized: true,
  },
};

export default withSentryConfig(config, {
  org: "meridian-digital",
  project: "marathon-wiki",

  silent: !process.env.CI,

  widenClientFileUpload: true,

  // tunnelRoute: "/monitoring",

  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
