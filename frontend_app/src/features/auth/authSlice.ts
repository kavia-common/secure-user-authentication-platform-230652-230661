import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

export type AuthStatus = "idle" | "loading" | "authenticated" | "error";

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  status: AuthStatus;
  error?: string;
};

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: undefined
};

export type LoginRequestedPayload = {
  email: string;
  password: string;
};

export type RegisterRequestedPayload = {
  email: string;
  password: string;
  name?: string;
};

export type AuthSuccessPayload = {
  user: AuthUser;
  token: string;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * "Requested" actions are consumed by sagas. Reducers set loading state.
     */
    loginRequested(state, _action: PayloadAction<LoginRequestedPayload>) {
      state.status = "loading";
      state.error = undefined;
    },
    registerRequested(state, _action: PayloadAction<RegisterRequestedPayload>) {
      state.status = "loading";
      state.error = undefined;
    },
    loadMeRequested(state) {
      // If already authenticated, we still allow refresh; keep status as loading
      // so UI can show a lightweight spinner if desired.
      state.status = "loading";
      state.error = undefined;
    },
    logoutRequested(state) {
      // Saga clears token storage; reducer resets state.
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = undefined;
    },

    /**
     * Result actions dispatched by sagas.
     */
    authSucceeded(state, action: PayloadAction<AuthSuccessPayload>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = "authenticated";
      state.error = undefined;
    },
    meLoaded(state, action: PayloadAction<{ user: AuthUser }>) {
      // Do not change token here; it comes from storage / prior auth.
      state.user = action.payload.user;
      state.status = "authenticated";
      state.error = undefined;
    },
    authFailed(state, action: PayloadAction<{ error: string }>) {
      state.status = "error";
      state.error = action.payload.error;
    }
  }
});

export const authReducer = authSlice.reducer;

export const {
  loginRequested,
  registerRequested,
  loadMeRequested,
  logoutRequested,
  authSucceeded,
  meLoaded,
  authFailed
} = authSlice.actions;

// PUBLIC_INTERFACE
export const selectAuthStatus = (state: RootState): AuthStatus => {
  /** Selector for auth status. */
  return state.auth.status;
};

// PUBLIC_INTERFACE
export const selectCurrentUser = (state: RootState): AuthUser | null => {
  /** Selector for current authenticated user (if any). */
  return state.auth.user;
};

// PUBLIC_INTERFACE
export const selectAuthError = (state: RootState): string | undefined => {
  /** Selector for last auth error message (if any). */
  return state.auth.error;
};

// PUBLIC_INTERFACE
export const selectToken = (state: RootState): string | null => {
  /** Selector for current auth token (if any). */
  return state.auth.token;
};
