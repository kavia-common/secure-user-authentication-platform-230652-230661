import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../store/store";
import { logoutRequested, selectToken } from "../features/auth/authSlice";

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

const apiBaseURL = resolveApiBaseUrl();

/**
 * A single shared Axios instance for the entire app.
 * - baseURL is configured from env vars
 * - auth token is attached automatically (tokenStorage is used here, not in components)
 * - 401 dispatches logoutRequested (saga clears token storage; router guards redirect)
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
    // IMPORTANT: Attach auth token from Redux state only.
    // Token persistence/rehydration is handled by authSaga (tokenStorage is never read by components).
    const token = selectToken(store.getState());
    if (token) {
      // Axios types allow headers to be undefined; normalize.
      config.headers = config.headers ?? {};
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
      // Centralized 401 handling: force logout flow. Saga will clear tokenStorage.
      // Route guards will redirect to /login as needed.
      store.dispatch(logoutRequested());
    }

    return Promise.reject(error);
  }
);

// PUBLIC_INTERFACE
export async function apiGet<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> {
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
export async function apiDelete<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> {
  /** Typed DELETE helper returning response.data. */
  const res: AxiosResponse<TResponse> = await apiClient.delete<TResponse>(url, config);
  return res.data;
}
