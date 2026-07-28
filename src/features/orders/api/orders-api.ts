import type {
  Order,
  OrderSortDirection,
  OrderStatus,
  PaginatedOrders,
  ServiceType,
  UpdateOrderStatusInput,
} from "~/features/orders/model/order";
import { apiRequest } from "~/lib/api-client";

export type ListOrdersOptions = {
  page?: number;
  pageSize?: number;
  q?: string;
  service?: ServiceType;
  simulateError?: boolean;
  sort?: OrderSortDirection;
  status?: OrderStatus;
};

export function listOrders(options: ListOrdersOptions = {}) {
  const searchParams = new URLSearchParams();

  if (options.page) searchParams.set("page", String(options.page));
  if (options.pageSize) searchParams.set("pageSize", String(options.pageSize));
  if (options.q) searchParams.set("q", options.q);
  if (options.service) searchParams.set("service", options.service);
  if (options.simulateError) {
    searchParams.set("simulateError", "true");
  }
  if (options.sort) searchParams.set("sort", options.sort);
  if (options.status) searchParams.set("status", options.status);

  const query = searchParams.size > 0 ? `?${searchParams}` : "";
  return apiRequest<PaginatedOrders>(`/api/orders${query}`);
}

export function getOrder(orderId: string) {
  return apiRequest<Order>(`/api/orders/${orderId}`);
}

export function updateOrderStatus({ orderId, status }: UpdateOrderStatusInput) {
  return apiRequest<Order>(`/api/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
