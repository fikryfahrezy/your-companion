import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { AppShell } from "~/app/app-shell";
import { appRoutes } from "~/app/route-registry";
import { PageLoadingState } from "~/components/feedback/query-state";
import { ProtectedRoute } from "~/features/auth/components/protected-route";
import { authPaths } from "~/features/auth/routes/auth-paths";

const LoginPage = lazy(() =>
  import("~/pages/login-page").then((module) => ({
    default: module.LoginPage,
  })),
);

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoadingState />}>{children}</Suspense>;
}

export function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <LazyPage>
              <LoginPage />
            </LazyPage>
          }
          path={authPaths.login}
        />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            {appRoutes.map((route) => {
              const Page = route.Component;
              const element = (
                <LazyPage>
                  <Page />
                </LazyPage>
              );

              return route.index ? (
                <Route element={element} index key={route.id} />
              ) : (
                <Route element={element} key={route.id} path={route.path} />
              );
            })}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
