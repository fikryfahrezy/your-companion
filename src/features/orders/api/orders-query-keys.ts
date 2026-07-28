import type { ListOrdersOptions } from "~/features/orders/api/orders-api";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (options: ListOrdersOptions = {}) =>
    [...orderKeys.lists(), options] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (orderId: string) => [...orderKeys.details(), orderId] as const,
};
