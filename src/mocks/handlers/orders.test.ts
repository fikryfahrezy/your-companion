import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "bun:test";
import { setupServer } from "msw/node";
import type { Order, PaginatedOrders } from "~/features/orders/model/order";
import { handlers } from "~/mocks/handlers";

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("order mock API", () => {
  test("returns the seeded orders", async () => {
    const response = await fetch(
      "http://localhost/api/orders?page=1&pageSize=20",
    );
    const result = (await response.json()) as PaginatedOrders;

    expect(response.status).toBe(200);
    expect(result.items).toHaveLength(14);
    expect(result.total).toBe(14);
    expect(result.totalPages).toBe(1);
  });

  test("filters before paginating the order list", async () => {
    const response = await fetch(
      "http://localhost/api/orders?status=New&page=1&pageSize=2&sort=oldest",
    );
    const result = (await response.json()) as PaginatedOrders;

    expect(response.status).toBe(200);
    expect(result.items).toHaveLength(2);
    expect(result.items.every(({ status }) => status === "New")).toBe(true);
    expect(result.total).toBe(4);
    expect(result.totalPages).toBe(2);
  });

  test("returns a single order by id", async () => {
    const response = await fetch("http://localhost/api/orders/ORD-1004");
    const order = (await response.json()) as Order;

    expect(response.status).toBe(200);
    expect(order.guestName).toBe("Emma Wilson");
  });

  test("can simulate a loading failure", async () => {
    const response = await fetch(
      "http://localhost/api/orders?simulateError=true",
    );
    const body = (await response.json()) as { message: string };

    expect(response.status).toBe(500);
    expect(body.message).toBe("Unable to load orders. Please try again.");
  });

  test("updates an order through a valid lifecycle transition", async () => {
    const response = await fetch(
      "http://localhost/api/orders/ORD-1001/status",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Acknowledged" }),
      },
    );
    const order = (await response.json()) as Order;

    expect(response.status).toBe(200);
    expect(order.status).toBe("Acknowledged");
  });

  test("rejects an invalid lifecycle transition", async () => {
    const response = await fetch(
      "http://localhost/api/orders/ORD-1003/status",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Acknowledged" }),
      },
    );
    const body = (await response.json()) as { message: string };

    expect(response.status).toBe(409);
    expect(body.message).toContain("cannot move from Completed");
  });

  test("approves an order that requires manager review", async () => {
    const response = await fetch(
      "http://localhost/api/orders/ORD-1004/status",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "New" }),
      },
    );
    const order = (await response.json()) as Order;

    expect(response.status).toBe(200);
    expect(order.status).toBe("New");
    expect(order.approval?.roomCapacity).toBe(2);
  });

  test("creates a simulated incoming order", async () => {
    const response = await fetch("http://localhost/api/orders/simulated", {
      method: "POST",
    });
    const order = (await response.json()) as Order;

    expect(response.status).toBe(201);
    expect(order.id).toBe("ORD-1015");
    expect(order.status).toBe("New");
    expect(order.guestName).toBe("Nadia Putri");

    const detailResponse = await fetch(
      `http://localhost/api/orders/${order.id}`,
    );
    expect(detailResponse.status).toBe(200);
  });
});
