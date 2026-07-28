import type { PaginatedResult } from "~/lib/pagination";

export const orderStatuses = [
  "New",
  "Acknowledged",
  "In Progress",
  "Completed",
  "Cancelled",
] as const;

export const serviceTypes = [
  "Room Service",
  "Housekeeping",
  "Laundry",
  "Extra Bed",
  "Spa & Massage",
] as const;

export const paymentStatuses = ["Paid", "Pending", "Failed"] as const;
export const orderSortDirections = ["newest", "oldest"] as const;

export type OrderStatus = (typeof orderStatuses)[number];
export type ServiceType = (typeof serviceTypes)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];
export type OrderSortDirection = (typeof orderSortDirections)[number];

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
