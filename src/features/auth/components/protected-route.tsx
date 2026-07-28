import { HugeiconsIcon } from "@hugeicons/react";
import { Hotel01Icon } from "@hugeicons/core-free-icons";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "~/features/auth/context/auth-provider";
import { loginPath } from "~/features/auth/routes/auth-paths";

export function ProtectedRoute() {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isPending) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-muted/40 p-6"
        aria-busy="true"
        aria-label="Checking authentication"
      >
        <div className="text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <HugeiconsIcon icon={Hotel01Icon} size={24} strokeWidth={2} />
          </span>
          <p className="mt-4 text-sm font-semibold">Checking your session…</p>
        </div>
      </main>
    );
  }

  if (!auth.session) {
    const returnTo = `${location.pathname}${location.search}`;
    return <Navigate replace to={loginPath(returnTo)} />;
  }

  return <Outlet />;
}
