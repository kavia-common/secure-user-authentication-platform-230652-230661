import { apiGet, apiPost } from "../../api/client";

/**
 * Types local to the auth feature. These are intentionally minimal and match the
 * requested Redux auth domain shape.
 */
export type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  name?: string;
};

// PUBLIC_INTERFACE
export async function login(payload: LoginRequest): Promise<AuthResponse> {
  /** Call backend login endpoint. */
  return apiPost<AuthResponse, LoginRequest>("/auth/login", payload);
}

// PUBLIC_INTERFACE
export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  /** Call backend register endpoint. */
  return apiPost<AuthResponse, RegisterRequest>("/auth/register", payload);
}

// PUBLIC_INTERFACE
export async function getMe(): Promise<{ user: AuthUser }> {
  /**
   * Call backend "me" endpoint. The Axios client attaches Authorization header
   * via interceptor when a token is present in tokenStorage.
   */
  return apiGet<{ user: AuthUser }>("/auth/me");
}
