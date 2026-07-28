import { describe, expect, mock, test } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type PropsWithChildren } from "react";
import { ToastProvider } from "~/components/feedback/toast-provider";
import { OrderDetailsSheet } from "~/features/orders/components/order-details-sheet";
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

function TestProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: { retry: false },
          queries: { retry: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
}

describe("OrderDetailsSheet component", () => {
  test("renders complete request details and valid actions", () => {
    render(
      <OrderDetailsSheet
        onClose={() => {}}
        order={createOrder()}
        requestedOrderId="ORD-2001"
      />,
      { wrapper: TestProviders },
    );

    expect(screen.getByText("Guest and request")).toBeDefined();
    expect(screen.getByText("Alice Hart")).toBeDefined();
    expect(screen.getByText("No peanuts.")).toBeDefined();
    expect(screen.getByText("SLA breached")).toBeDefined();
    expect(
      screen.getByRole("button", { name: "Acknowledge order" }),
    ).toBeDefined();
    expect(screen.getByRole("button", { name: "Cancel order" })).toBeDefined();
  });

  test("requires confirmation before cancellation", async () => {
    const user = userEvent.setup();

    render(
      <OrderDetailsSheet
        onClose={() => {}}
        order={createOrder()}
        requestedOrderId="ORD-2001"
      />,
      { wrapper: TestProviders },
    );

    await user.click(screen.getByRole("button", { name: "Cancel order" }));

    const confirmation = screen.getByRole("alertdialog");
    expect(within(confirmation).getByText("Cancel this order?")).toBeDefined();
    expect(
      within(confirmation).getByText(/status cannot be changed/i),
    ).toBeDefined();

    await user.click(
      within(confirmation).getByRole("button", { name: "Keep order" }),
    );
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  test("shows approval context and decision actions", async () => {
    const user = userEvent.setup();

    render(
      <OrderDetailsSheet
        onClose={() => {}}
        order={createOrder({
          approval: {
            currentOccupancy: 2,
            reason: "The extra bed exceeds room capacity.",
            roomCapacity: 2,
          },
          service: "Extra Bed",
          status: "Pending Approval",
        })}
        requestedOrderId="ORD-2001"
      />,
      { wrapper: TestProviders },
    );

    expect(screen.getByText("Manager approval required")).toBeDefined();
    expect(screen.getByText(/Current occupancy: 2/)).toBeDefined();
    expect(
      screen.getByRole("button", { name: "Approve request" }),
    ).toBeDefined();

    await user.click(screen.getByRole("button", { name: "Reject request" }));
    const confirmation = screen.getByRole("alertdialog");
    expect(
      within(confirmation).getByText("Reject this request?"),
    ).toBeDefined();
    expect(
      within(confirmation).getByRole("button", { name: "Keep pending" }),
    ).toBeDefined();
  });

  test("keeps terminal orders read-only", () => {
    render(
      <OrderDetailsSheet
        onClose={() => {}}
        order={createOrder({ status: "Completed" })}
        requestedOrderId="ORD-2001"
      />,
      { wrapper: TestProviders },
    );

    expect(screen.getAllByText("Completed").length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "Cancel order" })).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Acknowledge order" }),
    ).toBeNull();
  });

  test("shows loading and missing-order states", () => {
    const onClose = mock(() => {});
    const { rerender } = render(
      <OrderDetailsSheet
        isLoading
        onClose={onClose}
        requestedOrderId="ORD-404"
      />,
      { wrapper: TestProviders },
    );

    expect(screen.getByText("Loading order")).toBeDefined();

    rerender(
      <OrderDetailsSheet onClose={onClose} requestedOrderId="ORD-404" />,
    );

    expect(screen.getByText("Order not found")).toBeDefined();
    expect(screen.getByText(/could not find ORD-404/i)).toBeDefined();
  });
});
