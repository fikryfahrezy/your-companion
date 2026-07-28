import type { PaginatedResult } from "~/lib/pagination";

export const ORDER_STATUS = {
  NEW: "New",
  ACKNOWLEDGED: "Acknowledged",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export const orderStatuses = [
  ORDER_STATUS.NEW,
  ORDER_STATUS.ACKNOWLEDGED,
  ORDER_STATUS.IN_PROGRESS,
  ORDER_STATUS.COMPLETED,
  ORDER_STATUS.CANCELLED,
] as const;

export const serviceTypes = [
  "Room Service",
  "Housekeeping",
  "Laundry",
  "Extra Bed",
  "Spa & Massage",
] as const;

export const PAYMENT_STATUS = {
  PAID: "Paid",
  PENDING: "Pending",
  FAILED: "Failed",
} as const;

export const paymentStatuses = [
  PAYMENT_STATUS.PAID,
  PAYMENT_STATUS.PENDING,
  PAYMENT_STATUS.FAILED,
] as const;
export const orderSortDirections = ["newest", "oldest"] as const;

export type OrderStatus = (typeof orderStatuses)[number];
export type ServiceType = (typeof serviceTypes)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];
export type OrderSortDirection = (typeof orderSortDirections)[number];
export type OrderControlKey = "q" | "status" | "service" | "sort";

export type Order = {
  id: string;
  guestName: string;
  roomNumber: string;
  service: ServiceType;
  quantity: number;
  amount: number;
  specialRequest: string;
  orderTime: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
};

export type UpdateOrderStatusInput = {
  orderId: string;
  status: OrderStatus;
};

export type PaginatedOrders = PaginatedResult<Order>;
