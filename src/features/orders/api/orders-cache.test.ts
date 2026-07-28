import { describe, expect, test } from "bun:test";
import { QueryClient } from "@tanstack/react-query";
import {
  optimisticallyUpdateOrderStatus,
  reconcileUpdatedOrder,
  restoreOrderCache,
  snapshotOrderCache,
} from "~/features/orders/api/orders-cache";
import { orderKeys } from "~/features/orders/api/orders-query-keys";
import type { Order, PaginatedOrders } from "~/features/orders/model/order";
import { initialOrders } from "~/mocks/data/orders";

describe("order cache", () => {
  test("applies an optimistic status and restores the previous cache", async () => {
    const queryClient = new QueryClient();
    const originalOrder = initialOrders[0]!;
    const listKey = orderKeys.list({ page: 1 });
    const page: PaginatedOrders = {
      items: [originalOrder],
      page: 1,
      pageSize: 8,
      total: 1,
      totalPages: 1,
    };
    const input = {
      orderId: originalOrder.id,
      status: "Acknowledged",
    } as const;
    queryClient.setQueryData(listKey, page);

    const snapshot = await snapshotOrderCache(queryClient, input);
    optimisticallyUpdateOrderStatus(queryClient, input, snapshot);

    expect(
      queryClient.getQueryData<PaginatedOrders>(listKey)?.items[0]?.status,
    ).toBe("Acknowledged");
    expect(
      queryClient.getQueryData<Order>(orderKeys.detail(originalOrder.id)),
    ).toEqual({ ...originalOrder, status: "Acknowledged" });

    restoreOrderCache(queryClient, input, snapshot);

    expect(
      queryClient.getQueryData<PaginatedOrders>(listKey)?.items[0]?.status,
    ).toBe("New");
    expect(
      queryClient.getQueryData<Order>(orderKeys.detail(originalOrder.id)),
    ).toBeUndefined();
  });

  test("reconciles list and detail caches with the server response", () => {
    const queryClient = new QueryClient();
    const originalOrder = initialOrders[0]!;
    const updatedOrder = { ...originalOrder, status: "Acknowledged" } as const;
    const listKey = orderKeys.list();
    queryClient.setQueryData<PaginatedOrders>(listKey, {
      items: [originalOrder],
      page: 1,
      pageSize: 8,
      total: 1,
      totalPages: 1,
    });

    reconcileUpdatedOrder(queryClient, updatedOrder);

    expect(
      queryClient.getQueryData<PaginatedOrders>(listKey)?.items[0],
    ).toEqual(updatedOrder);
    expect(
      queryClient.getQueryData<Order>(orderKeys.detail(originalOrder.id)),
    ).toEqual(updatedOrder);
  });
});
