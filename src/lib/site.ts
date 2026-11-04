/** Public origin of the deployed site, used for canonical URLs, the sitemap and robots rules. */
export const SITE_URL = (process.env.BETTER_AUTH_URL ?? "http://localhost:3000").trim().replace(/\/+$/, "");
