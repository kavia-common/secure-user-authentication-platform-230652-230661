import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { selectAuthStatus } from "../features/auth/authSlice";

export type ProtectedRouteProps = {
  /** Optional override path for redirecting unauthenticated users. */
  redirectTo?: string;
};

// PUBLIC_INTERFACE
export function ProtectedRoute({
  redirectTo = "/login"
}: ProtectedRouteProps): React.JSX.Element {
  /** Guard for protected routes; redirects to login if user is not authenticated in Redux state. */
  const location = useLocation();
  const authStatus = useAppSelector(selectAuthStatus);

  const authed = authStatus === "authenticated";

  // If user is authenticated, keep them out of auth screens.
  if (authed && (location.pathname === "/login" || location.pathname === "/register")) {
    return <Navigate to="/dashboard" replace />;
  }

  // For protected areas, redirect unauthenticated users to login.
  if (!authed) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
