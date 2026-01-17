import { getToken } from "../store/auth";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


export class ApiError extends Error {
  status: number;
  detail: any;

  constructor(status: number, detail: any) {
    super(typeof detail === "string" ? detail : "API Error");
    this.status = status;
    this.detail = detail;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  body?: unknown;
  auth?: boolean;
};

export async function apiRequest<T>(opts: RequestOptions): Promise<T> {
  const url = `${API_BASE_URL}${opts.path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (opts.auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });

  const contentType = res.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const detail = (data && (data.detail ?? data)) || "Request failed";
    throw new ApiError(res.status, detail);
  }

  return data as T;
}
