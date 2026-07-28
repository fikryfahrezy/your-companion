import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import {
  getAuthSession,
  login as loginRequest,
  logout as logoutRequest,
} from "~/features/auth/api/auth-api";
import type { AuthSession, LoginCredentials } from "~/features/auth/model/auth";
import { trackEvent } from "~/lib/analytics";

const authSessionKey = ["auth", "session"] as const;

type AuthContextValue = {
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isPending: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthSession>;
  logout: () => Promise<void>;
  session: AuthSession | null | undefined;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const sessionQuery = useQuery({
    queryKey: authSessionKey,
    queryFn: getAuthSession,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  });
  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (session) => {
      queryClient.setQueryData(authSessionKey, session);
      trackEvent({ name: "user_signed_in", userId: session.user.email });
    },
  });
  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      queryClient.setQueryData(authSessionKey, null);
      trackEvent({ name: "user_signed_out" });
    },
  });
  const value = useMemo<AuthContextValue>(
    () => ({
      isLoggingIn: loginMutation.isPending,
      isLoggingOut: logoutMutation.isPending,
      isPending: sessionQuery.isPending,
      login: loginMutation.mutateAsync,
      logout: logoutMutation.mutateAsync,
      session: sessionQuery.data,
    }),
    [
      loginMutation.isPending,
      loginMutation.mutateAsync,
      logoutMutation.isPending,
      logoutMutation.mutateAsync,
      sessionQuery.data,
      sessionQuery.isPending,
    ],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}
