import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { clearAuthToken, getAuthToken } from "../auth/tokenStorage";

/**
 * Determine the API base URL from env vars.
 *
 * Per request: prefer REACT_APP_API_BASE, fallback to REACT_APP_BACKEND_URL.
 * Note: in Vite, env vars are available via import.meta.env.
 */
function resolveApiBaseUrl(): string {
  const env = import.meta.env as Record<string, unknown>;
  const apiBase = env.REACT_APP_API_BASE;
  const backendUrl = env.REACT_APP_BACKEND_URL;

  const candidate = (typeof apiBase === "string" && apiBase.trim()) || (typeof backendUrl === "string" && backendUrl.trim());

  // If not configured, default to same-origin (useful for dev proxies / monolith deployments).
  return candidate ? String(candidate) : "";
}

/**
 * Best-effort redirect to login without importing router utilities (keeps api layer framework-agnostic).
 * Avoid redirect loops if already on /login.
 */
function maybeRedirectToLogin(): void {
  if (typeof window === "undefined") return;
  const currentPath = window.location?.pathname ?? "";
  if (currentPath.startsWith("/login")) return;
  window.location.assign("/login");
}

const apiBaseURL = resolveApiBaseUrl();

/**
 * A single shared Axios instance for the entire app.
 * - baseURL is configured from env vars
 * - auth token is attached automatically
 * - 401 clears token and redirects to /login
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json"
  },
  // If your backend uses cookies in addition to bearer tokens, flip this to true.
  withCredentials: false
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      // Axios types allow headers to be undefined; normalize.
      config.headers = config.headers ?? {};
      // Attach Bearer token
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token is invalid/expired: clear and force re-auth.
      clearAuthToken();

      // Optional redirect behavior requested.
      maybeRedirectToLogin();
    }

    return Promise.reject(error);
  }
);

// PUBLIC_INTERFACE
export async function apiGet<TResponse>(
  url: string,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  /** Typed GET helper returning response.data. */
  const res: AxiosResponse<TResponse> = await apiClient.get<TResponse>(url, config);
  return res.data;
}

// PUBLIC_INTERFACE
export async function apiPost<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  /** Typed POST helper returning response.data. */
  const res: AxiosResponse<TResponse> = await apiClient.post<TResponse>(url, body, config);
  return res.data;
}

// PUBLIC_INTERFACE
export async function apiPut<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  /** Typed PUT helper returning response.data. */
  const res: AxiosResponse<TResponse> = await apiClient.put<TResponse>(url, body, config);
  return res.data;
}

// PUBLIC_INTERFACE
export async function apiDelete<TResponse>(
  url: string,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  /** Typed DELETE helper returning response.data. */
  const res: AxiosResponse<TResponse> = await apiClient.delete<TResponse>(url, config);
  return res.data;
}
