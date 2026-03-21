import * as storage from "./storage";
import { TokenResponse, RefreshRequest } from "../types";
import { getApiBaseUrl } from "../config";

const BASE_URL = getApiBaseUrl();

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token!);
    }
  });
  failedQueue = [];
}

async function requestWithAuth(
  url: string,
  options: RequestInit,
  retry = true
): Promise<Response> {
  const token = await storage.getItem("access_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && retry) {
    if (isRefreshing) {
      return new Promise<Response>((resolve, reject) => {
        failedQueue.push({
          resolve: async (newToken: string) => {
            const h = { ...headers, Authorization: `Bearer ${newToken}` };
            const r = await fetch(`${BASE_URL}${url}`, { ...options, headers: h });
            resolve(r);
          },
          reject,
        });
      });
    }

    isRefreshing = true;
    const refreshToken = await storage.getItem("refresh_token");
    if (!refreshToken) {
      isRefreshing = false;
      return res;
    }

    try {
      const body: RefreshRequest = { refresh_token: refreshToken };
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: TokenResponse = await refreshRes.json();
      await storage.setItem("access_token", data.access_token);
      await storage.setItem("refresh_token", data.refresh_token);
      processQueue(null, data.access_token);
      return requestWithAuth(url, options, false);
    } catch (err) {
      processQueue(err, null);
      await storage.deleteItem("access_token");
      await storage.deleteItem("refresh_token");
      throw err;
    } finally {
      isRefreshing = false;
    }
  }

  return res;
}

function parseResponse<T>(text: string): T {
  if (!text.trim()) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return { message: text } as T;
  }
}

const api = {
  async get<T>(path: string): Promise<{ data: T }> {
    const res = await requestWithAuth(path, { method: "GET" });
    const text = await res.text();
    const data = parseResponse<{ message?: string }>(text);
    if (!res.ok) {
      const msg = data.message || "Request failed";
      const err = new Error(msg);
      (err as Error & { response?: unknown }).response = { status: res.status, data: msg };
      throw err;
    }
    return { data: data as T };
  },
  async post<T>(path: string, body: unknown): Promise<{ data: T }> {
    const res = await requestWithAuth(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const data = parseResponse<{ message?: string }>(text);
    if (!res.ok) {
      const msg = data.message || "Request failed";
      const err = new Error(msg);
      (err as Error & { response?: unknown }).response = { status: res.status, data: msg };
      throw err;
    }
    return { data: data as T };
  },
};

export default api;
