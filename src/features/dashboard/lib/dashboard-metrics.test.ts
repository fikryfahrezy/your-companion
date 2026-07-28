import { describe, expect, test } from "bun:test";
import { getDashboardMetrics } from "~/features/dashboard/lib/dashboard-metrics";
import type { Order } from "~/features/orders/model/order";

function createOrder(overrides: Partial<Order>): Order {
  return {
    id: "ORD-TEST",
    guestName: "Test Guest",
    roomNumber: "101",
    service: "Room Service",
    quantity: 1,
    amount: 0,
    specialRequest: "",
    orderTime: "2026-07-29T05:00:00.000Z",
    status: "New",
    paymentStatus: "Pending",
    ...overrides,
  };
}

describe("dashboard metrics", () => {
  test("scopes daily metrics to the hotel's calendar date", () => {
    const currentDate = new Date("2026-07-29T05:00:00.000Z");
    const orders = [
      createOrder({
        id: "ORD-TODAY-COMPLETED",
        amount: 45,
        orderTime: "2026-07-28T17:30:00.000Z",
        paymentStatus: "Paid",
        status: "Completed",
      }),
      createOrder({
        id: "ORD-YESTERDAY-COMPLETED",
        amount: 55,
        orderTime: "2026-07-28T16:59:00.000Z",
        paymentStatus: "Paid",
        status: "Completed",
      }),
      createOrder({
        id: "ORD-TODAY-NEW",
        guestName: "Current Guest",
        amount: 20,
        paymentStatus: "Paid",
      }),
      createOrder({
        id: "ORD-TODAY-PENDING",
        guestName: "Another Guest",
        amount: 30,
        status: "Acknowledged",
      }),
      createOrder({
        id: "ORD-TODAY-CANCELLED",
        amount: 100,
        paymentStatus: "Paid",
        status: "Cancelled",
      }),
    ];

    expect(getDashboardMetrics(orders, currentDate)).toEqual({
      activeGuests: 2,
      pendingOrders: 2,
      revenueToday: "$65",
      completedOrders: 1,
      averageOrderValue: "$40",
    });
  });

  test("returns zero-value financial metrics when no paid orders exist", () => {
    const metrics = getDashboardMetrics(
      [createOrder({ id: "ORD-PENDING" })],
      new Date("2026-07-29T05:00:00.000Z"),
    );

    expect(metrics.revenueToday).toBe("$0");
    expect(metrics.averageOrderValue).toBe("$0");
  });
});
