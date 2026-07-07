const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data as T;
}

export const api = {
  get<T>(path: string, init?: RequestInit) {
    return request<T>(path, { ...init, method: "GET" });
  },

  post<T>(path: string, body?: unknown, init?: RequestInit) {
    return request<T>(path, { ...init, method: "POST", body: JSON.stringify(body) });
  },

  patch<T>(path: string, body?: unknown, init?: RequestInit) {
    return request<T>(path, { ...init, method: "PATCH", body: JSON.stringify(body) });
  },

  put<T>(path: string, body?: unknown, init?: RequestInit) {
    return request<T>(path, { ...init, method: "PUT", body: JSON.stringify(body) });
  },

  delete<T>(path: string, init?: RequestInit) {
    return request<T>(path, { ...init, method: "DELETE" });
  },
};
