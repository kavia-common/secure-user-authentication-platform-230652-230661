import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../auth/tokenStorage";

export type ProtectedRouteProps = {
  /** Optional override path for redirecting unauthenticated users. */
  redirectTo?: string;
};

// PUBLIC_INTERFACE
export function ProtectedRoute({
  redirectTo = "/login"
}: ProtectedRouteProps): React.JSX.Element {
  /** Guard for protected routes; redirects to login if no auth token exists. */
  const authed = isAuthenticated();
  const location = useLocation();

  if (!authed) {
    // Preserve the attempted URL so we can navigate back after login later.
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
