import { useMemo } from "react";
import { useOrdersQuery } from "~/features/orders/api/orders-queries";
import {
  isApprovalRequired,
  isOrderSlaBreached,
  ORDER_LIST_CONFIG,
} from "~/features/orders/config/order-policy";
import {
  getDashboardMetrics,
  type DashboardMetrics,
} from "~/features/dashboard/lib/dashboard-metrics";
import {
  PAYMENT_STATUS,
  orderStatuses,
  serviceTypes,
  type Order,
  type OrderStatus,
  type ServiceType,
} from "~/features/orders/model/order";
import { useUrlSearchParams } from "~/hooks/use-url-search-params";
import { formatLongDate } from "~/lib/formatters";
import { parseBooleanParam } from "~/lib/search-params";

export type DashboardStatusCount = {
  status: OrderStatus;
  count: number;
};

export type DashboardServiceCount = {
  service: ServiceType;
  count: number;
};

export type DashboardData = {
  metrics: DashboardMetrics;
  statusCounts: DashboardStatusCount[];
  serviceCounts: DashboardServiceCount[];
  attentionOrders: Order[];
  recentOrders: Order[];
};

function getDashboardData(orders: Order[]): DashboardData {
  const statusCounts = orderStatuses.map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }));
  const serviceCounts = serviceTypes
    .map((service) => ({
      service,
      count: orders
        .filter((order) => order.service === service)
        .reduce((total, order) => total + order.quantity, 0),
    }))
    .sort((left, right) => right.count - left.count);
  const attentionOrders = orders
    .filter(
      (order) =>
        isApprovalRequired(order) ||
        isOrderSlaBreached(order) ||
        order.paymentStatus === PAYMENT_STATUS.FAILED,
    )
    .sort(
      (left, right) =>
        new Date(left.orderTime).getTime() -
        new Date(right.orderTime).getTime(),
    );
  const recentOrders = [...orders]
    .sort(
      (left, right) =>
        new Date(right.orderTime).getTime() -
        new Date(left.orderTime).getTime(),
    )
    .slice(0, 5);

  return {
    metrics: getDashboardMetrics(orders),
    statusCounts,
    serviceCounts,
    attentionOrders,
    recentOrders,
  };
}

export function useDashboard() {
  const { removeSearchParams, searchParams } = useUrlSearchParams();
  const simulateError = parseBooleanParam(searchParams.get("apiError"));
  const ordersQuery = useOrdersQuery({
    pageSize: ORDER_LIST_CONFIG.dashboardPageSize,
    simulateError,
  });
  const data = useMemo(
    () =>
      ordersQuery.data ? getDashboardData(ordersQuery.data.items) : undefined,
    [ordersQuery.data],
  );

  const restoreData = simulateError
    ? () => removeSearchParams(["apiError"])
    : undefined;

  return {
    data,
    errorMessage: ordersQuery.error?.message,
    isError: ordersQuery.isError,
    isPending: ordersQuery.isPending,
    restoreData,
    retry: () => void ordersQuery.refetch(),
    today: formatLongDate(new Date()),
    totalOrders: ordersQuery.data?.total ?? 0,
  };
}
