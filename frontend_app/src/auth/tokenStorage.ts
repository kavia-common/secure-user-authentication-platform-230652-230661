export const AUTH_TOKEN_STORAGE_KEY = "auth_token";

// PUBLIC_INTERFACE
export function getAuthToken(): string | null {
  /**
   * Read the current auth token from localStorage.
   *
   * IMPORTANT:
   * - Components and route guards must NOT read from tokenStorage directly.
   * - Only sagas (rehydration/persistence side-effects) may use this module.
   * - The rest of the app should rely on Redux auth state.
   *
   * @returns The token string if present, otherwise null.
   */
  try {
    return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    // localStorage may be unavailable (privacy mode, sandboxed iframe, etc.)
    return null;
  }
}

// PUBLIC_INTERFACE
export function isAuthenticated(): boolean {
  /**
   * Legacy helper (do not use in UI/routing).
   *
   * Authentication for UI/routing must be derived from Redux state instead.
   * This remains only for backwards compatibility in non-React call sites (if any).
   */
  return Boolean(getAuthToken());
}

// PUBLIC_INTERFACE
export function setAuthToken(token: string): void {
  /**
   * Persist an auth token to localStorage.
   * @param token Auth token to store.
   */
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

// PUBLIC_INTERFACE
export function clearAuthToken(): void {
  /** Remove the auth token from localStorage. */
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}
