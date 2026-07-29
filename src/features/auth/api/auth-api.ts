import { appConfig } from "~/app/app-config";
import type { AuthSession, LoginCredentials } from "~/features/auth/model/auth";
import { ApiError } from "~/lib/api-client";

export const demoAuthCredentials = {
  email: "manager@companion.test",
  password: "companion123",
} as const;

const demoUser = {
  email: demoAuthCredentials.email,
  firstName: appConfig.operator.firstName,
  initials: appConfig.operator.initials,
  name: appConfig.operator.name,
  role: appConfig.operator.role,
} as const;

type StoredAuthState = {
  session: AuthSession | null;
};

function wait(delayMs = 300) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, delayMs));
}

function createDemoSession(): AuthSession {
  return {
    authenticatedAt: new Date().toISOString(),
    user: demoUser,
  };
}

function readStoredState(): StoredAuthState | undefined {
  const value = localStorage.getItem(appConfig.auth.sessionStorageKey);
  if (!value) return undefined;

  try {
    return JSON.parse(value) as StoredAuthState;
  } catch {
    localStorage.removeItem(appConfig.auth.sessionStorageKey);
    return undefined;
  }
}

function storeSession(session: AuthSession | null) {
  localStorage.setItem(
    appConfig.auth.sessionStorageKey,
    JSON.stringify({ session } satisfies StoredAuthState),
  );
}

export async function getAuthSession() {
  await wait(150);
  const storedState = readStoredState();
  return storedState?.session ?? null;
}

export async function login(credentials: LoginCredentials) {
  await wait();

  if (
    credentials.email.trim().toLowerCase() !== demoAuthCredentials.email ||
    credentials.password !== demoAuthCredentials.password
  ) {
    throw new ApiError("The email or password is incorrect.", 401);
  }

  const session = createDemoSession();
  storeSession(session);
  return session;
}

export async function logout() {
  await wait(150);
  storeSession(null);
}
