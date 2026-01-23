import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["10.0.10.238:3000", "localhost:3000"],
    },
  },
};

// export default withPWA(nextConfig);
export default nextConfig;
