export type AuthUser = {
  email: string;
  firstName: string;
  initials: string;
  name: string;
  role: string;
};

export type AuthSession = {
  authenticatedAt: string;
  user: AuthUser;
};

export type LoginCredentials = {
  email: string;
  password: string;
};
