/**
 * Accepts only same-site relative paths for post-login redirects, which prevents
 * open-redirect attacks through a crafted ?next= parameter.
 */
export function safeRedirectPath(value: string | null | undefined, fallback = "/"): string {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}
