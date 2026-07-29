import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { appConfig } from "~/app/app-config";
import {
  demoAuthCredentials,
  getAuthSession,
  login,
  logout,
} from "~/features/auth/api/auth-api";

describe("mock authentication API", () => {
  beforeEach(() => {
    localStorage.removeItem(appConfig.auth.sessionStorageKey);
  });

  afterEach(() => {
    localStorage.removeItem(appConfig.auth.sessionStorageKey);
  });

  test("starts signed out when no session has been stored", async () => {
    expect(await getAuthSession()).toBeNull();
  });

  test("persists a signed-out state", async () => {
    await logout();

    expect(await getAuthSession()).toBeNull();
  });

  test("rejects invalid credentials and accepts the demo account", async () => {
    let loginError: unknown;
    try {
      await login({
        email: demoAuthCredentials.email,
        password: "incorrect",
      });
    } catch (error) {
      loginError = error;
    }
    expect(loginError).toBeInstanceOf(Error);
    expect((loginError as Error).message).toBe(
      "The email or password is incorrect.",
    );

    const session = await login(demoAuthCredentials);
    expect(session.user.name).toBe("Alex Morgan");
    expect(await getAuthSession()).toEqual(session);
  });
});
