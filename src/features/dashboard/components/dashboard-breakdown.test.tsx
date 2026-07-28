import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import {
  OrderFlowCard,
  ServiceDemandCard,
} from "~/features/dashboard/components/dashboard-breakdown";

describe("dashboard breakdown components", () => {
  test("summarizes workload by status", () => {
    render(
      <OrderFlowCard
        statusCounts={[
          { count: 4, status: "New" },
          { count: 3, status: "Acknowledged" },
          { count: 2, status: "In Progress" },
          { count: 7, status: "Completed" },
          { count: 1, status: "Cancelled" },
        ]}
        totalOrders={17}
      />,
    );

    expect(screen.getByText("Order flow")).toBeDefined();
    expect(screen.getByText("17")).toBeDefined();
    expect(screen.getByText("total orders")).toBeDefined();
    expect(screen.getByText("In Progress")).toBeDefined();
  });

  test("marks the highest-demand service", () => {
    render(
      <ServiceDemandCard
        serviceCounts={[
          { count: 8, service: "Room Service" },
          { count: 5, service: "Housekeeping" },
          { count: 3, service: "Laundry" },
        ]}
      />,
    );

    expect(screen.getByText("Service demand")).toBeDefined();
    expect(screen.getByText("Room Service")).toBeDefined();
    expect(screen.getByText("Top")).toBeDefined();
  });
});
