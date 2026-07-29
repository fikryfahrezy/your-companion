import { describe, expect, test } from "bun:test";
import { screen, setup } from "@test/react";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "~/features/orders/components/order-badges";
import { orderStatuses, paymentStatuses } from "~/features/orders/model/order";

describe("order badge components", () => {
  test("renders every lifecycle status", () => {
    setup(
      <div>
        {orderStatuses.map((status) => (
          <OrderStatusBadge key={status} status={status} />
        ))}
      </div>,
    );

    for (const status of orderStatuses) {
      expect(screen.getByText(status)).toBeDefined();
    }
  });

  test("renders every payment status", () => {
    setup(
      <div>
        {paymentStatuses.map((status) => (
          <PaymentStatusBadge key={status} status={status} />
        ))}
      </div>,
    );

    for (const status of paymentStatuses) {
      expect(screen.getByText(status)).toBeDefined();
    }
  });
});
