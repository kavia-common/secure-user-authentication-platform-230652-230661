import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components";
import { AppLayout } from "./layouts/AppLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { LoginPage } from "./pages/Login/LoginPage";
import { RegisterPage } from "./pages/Register/RegisterPage";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { EventsPage } from "./pages/Events/EventsPage";
import { useAppDispatch } from "./store/hooks";
import { authRehydrateRequested } from "./features/auth/authSlice";
import "./App.css";

// PUBLIC_INTERFACE
function App(): React.JSX.Element {
  /** Application root component defining SPA routes and layout. */
  const dispatch = useAppDispatch();

  useEffect(() => {
    /**
     * Rehydrate auth on app boot.
     * This triggers saga-controlled tokenStorage usage (components do not read storage).
     */
    dispatch(authRehydrateRequested());
  }, [dispatch]);

  return (
    <div className="App">
      <ErrorBoundary>
        <Routes>
          <Route element={<AppLayout title="KAVIA App" />}>
            {/* Public-only auth routes: authed users are redirected to /dashboard */}
            <Route element={<ProtectedRoute mode="publicOnly" />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute mode="protected" redirectTo="/login" />}>
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
