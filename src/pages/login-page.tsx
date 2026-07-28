import { zodResolver } from "@hookform/resolvers/zod";
import { Hotel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router";
import { z } from "zod";
import { appConfig } from "~/app/app-config";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { demoAuthCredentials } from "~/features/auth/api/auth-api";
import { useAuth } from "~/features/auth/context/auth-provider";
import { authPaths, getSafeReturnTo } from "~/features/auth/routes/auth-paths";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = getSafeReturnTo(
    new URLSearchParams(location.search).get("returnTo"),
  );
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: demoAuthCredentials,
  });

  if (!auth.isPending && auth.session) {
    return <Navigate replace to={returnTo} />;
  }

  const submit = form.handleSubmit(async (values) => {
    try {
      await auth.login(values);
      void navigate(returnTo, { replace: true });
    } catch (error) {
      form.setError("root", {
        message: error instanceof Error ? error.message : "Unable to sign in.",
      });
    }
  });

  return (
    <main className="grid min-h-screen bg-muted/40 lg:grid-cols-[1fr_520px]">
      <section className="hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/15">
            <HugeiconsIcon icon={Hotel01Icon} size={24} strokeWidth={2} />
          </span>
          <div>
            <p className="font-heading text-lg font-bold">
              {appConfig.brand.name}
            </p>
            <p className="text-xs text-primary-foreground/70">
              {appConfig.brand.tagline}
            </p>
          </div>
        </div>
        <div className="max-w-xl">
          <p className="font-heading text-4xl font-semibold leading-tight">
            Keep every guest request moving.
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-primary-foreground/75">
            Secure access for hotel staff to monitor operations, resolve
            exceptions, and deliver dependable service.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/60">
          {appConfig.hotel.name} · {appConfig.hotel.location}
        </p>
      </section>

      <section className="flex items-center justify-center p-5 sm:p-10">
        <Card className="w-full max-w-md rounded-2xl bg-background">
          <CardHeader className="border-b p-6">
            <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground lg:hidden">
              <HugeiconsIcon icon={Hotel01Icon} size={21} strokeWidth={2} />
            </span>
            <h1 className="font-heading text-2xl font-medium">Staff sign in</h1>
            <CardDescription>
              Use your hotel operations account to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form
              className="space-y-4"
              onSubmit={(event) => void submit(event)}
            >
              <div>
                <label className="text-xs font-semibold" htmlFor="email">
                  Email
                </label>
                <Input
                  aria-invalid={Boolean(form.formState.errors.email)}
                  autoComplete="email"
                  className="mt-1.5 h-10 rounded-lg"
                  id="email"
                  type="email"
                  {...form.register("email")}
                />
                {form.formState.errors.email ? (
                  <p className="mt-1 text-xs text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                ) : null}
              </div>
              <div>
                <label className="text-xs font-semibold" htmlFor="password">
                  Password
                </label>
                <Input
                  aria-invalid={Boolean(form.formState.errors.password)}
                  autoComplete="current-password"
                  className="mt-1.5 h-10 rounded-lg"
                  id="password"
                  type="password"
                  {...form.register("password")}
                />
                {form.formState.errors.password ? (
                  <p className="mt-1 text-xs text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                ) : null}
              </div>

              {form.formState.errors.root ? (
                <p
                  className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
                  role="alert"
                >
                  {form.formState.errors.root.message}
                </p>
              ) : null}

              <Button
                aria-busy={auth.isLoggingIn}
                className="h-10 w-full rounded-lg"
                disabled={auth.isLoggingIn || auth.isPending}
                type="submit"
              >
                {auth.isLoggingIn ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <div className="mt-5 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Demo account</p>
              <p className="mt-1">{demoAuthCredentials.email}</p>
              <p>{demoAuthCredentials.password}</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

export const loginPagePath = authPaths.login;
