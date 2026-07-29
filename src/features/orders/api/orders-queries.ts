import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import {
  getOrder,
  listOrders,
  updateOrderStatus,
  type ListOrdersOptions,
} from "~/features/orders/api/orders-api";
import {
  invalidateOrderCache,
  optimisticallyUpdateOrderStatus,
  reconcileUpdatedOrder,
  restoreOrderCache,
  snapshotOrderCache,
} from "~/features/orders/api/orders-cache";
import { orderKeys } from "~/features/orders/api/orders-query-keys";
import { ORDER_QUERY_CONFIG } from "~/features/orders/config/order-policy";
import { useOptimisticMutation } from "~/hooks/use-optimistic-mutation";
import { trackEvent } from "~/lib/analytics";

export { orderKeys } from "~/features/orders/api/orders-query-keys";

export function ordersQueryOptions(options: ListOrdersOptions = {}) {
  return queryOptions({
    queryKey: orderKeys.list(options),
    queryFn: () => listOrders(options),
    placeholderData: keepPreviousData,
    staleTime: ORDER_QUERY_CONFIG.staleTimeMs,
  });
}

export function orderDetailQueryOptions(orderId: string) {
  return queryOptions({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => getOrder(orderId),
    staleTime: ORDER_QUERY_CONFIG.staleTimeMs,
  });
}

export function useOrdersQuery(options: ListOrdersOptions = {}) {
  return useQuery(ordersQueryOptions(options));
}

export function useOrderDetailQuery(
  orderId: string,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    ...orderDetailQueryOptions(orderId),
    enabled: options.enabled ?? Boolean(orderId),
  });
}

export function useUpdateOrderStatus() {
  return useOptimisticMutation({
    mutationFn: updateOrderStatus,
    snapshot: snapshotOrderCache,
    update: optimisticallyUpdateOrderStatus,
    rollback: restoreOrderCache,
    reconcile: reconcileUpdatedOrder,
    invalidate: invalidateOrderCache,
    onStart: (input) => {
      trackEvent({
        name: "order_status_update_started",
        orderId: input.orderId,
        status: input.status,
      });
    },
    onFailure: (error, input) => {
      trackEvent({
        name: "order_status_update_failed",
        error: error.message,
        orderId: input.orderId,
        status: input.status,
      });
    },
    onSuccess: (updatedOrder) => {
      trackEvent({
        name: "order_status_update_succeeded",
        orderId: updatedOrder.id,
        status: updatedOrder.status,
      });
    },
  });
}
