import { authClient } from "@/lib/auth-client";
import type { PageMeta, Paginated } from "@/types";

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

interface Envelope<T> {
  success: boolean;
  data?: T;
  meta?: PageMeta;
  message?: string;
  details?: unknown;
}

async function send(path: string, init: RequestInit): Promise<Response> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`/api${path}`, { ...init, headers, credentials: "same-origin" });
}

/**
 * The API token cookie is short-lived. When it lapses while the session is still valid,
 * checking the session mints a fresh cookie, so the request is retried once transparently.
 */
async function sendWithRefresh(path: string, init: RequestInit): Promise<Response> {
  const response = await send(path, init);
  if (response.status !== 401) return response;

  const { data } = await authClient.getSession({ query: { disableCookieCache: true } });
  if (!data?.session) return response;
  return send(path, init);
}

async function parseEnvelope<T>(response: Response): Promise<Envelope<T>> {
  try {
    return (await response.json()) as Envelope<T>;
  } catch {
    throw new ApiRequestError(response.status, "The server sent an unreadable response. Please try again.");
  }
}

function toError(response: Response, body: Envelope<unknown>): ApiRequestError {
  const fallback =
    response.status === 401
      ? "Please log in to continue."
      : response.status >= 500
        ? "Something went wrong on our side. Please try again."
        : "The request could not be completed.";
  return new ApiRequestError(response.status, body.message || fallback, body.details);
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await sendWithRefresh(path, init);
  const body = await parseEnvelope<T>(response);
  if (!response.ok || !body.success) throw toError(response, body);
  return body.data as T;
}

export async function apiPaginated<T>(path: string): Promise<Paginated<T>> {
  const response = await sendWithRefresh(path, {});
  const body = await parseEnvelope<T[]>(response);
  if (!response.ok || !body.success || !body.meta) throw toError(response, body);
  return { items: body.data ?? [], meta: body.meta };
}

export function jsonBody(payload: unknown): RequestInit["body"] {
  return JSON.stringify(payload);
}

export function toQuery(params: object): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

/** Downloads a binary response (such as a PDF invoice) through the authenticated API. */
export async function downloadFile(path: string, fallbackName: string): Promise<void> {
  const response = await sendWithRefresh(path, {});
  if (!response.ok) {
    const body = await parseEnvelope<unknown>(response);
    throw toError(response, body);
  }
  const disposition = response.headers.get("content-disposition") ?? "";
  const name = /filename="([^"]+)"/.exec(disposition)?.[1] ?? fallbackName;
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
