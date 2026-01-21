import type { AxiosError } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { clearAuthToken, setAuthToken } from "../../auth/tokenStorage";
import { getMe, login, register } from "./authApi";
import {
  authFailed,
  authSucceeded,
  loadMeRequested,
  loginRequested,
  logoutRequested,
  meLoaded,
  registerRequested
} from "./authSlice";

/**
 * Convert unknown errors (Axios or otherwise) into a user-facing message.
 */
function toErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return "Something went wrong. Please try again.";
}

function isAxiosErrorWithStatus(error: unknown): error is AxiosError {
  return Boolean(error && typeof error === "object" && "isAxiosError" in error);
}

function* handleLogin(action: ReturnType<typeof loginRequested>): Generator {
  try {
    const res = (yield call(login, action.payload)) as Awaited<ReturnType<typeof login>>;
    // Persist token for Axios interceptor + refresh across reloads.
    setAuthToken(res.token);
    yield put(authSucceeded({ user: res.user, token: res.token }));
  } catch (err) {
    yield put(authFailed({ error: toErrorMessage(err) }));
  }
}

function* handleRegister(action: ReturnType<typeof registerRequested>): Generator {
  try {
    const res = (yield call(register, action.payload)) as Awaited<ReturnType<typeof register>>;
    // Persist token for Axios interceptor + refresh across reloads.
    setAuthToken(res.token);
    yield put(authSucceeded({ user: res.user, token: res.token }));
  } catch (err) {
    yield put(authFailed({ error: toErrorMessage(err) }));
  }
}

function* handleLoadMe(_action: ReturnType<typeof loadMeRequested>): Generator {
  try {
    const res = (yield call(getMe)) as Awaited<ReturnType<typeof getMe>>;
    yield put(meLoaded({ user: res.user }));
  } catch (err) {
    // If unauthorized, clear token and reset auth state.
    if (isAxiosErrorWithStatus(err) && err.response?.status === 401) {
      clearAuthToken();
      // Reuse the existing logoutRequested reducer to clear user/token/status.
      yield put(logoutRequested());
      yield put(authFailed({ error: "Session expired. Please log in again." }));
      return;
    }

    yield put(authFailed({ error: toErrorMessage(err) }));
  }
}

function* handleLogout(_action: ReturnType<typeof logoutRequested>): Generator {
  // Reducer already resets state; also clear persisted token for interceptor.
  try {
    clearAuthToken();
  } catch {
    // No-op: storage may be unavailable.
  }
}

// PUBLIC_INTERFACE
export function* authSaga(): Generator {
  /** Auth feature root saga; registers watchers for auth flows. */
  yield takeLatest(loginRequested.type, handleLogin);
  yield takeLatest(registerRequested.type, handleRegister);
  yield takeLatest(loadMeRequested.type, handleLoadMe);
  yield takeLatest(logoutRequested.type, handleLogout);
}
