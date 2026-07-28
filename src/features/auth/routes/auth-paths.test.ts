import { describe, expect, test } from "bun:test";
import { getSafeReturnTo, loginPath } from "~/features/auth/routes/auth-paths";

describe("authentication paths", () => {
  test("preserves an internal return path", () => {
    expect(getSafeReturnTo("/orders/ORD-1004?status=Pending+Approval")).toBe(
      "/orders/ORD-1004?status=Pending+Approval",
    );
    expect(loginPath("/orders/ORD-1004")).toBe(
      "/login?returnTo=%2Forders%2FORD-1004",
    );
  });

  test("rejects external and recursive login redirects", () => {
    expect(getSafeReturnTo("https://example.com/steal-session")).toBe("/");
    expect(getSafeReturnTo("//example.com/steal-session")).toBe("/");
    expect(getSafeReturnTo("/login")).toBe("/");
    expect(getSafeReturnTo(null)).toBe("/");
  });
});
