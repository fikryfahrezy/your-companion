import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  listOrders,
  getOrder,
  updateOrderStatus,
  type ListOrdersOptions,
} from "~/features/orders/api/orders-api";
import { ORDER_QUERY_CONFIG } from "~/features/orders/config/order-policy";
import type { PaginatedOrders } from "~/features/orders/model/order";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (options: ListOrdersOptions = {}) =>
    [...orderKeys.lists(), options] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (orderId: string) => [...orderKeys.details(), orderId] as const,
};

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

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: async (updatedOrder) => {
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
      queryClient.setQueryData(orderKeys.detail(updatedOrder.id), updatedOrder);
      await queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}
