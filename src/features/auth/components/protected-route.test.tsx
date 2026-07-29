import { afterEach, describe, expect, test } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { appConfig } from "~/app/app-config";
import { demoAuthCredentials, login } from "~/features/auth/api/auth-api";
import { ProtectedRoute } from "~/features/auth/components/protected-route";
import { AuthProvider } from "~/features/auth/context/auth-provider";

function CurrentLocation() {
  const location = useLocation();
  return <p>{`${location.pathname}${location.search}`}</p>;
}

function renderProtectedRoute(initialEntry: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route element={<CurrentLocation />} path="/login" />
            <Route element={<ProtectedRoute />}>
              <Route element={<p>Protected orders</p>} path="/orders" />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  );
}

describe("ProtectedRoute component", () => {
  afterEach(() => {
    localStorage.removeItem(appConfig.auth.sessionStorageKey);
  });

  test("renders protected content for an authenticated session", async () => {
    await login(demoAuthCredentials);
    renderProtectedRoute("/orders");

    expect(await screen.findByText("Protected orders")).toBeDefined();
  });

  test("redirects signed-out users and preserves their destination", async () => {
    renderProtectedRoute("/orders?status=New");

    expect(
      await screen.findByText("/login?returnTo=%2Forders%3Fstatus%3DNew"),
    ).toBeDefined();
  });
});
