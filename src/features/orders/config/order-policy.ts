import type { Order, OrderStatus } from "~/features/orders/model/order";

type OrderStatusAction = {
  label: string;
  nextStatus: OrderStatus;
};

export const ORDER_SLA_POLICY = {
  breachAfterMinutes: 15,
  monitoredStatus: "New",
} as const satisfies {
  breachAfterMinutes: number;
  monitoredStatus: OrderStatus;
};

export const ORDER_LIFECYCLE_STATUSES = [
  "New",
  "Acknowledged",
  "In Progress",
  "Completed",
] as const satisfies readonly OrderStatus[];

export const ORDER_FINAL_STATUSES = [
  "Completed",
  "Cancelled",
] as const satisfies readonly OrderStatus[];

export const ORDER_STATUS_TRANSITIONS = {
  New: ["Acknowledged", "Cancelled"],
  Acknowledged: ["In Progress", "Cancelled"],
  "In Progress": ["Completed", "Cancelled"],
  Completed: [],
  Cancelled: [],
} as const satisfies Record<OrderStatus, readonly OrderStatus[]>;

export const ORDER_STATUS_ACTIONS: Partial<
  Record<OrderStatus, OrderStatusAction>
> = {
  New: { label: "Acknowledge order", nextStatus: "Acknowledged" },
  Acknowledged: { label: "Start processing", nextStatus: "In Progress" },
  "In Progress": { label: "Mark as completed", nextStatus: "Completed" },
};

export const ORDER_LIST_CONFIG = {
  dashboardPageSize: 100,
  defaultPageSize: 8,
  maximumPageSize: 100,
  pageSizes: [8, 12, 20],
} as const;

export const ORDER_QUERY_CONFIG = {
  staleTimeMs: 30_000,
} as const;

export function isOrderSlaBreached(order: Order) {
  return (
    order.status === ORDER_SLA_POLICY.monitoredStatus &&
    Date.now() - new Date(order.orderTime).getTime() >
      ORDER_SLA_POLICY.breachAfterMinutes * 60_000
  );
}

export function isFinalOrderStatus(status: OrderStatus) {
  return ORDER_FINAL_STATUSES.some((finalStatus) => finalStatus === status);
}

export function getNextOrderStatus(status: OrderStatus) {
  return ORDER_STATUS_ACTIONS[status]?.nextStatus;
}

export function getOrderStatusActionLabel(status: OrderStatus) {
  return ORDER_STATUS_ACTIONS[status]?.label;
}
