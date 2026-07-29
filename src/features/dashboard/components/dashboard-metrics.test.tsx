import { describe, expect, test } from "bun:test";
import { screen, setup, within } from "@test/react";
import { DashboardMetrics } from "~/features/dashboard/components/dashboard-metrics";

describe("DashboardMetrics component", () => {
  test("renders every operational metric with its value and context", () => {
    setup(
      <DashboardMetrics
        metrics={{
          activeGuests: 12,
          averageOrderValue: "$37",
          completedOrders: 18,
          pendingOrders: 7,
          revenueToday: "$654",
        }}
      />,
    );

    const metrics = screen.getByRole("region", { name: "Daily metrics" });

    for (const [label, value] of [
      ["Active guests", "12"],
      ["Pending orders", "7"],
      ["Revenue today", "$654"],
      ["Completed", "18"],
      ["Average order value", "$37"],
    ]) {
      expect(within(metrics).getByText(label)).toBeDefined();
      expect(within(metrics).getByText(value)).toBeDefined();
    }
  });
});
