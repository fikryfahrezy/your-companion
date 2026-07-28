import { isOneOf } from "~/lib/type-guards";

export function parseStringParam<
  const T extends string,
  const Fallback extends string,
>(
  value: string | null,
  allowedValues: readonly T[],
  fallback: Fallback,
): T | Fallback {
  return isOneOf(value, allowedValues) ? value : fallback;
}

export function parsePositiveIntegerParam(
  value: string | null,
  fallback: number,
) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseAllowedIntegerParam<const T extends number>(
  value: string | null,
  allowedValues: readonly T[],
  fallback: T,
) {
  const parsed = Number(value);
  return isOneOf(parsed, allowedValues) ? parsed : fallback;
}

export function parseBooleanParam(value: string | null) {
  return value === "true";
}
