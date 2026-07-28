import { describe, expect, test } from "bun:test";
import { orderPaths } from "~/features/orders/routes/order-paths";

describe("order paths", () => {
  test("keeps registration and navigation paths aligned", () => {
    expect(orderPaths.registrationPattern).toBe("orders/:orderId?");
    expect(orderPaths.list).toBe("/orders");
    expect(orderPaths.details("ORD-1001")).toBe("/orders/ORD-1001");
  });

  test("encodes dynamic path segments", () => {
    expect(orderPaths.details("ORD 10/01")).toBe("/orders/ORD%2010%2F01");
  });
});
