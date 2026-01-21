export const AUTH_TOKEN_STORAGE_KEY = "auth_token";

// PUBLIC_INTERFACE
export function getAuthToken(): string | null {
  /**
   * Read the current auth token from localStorage.
   *
   * This is a temporary placeholder implementation until Redux-based auth
   * state is wired into the application.
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
   * Check whether the user is currently authenticated.
   *
   * For now, authentication is determined by presence of an auth token in
   * localStorage.
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
