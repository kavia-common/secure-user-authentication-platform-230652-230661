import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components";
import { AppLayout } from "./layouts/AppLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { LoginPage } from "./pages/Login/LoginPage";
import { RegisterPage } from "./pages/Register/RegisterPage";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { EventsPage } from "./pages/Events/EventsPage";
import { getAuthToken } from "./auth/tokenStorage";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { authSucceeded, loadMeRequested, selectAuthStatus } from "./features/auth/authSlice";
import "./App.css";

// PUBLIC_INTERFACE
function App(): React.JSX.Element {
  /** Application root component defining SPA routes and layout. */
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);

  useEffect(() => {
    /**
     * Rehydrate auth from persisted token on app boot.
     * - If a token exists, set token into Redux so routing can consider user "present"
     *   and then request /me to populate user details.
     * - If /me fails (401), authSaga clears token and resets state.
     */
    const token = getAuthToken();
    if (token && authStatus !== "authenticated") {
      // Set token in state immediately so ProtectedRoute does not rely on localStorage.
      dispatch(authSucceeded({ token, user: { id: "rehydrating", email: "" } }));
      dispatch(loadMeRequested());
    }
    // We intentionally do this only on initial mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div className="App">
      <ErrorBoundary>
        <Routes>
          <Route element={<AppLayout title="KAVIA App" />}>
            {/* Auth routes are guarded by ProtectedRoute itself (redirects authed -> /dashboard). */}
            <Route element={<ProtectedRoute redirectTo="/login" />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/events" element={<EventsPage />} />
            </Route>

            {/* Default + fallback */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
