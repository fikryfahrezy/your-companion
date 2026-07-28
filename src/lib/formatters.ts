import { appConfig } from "~/app/app-config";

const currencyFormatter = new Intl.NumberFormat(appConfig.locale, {
  style: "currency",
  currency: appConfig.currency,
  maximumFractionDigits: 0,
});

const dateTimeFormatter = new Intl.DateTimeFormat(appConfig.locale, {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const longDateFormatter = new Intl.DateTimeFormat(appConfig.locale, {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatDateTime(value: string | Date) {
  return dateTimeFormatter.format(new Date(value));
}

export function formatLongDate(value: string | Date) {
  return longDateFormatter.format(new Date(value));
}

export function formatRelativeTime(value: string | Date) {
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(value).getTime()) / 60_000),
  );

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;
}
