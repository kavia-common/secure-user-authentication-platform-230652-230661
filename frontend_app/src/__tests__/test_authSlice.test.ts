import { describe, expect, it } from "vitest";
import { authReducer, authSucceeded, loginRequested, logoutRequested } from "../features/auth/authSlice";

describe("authSlice reducers", () => {
  it("loginRequested -> status loading", () => {
    const state = authReducer(undefined, loginRequested({ email: "a@b.com", password: "password123" }));
    expect(state.status).toBe("loading");
    expect(state.error).toBeUndefined();
  });

  it("authSucceeded -> authenticated + token set", () => {
    const state = authReducer(
      undefined,
      authSucceeded({
        token: "token_123",
        user: { id: "u1", email: "a@b.com" }
      })
    );

    expect(state.status).toBe("authenticated");
    expect(state.token).toBe("token_123");
    expect(state.user?.email).toBe("a@b.com");
    expect(state.error).toBeUndefined();
  });

  it("logoutRequested -> cleared", () => {
    const authed = authReducer(
      undefined,
      authSucceeded({
        token: "token_123",
        user: { id: "u1", email: "a@b.com" }
      })
    );

    const loggedOut = authReducer(authed, logoutRequested());
    expect(loggedOut.status).toBe("idle");
    expect(loggedOut.token).toBeNull();
    expect(loggedOut.user).toBeNull();
    expect(loggedOut.error).toBeUndefined();
  });
});
