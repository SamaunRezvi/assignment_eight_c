import type { NextConfig } from "next";

// Pasted environment values often carry stray whitespace, which would invalidate the rewrite.
const apiUrl = (process.env.API_URL ?? "http://localhost:5000").trim().replace(/\/+$/, "");

if (!/^https?:\/\//.test(apiUrl)) {
  throw new Error(`API_URL must start with http:// or https:// (received "${apiUrl}")`);
}

const nextConfig: NextConfig = {
  agentRules: false,
  poweredByHeader: false,
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
   * (no third-party cookie blocking, no CORS preflights). `fallback` rewrites run only after
   * every page and dynamic route, so the `/api/auth/[...all]` route handler always wins.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
  async rewrites() {
    return {
      fallback: [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }],
    };
  },
};

export default nextConfig;
