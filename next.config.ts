import type { NextConfig } from "next";

const apiUrl = (process.env.API_URL ?? "http://localhost:5000").replace(/\/$/, "");

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  /**
   * Serving the API under the site's own origin keeps the HTTPOnly auth cookie first-party
   * (no third-party cookie blocking, no CORS preflights). `/api/auth/*` is a route handler
   * and is matched by the filesystem before these rewrites apply.
   */
  async rewrites() {
    return {
      afterFiles: [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }],
    };
  },
};

export default nextConfig;
