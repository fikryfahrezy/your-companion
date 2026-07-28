import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { OrdersList } from "~/features/orders/components/orders-list";
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

describe("OrdersList component", () => {
  test("renders order data and flags an overdue new order", () => {
    render(
      <MemoryRouter>
        <OrdersList orders={[createOrder()]} search="q=Alice" />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("ORD-2001").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Alice Hart/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Paid").length).toBeGreaterThan(0);
    expect(screen.getByText("SLA breached")).toBeDefined();
    expect(screen.getByText("Past SLA")).toBeDefined();
  });

  test("preserves list controls when linking to order details", () => {
    render(
      <MemoryRouter>
        <OrdersList
          orders={[createOrder({ status: "Acknowledged" })]}
          search="q=Alice&status=Acknowledged"
        />
      </MemoryRouter>,
    );

    const detailLinks = screen
      .getAllByRole("link")
      .filter((link) =>
        link.getAttribute("href")?.startsWith("/orders/ORD-2001"),
      );

    expect(detailLinks.length).toBeGreaterThan(0);
    for (const link of detailLinks) {
      expect(link.getAttribute("href")).toBe(
        "/orders/ORD-2001?q=Alice&status=Acknowledged",
      );
    }
    expect(screen.queryByText("SLA breached")).toBeNull();
  });
});
