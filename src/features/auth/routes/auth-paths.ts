export const authPaths = {
  login: "/login",
} as const;

export function getSafeReturnTo(value: string | null) {
  if (!value) return "/";

  try {
    const baseUrl = "https://companion.local";
    const target = new URL(value, baseUrl);
    if (target.origin !== baseUrl || target.pathname === authPaths.login) {
      return "/";
    }
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return "/";
  }
}

export function loginPath(returnTo?: string) {
  if (!returnTo || returnTo === "/") return authPaths.login;
  const search = new URLSearchParams({ returnTo });
  return `${authPaths.login}?${search}`;
}
