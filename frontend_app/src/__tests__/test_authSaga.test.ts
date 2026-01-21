import { describe, expect, it, vi } from "vitest";
import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";
import { authSaga } from "../features/auth/authSaga";
import { authFailed, authSucceeded, loginRequested } from "../features/auth/authSlice";
import * as authApi from "../features/auth/authApi";
import * as tokenStorage from "../auth/tokenStorage";

describe("authSaga login flow", () => {
  it("login success -> sets tokenStorage + dispatches authSucceeded", async () => {
    const setAuthTokenSpy = vi.spyOn(tokenStorage, "setAuthToken").mockImplementation(() => undefined);

    const payload = { email: "a@b.com", password: "password123" };
    const apiResponse: Awaited<ReturnType<typeof authApi.login>> = {
      token: "token_123",
      user: { id: "u1", email: "a@b.com" }
    };

    await expectSaga(authSaga)
      .provide([[matchers.call.fn(authApi.login), apiResponse]])
      .dispatch(loginRequested(payload))
      .put(authSucceeded({ user: apiResponse.user, token: apiResponse.token }))
      .silentRun();

    expect(setAuthTokenSpy).toHaveBeenCalledTimes(1);
    expect(setAuthTokenSpy).toHaveBeenCalledWith("token_123");
  });

  it("login failure -> dispatches authFailed", async () => {
    const payload = { email: "a@b.com", password: "password123" };

    await expectSaga(authSaga)
      .provide([[matchers.call.fn(authApi.login), Promise.reject(new Error("Invalid credentials"))]])
      .dispatch(loginRequested(payload))
      .put(authFailed({ error: "Invalid credentials" }))
      .silentRun();
  });
});
