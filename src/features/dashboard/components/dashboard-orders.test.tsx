import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import {
  AttentionOrdersCard,
  RecentOrdersCard,
} from "~/features/dashboard/components/dashboard-orders";
import type { Order } from "~/features/orders/model/order";

function createOrder(overrides: Partial<Order> = {}): Order {
  return {
    amount: 45,
    guestName: "Alice Hart",
    id: "ORD-2001",
    orderTime: new Date(Date.now() - 20 * 60_000).toISOString(),
    paymentStatus: "Paid",
    quantity: 2,
    roomNumber: "204",
    service: "Room Service",
    specialRequest: "No peanuts.",
    status: "New",
    ...overrides,
  };
}

describe("dashboard order cards", () => {
  test("explains why each order needs attention", () => {
    render(
      <MemoryRouter>
        <AttentionOrdersCard
          orders={[
            createOrder({
              approval: {
                currentOccupancy: 2,
                reason: "The extra bed exceeds room capacity.",
                roomCapacity: 2,
              },
              guestName: "Emma Wilson",
              id: "ORD-2000",
              service: "Extra Bed",
              status: "Pending Approval",
            }),
            createOrder(),
            createOrder({
              guestName: "Bob Chen",
              id: "ORD-2002",
              paymentStatus: "Failed",
              status: "Acknowledged",
            }),
          ]}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText(/past the 15-minute SLA/)).toBeDefined();
    expect(
      screen.getByText("Extra Bed request requires manager approval"),
    ).toBeDefined();
    expect(screen.getByText("Payment failed and needs review")).toBeDefined();
    expect(
      screen
        .getByRole("link", { name: /Alice Hart · Room 204/ })
        .getAttribute("href"),
    ).toBe("/orders/ORD-2001");
  });

  test("links recent orders and the full order list", () => {
    render(
      <MemoryRouter>
        <RecentOrdersCard orders={[createOrder()]} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("button", { name: "View all" }).getAttribute("href"),
    ).toBe("/orders");
    expect(
      screen
        .getByRole("link", { name: /Alice Hart · Room 204/ })
        .getAttribute("href"),
    ).toBe("/orders/ORD-2001");
  });
});
