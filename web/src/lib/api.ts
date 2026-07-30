import { ApiError, type ApiErrorBody } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

export function getApiBaseUrl() {
  return API_URL;
}

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, token }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, {
      error: "network_error",
      message: `Could not reach the API at ${API_URL}. Is the Express server running?`,
    });
  }

  const payload = (await response.json().catch(() => null)) as ApiErrorBody | T | null;

  if (!response.ok) {
    throw new ApiError(response.status, (payload as ApiErrorBody) ?? null);
  }

  return payload as T;
}
