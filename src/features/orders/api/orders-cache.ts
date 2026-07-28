import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { orderKeys } from "~/features/orders/api/orders-query-keys";
import type {
  Order,
  PaginatedOrders,
  UpdateOrderStatusInput,
} from "~/features/orders/model/order";

export type OrderCacheSnapshot = {
  detail?: Order;
  listSnapshots: Array<[QueryKey, PaginatedOrders | undefined]>;
  order?: Order;
};

function updateOrderInCachedLists(
  queryClient: QueryClient,
  updatedOrder: Order,
) {
  queryClient.setQueriesData<PaginatedOrders>(
    { queryKey: orderKeys.lists() },
    (currentPage) =>
      currentPage
        ? {
            ...currentPage,
            items: currentPage.items.map((order) =>
              order.id === updatedOrder.id ? updatedOrder : order,
            ),
          }
        : undefined,
  );
}

export async function snapshotOrderCache(
  queryClient: QueryClient,
  input: UpdateOrderStatusInput,
): Promise<OrderCacheSnapshot> {
  await Promise.all([
    queryClient.cancelQueries({ queryKey: orderKeys.lists() }),
    queryClient.cancelQueries({ queryKey: orderKeys.detail(input.orderId) }),
  ]);

  const listSnapshots = queryClient.getQueriesData<PaginatedOrders>({
    queryKey: orderKeys.lists(),
  });
  const detail = queryClient.getQueryData<Order>(
    orderKeys.detail(input.orderId),
  );
  const order =
    detail ??
    listSnapshots
      .flatMap(([, page]) => page?.items ?? [])
      .find((candidate) => candidate.id === input.orderId);

  return { detail, listSnapshots, order };
}

export function optimisticallyUpdateOrderStatus(
  queryClient: QueryClient,
  input: UpdateOrderStatusInput,
  snapshot: OrderCacheSnapshot,
) {
  if (!snapshot.order) return;

  const optimisticOrder = { ...snapshot.order, status: input.status };
  updateOrderInCachedLists(queryClient, optimisticOrder);
  queryClient.setQueryData(orderKeys.detail(input.orderId), optimisticOrder);
}

export function restoreOrderCache(
  queryClient: QueryClient,
  input: UpdateOrderStatusInput,
  snapshot: OrderCacheSnapshot,
) {
  snapshot.listSnapshots.forEach(([queryKey, page]) => {
    queryClient.setQueryData(queryKey, page);
  });

  if (snapshot.detail) {
    queryClient.setQueryData(orderKeys.detail(input.orderId), snapshot.detail);
  } else {
    queryClient.removeQueries({
      exact: true,
      queryKey: orderKeys.detail(input.orderId),
    });
  }
}

export function reconcileUpdatedOrder(
  queryClient: QueryClient,
  updatedOrder: Order,
) {
  updateOrderInCachedLists(queryClient, updatedOrder);
  queryClient.setQueryData(orderKeys.detail(updatedOrder.id), updatedOrder);
}

export function invalidateOrderCache(
  queryClient: QueryClient,
  input: UpdateOrderStatusInput,
) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
    queryClient.invalidateQueries({
      queryKey: orderKeys.detail(input.orderId),
    }),
  ]);
}
