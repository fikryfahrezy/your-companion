export const appConfig = {
  brand: {
    name: "CMPNION",
    tagline: "Hotel operations",
  },
  currency: "USD",
  locale: "en-US",
  themeStorageKey: "cmpnion-theme",
  auth: {
    sessionStorageKey: "cmpnion-auth-session",
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
