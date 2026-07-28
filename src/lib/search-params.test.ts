import { describe, expect, test } from "bun:test";
import {
  parseAllowedIntegerParam,
  parseBooleanParam,
  parsePositiveIntegerParam,
  parseStringParam,
} from "~/lib/search-params";

describe("search param parsing", () => {
  test("accepts only known string values", () => {
    const values = ["newest", "oldest"] as const;

    expect(parseStringParam("oldest", values, "newest")).toBe("oldest");
    expect(parseStringParam("invalid", values, "newest")).toBe("newest");
    expect(parseStringParam(null, values, "newest")).toBe("newest");
  });

  test("accepts only positive integers", () => {
    expect(parsePositiveIntegerParam("3", 1)).toBe(3);
    expect(parsePositiveIntegerParam("0", 1)).toBe(1);
    expect(parsePositiveIntegerParam("1.5", 1)).toBe(1);
    expect(parsePositiveIntegerParam("unknown", 1)).toBe(1);
  });

  test("accepts only allowed integer values", () => {
    const values = [8, 12, 20] as const;

    expect(parseAllowedIntegerParam("12", values, 8)).toBe(12);
    expect(parseAllowedIntegerParam("10", values, 8)).toBe(8);
  });

  test("uses an explicit true value for booleans", () => {
    expect(parseBooleanParam("true")).toBe(true);
    expect(parseBooleanParam("false")).toBe(false);
    expect(parseBooleanParam(null)).toBe(false);
  });
});
