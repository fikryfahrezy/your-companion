import { describe, expect, test } from "bun:test";
import {
  getNextOrderStatus,
  getOrderStatusActionLabel,
  isFinalOrderStatus,
  isOrderSlaBreached,
  ORDER_FINAL_STATUSES,
  ORDER_LIST_CONFIG,
  ORDER_SLA_POLICY,
  ORDER_STATUS_ACTIONS,
  ORDER_STATUS_TRANSITIONS,
} from "~/features/orders/config/order-policy";
import {
  orderStatuses,
  type Order,
  type OrderStatus,
} from "~/features/orders/model/order";

function createOrder(status: OrderStatus, ageInMinutes: number): Order {
  return {
    id: "ORD-POLICY",
    guestName: "Policy Test",
    roomNumber: "001",
    service: "Room Service",
    quantity: 1,
    amount: 10,
    specialRequest: "",
    orderTime: new Date(Date.now() - ageInMinutes * 60_000).toISOString(),
    status,
    paymentStatus: "Pending",
  };
}

describe("order policy", () => {
  test("breaches SLA only for overdue orders in the monitored status", () => {
    expect(
      isOrderSlaBreached(
        createOrder(
          ORDER_SLA_POLICY.monitoredStatus,
          ORDER_SLA_POLICY.breachAfterMinutes + 1,
        ),
      ),
    ).toBe(true);
    expect(
      isOrderSlaBreached(
        createOrder(
          ORDER_SLA_POLICY.monitoredStatus,
          ORDER_SLA_POLICY.breachAfterMinutes - 1,
        ),
      ),
    ).toBe(false);
    expect(
      isOrderSlaBreached(
        createOrder("Acknowledged", ORDER_SLA_POLICY.breachAfterMinutes + 1),
      ),
    ).toBe(false);
  });

  test("keeps lifecycle actions consistent with allowed transitions", () => {
    for (const status of orderStatuses) {
      const action = ORDER_STATUS_ACTIONS[status];
      if (!action) continue;

      expect(
        ORDER_STATUS_TRANSITIONS[status].some(
          (nextStatus) => nextStatus === action.nextStatus,
        ),
      ).toBe(true);
      expect(getNextOrderStatus(status)).toBe(action.nextStatus);
      expect(getOrderStatusActionLabel(status)).toBe(action.label);
    }
  });

  test("keeps final states terminal", () => {
    for (const status of ORDER_FINAL_STATUSES) {
      expect(isFinalOrderStatus(status)).toBe(true);
      expect(ORDER_STATUS_TRANSITIONS[status]).toHaveLength(0);
      expect(getNextOrderStatus(status)).toBeUndefined();
      expect(getOrderStatusActionLabel(status)).toBeUndefined();
    }
  });

  test("keeps pagination defaults within configured limits", () => {
    expect(ORDER_LIST_CONFIG.pageSizes).toContain(
      ORDER_LIST_CONFIG.defaultPageSize,
    );
    expect(ORDER_LIST_CONFIG.dashboardPageSize).toBeLessThanOrEqual(
      ORDER_LIST_CONFIG.maximumPageSize,
    );
  });
});
