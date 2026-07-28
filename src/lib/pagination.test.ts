import { describe, expect, test } from "bun:test";
import { getPaginationRange, paginateItems } from "~/lib/pagination";

describe("pagination", () => {
  test("returns the requested page and its metadata", () => {
    expect(paginateItems([1, 2, 3, 4, 5], 2, 2)).toEqual({
      items: [3, 4],
      page: 2,
      pageSize: 2,
      total: 5,
      totalPages: 3,
    });
  });

  test("keeps page numbers within the available range", () => {
    expect(paginateItems([1, 2, 3], 10, 2).page).toBe(2);
    expect(paginateItems([], 10, 2)).toEqual({
      items: [],
      page: 1,
      pageSize: 2,
      total: 0,
      totalPages: 1,
    });
  });

  test("calculates visible result boundaries", () => {
    expect(getPaginationRange({ page: 2, pageSize: 8, total: 18 })).toEqual({
      first: 9,
      last: 16,
    });
    expect(getPaginationRange({ page: 1, pageSize: 8, total: 0 })).toEqual({
      first: 0,
      last: 0,
    });
  });
});
