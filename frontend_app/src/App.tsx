import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components";
import { AppLayout } from "./layouts/AppLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { LoginPage } from "./pages/Login/LoginPage";
import { RegisterPage } from "./pages/Register/RegisterPage";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { EventsPage } from "./pages/Events/EventsPage";
import "./App.css";

// PUBLIC_INTERFACE
function App(): React.JSX.Element {
  /** Application root component defining SPA routes and layout. */
  return (
    <div className="App">
      <ErrorBoundary>
        <Routes>
          <Route element={<AppLayout title="KAVIA App" />}>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

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
