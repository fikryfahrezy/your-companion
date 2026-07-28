export type PaginationMetadata = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type PaginatedResult<T> = PaginationMetadata & {
  items: T[];
};

export function paginateItems<T>(
  items: readonly T[],
  requestedPage: number,
  pageSize: number,
): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total,
    totalPages,
  };
}

export function getPaginationRange({
  page,
  pageSize,
  total,
}: Pick<PaginationMetadata, "page" | "pageSize" | "total">) {
  if (total === 0) return { first: 0, last: 0 };

  return {
    first: (page - 1) * pageSize + 1,
    last: Math.min(page * pageSize, total),
  };
}
