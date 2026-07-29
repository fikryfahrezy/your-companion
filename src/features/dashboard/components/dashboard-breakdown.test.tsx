import { describe, expect, test } from "bun:test";
import { screen, setup } from "@test/react";
import {
  OrderFlowCard,
  ServiceDemandCard,
} from "~/features/dashboard/components/dashboard-breakdown";

describe("dashboard breakdown components", () => {
  test("summarizes workload by status", () => {
    setup(
      <OrderFlowCard
        statusCounts={[
          { count: 1, status: "Pending Approval" },
          { count: 4, status: "New" },
          { count: 3, status: "Acknowledged" },
          { count: 2, status: "In Progress" },
          { count: 7, status: "Completed" },
          { count: 1, status: "Cancelled" },
        ]}
        totalOrders={18}
      />,
    );

    expect(screen.getByText("Order flow")).toBeDefined();
    expect(screen.getByText("18")).toBeDefined();
    expect(screen.getByText("total orders")).toBeDefined();
    expect(screen.getByText("In Progress")).toBeDefined();
    expect(screen.getByText("Pending Approval")).toBeDefined();
  });

  test("marks the highest-demand service", () => {
    setup(
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
