export function isOneOf<const T>(
  value: unknown,
  allowedValues: readonly T[],
): value is T {
  return allowedValues.some((allowedValue) => allowedValue === value);
}
