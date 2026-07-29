export const appConfig = {
  brand: {
    name: "Your Companion",
    tagline: "Hotel operations",
  },
  currency: "USD",
  locale: "en-US",
  themeStorageKey: "companion-theme",
  auth: {
    sessionStorageKey: "companion-auth-session",
  },
  realtimeSimulation: {
    delayMs: 5_000,
  },
  hotel: {
    name: "Grand Horizon Hotel",
    location: "Jakarta",
    timeZone: "Asia/Jakarta",
  },
  operator: {
    firstName: "Alex",
    initials: "AM",
    name: "Alex Morgan",
    role: "Duty manager",
  },
} as const;
