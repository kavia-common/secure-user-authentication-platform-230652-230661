import React from "react";
import { describe, expect, it } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { rootReducer } from "../store/rootReducer";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import type { AuthState } from "../features/auth/authSlice";

function renderWithAuthState(initialEntries: string[], auth: Partial<AuthState>) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      auth: {
        user: null,
        token: null,
        status: "idle",
        error: undefined,
        ...auth
      }
    }
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route element={<ProtectedRoute mode="protected" redirectTo="/login" />}>
            <Route path="/dashboard" element={<div>Dashboard Content</div>} />
          </Route>

          <Route element={<ProtectedRoute mode="publicOnly" authenticatedRedirectTo="/dashboard" />}>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/register" element={<div>Register Page</div>} />
          </Route>

          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe("ProtectedRoute", () => {
  it("redirects unauthenticated user to /login when accessing protected route", async () => {
    renderWithAuthState(["/dashboard"], { status: "idle", token: null });

    // After redirect, login route element should render.
    expect(await screen.findByText("Login Page")).toBeInTheDocument();
  });

  it("allows authenticated user to access protected route", async () => {
    renderWithAuthState(["/dashboard"], { status: "authenticated", token: "token_123" });

    expect(await screen.findByText("Dashboard Content")).toBeInTheDocument();
  });

  it("redirects authenticated user away from /login and /register to /dashboard", async () => {
    renderWithAuthState(["/login"], { status: "authenticated", token: "token_123" });
    expect(await screen.findByText("Dashboard Content")).toBeInTheDocument();

    renderWithAuthState(["/register"], { status: "authenticated", token: "token_123" });
    expect(await screen.findByText("Dashboard Content")).toBeInTheDocument();
  });
});
