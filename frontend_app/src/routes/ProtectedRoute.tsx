import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { selectAuthStatus } from "../features/auth/authSlice";

export type ProtectedRouteMode = "protected" | "publicOnly";

export type ProtectedRouteProps = {
  /**
   * Mode:
   * - "protected": requires authentication; unauthenticated users are redirected to redirectTo (default: /login)
   * - "publicOnly": only for unauthenticated users (e.g., /login, /register); authenticated users are redirected to authenticatedRedirectTo
   */
  mode?: ProtectedRouteMode;
  /** Optional override path for redirecting unauthenticated users (protected mode). */
  redirectTo?: string;
  /** Optional override path for redirecting authenticated users away from public-only routes. */
  authenticatedRedirectTo?: string;
};

// PUBLIC_INTERFACE
export function ProtectedRoute({
  mode = "protected",
  redirectTo = "/login",
  authenticatedRedirectTo = "/dashboard"
}: ProtectedRouteProps): React.JSX.Element {
  /** Route guard that relies solely on Redux auth state (no direct storage reads). */
  const location = useLocation();
  const authStatus = useAppSelector(selectAuthStatus);

  const authed = authStatus === "authenticated";

  if (mode === "publicOnly") {
    // Authenticated users should not see /login or /register.
    if (authed) {
      return <Navigate to={authenticatedRedirectTo} replace />;
    }
    return <Outlet />;
  }

  // Protected mode: require authentication.
  if (!authed) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
