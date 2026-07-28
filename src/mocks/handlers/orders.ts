import { delay, http, HttpResponse } from "msw";
import {
  orderStatuses,
  serviceTypes,
  type Order,
  type OrderStatus,
  type PaginatedOrders,
  type ServiceType,
  type UpdateOrderStatusInput,
} from "~/features/orders/model/order";
import { initialOrders } from "~/mocks/data/orders";

const responseDelay = 450;
let orders = structuredClone(initialOrders);

const allowedTransitions: Record<OrderStatus, readonly OrderStatus[]> = {
  New: ["Acknowledged", "Cancelled"],
  Acknowledged: ["In Progress", "Cancelled"],
  "In Progress": ["Completed", "Cancelled"],
  Completed: [],
  Cancelled: [],
};

function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === "string" && orderStatuses.includes(value as OrderStatus)
  );
}

function isServiceType(value: unknown): value is ServiceType {
  return (
    typeof value === "string" && serviceTypes.includes(value as ServiceType)
  );
}

function toPositiveInteger(value: string | null, fallback: number) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

export const orderHandlers = [
  http.get("*/api/orders", async ({ request }) => {
    await delay(responseDelay);

    const searchParams = new URL(request.url).searchParams;

    if (searchParams.get("simulateError") === "true") {
      return HttpResponse.json(
        { message: "Unable to load orders. Please try again." },
        { status: 500 },
      );
    }

    const query = searchParams.get("q")?.trim().toLowerCase() ?? "";
    const status = searchParams.get("status");
    const service = searchParams.get("service");
    const sort = searchParams.get("sort") === "oldest" ? "oldest" : "newest";
    const requestedPage = toPositiveInteger(searchParams.get("page"), 1);
    const pageSize = Math.min(
      toPositiveInteger(searchParams.get("pageSize"), 8),
      100,
    );

    const matchingOrders = orders
      .filter((order) => {
        const matchesQuery =
          !query ||
          order.guestName.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query) ||
          order.roomNumber.toLowerCase().includes(query);
        const matchesStatus = !isOrderStatus(status) || order.status === status;
        const matchesService =
          !isServiceType(service) || order.service === service;

        return matchesQuery && matchesStatus && matchesService;
      })
      .sort((left, right) => {
        const difference =
          new Date(right.orderTime).getTime() -
          new Date(left.orderTime).getTime();
        return sort === "newest" ? difference : -difference;
      });

    const total = matchingOrders.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(requestedPage, totalPages);
    const start = (page - 1) * pageSize;
    const response: PaginatedOrders = {
      items: matchingOrders.slice(start, start + pageSize),
      page,
      pageSize,
      total,
      totalPages,
    };

    return HttpResponse.json(response);
  }),

  http.get<{ orderId: string }>("*/api/orders/:orderId", async ({ params }) => {
    await delay(responseDelay);

    const order = orders.find(({ id }) => id === params.orderId);
    if (!order) {
      return HttpResponse.json(
        { message: `Order ${params.orderId} was not found.` },
        { status: 404 },
      );
    }

    return HttpResponse.json(order);
  }),

  http.patch<{ orderId: string }, Pick<UpdateOrderStatusInput, "status">>(
    "*/api/orders/:orderId/status",
    async ({ params, request }) => {
      await delay(responseDelay);

      const order = orders.find(({ id }) => id === params.orderId);
      if (!order) {
        return HttpResponse.json(
          { message: `Order ${params.orderId} was not found.` },
          { status: 404 },
        );
      }

      const body = await request.json();
      if (!isOrderStatus(body.status)) {
        return HttpResponse.json(
          { message: "A valid order status is required." },
          { status: 400 },
        );
      }

      if (!allowedTransitions[order.status].includes(body.status)) {
        return HttpResponse.json(
          {
            message: `An order cannot move from ${order.status} to ${body.status}.`,
          },
          { status: 409 },
        );
      }

      const updatedOrder: Order = { ...order, status: body.status };
      orders = orders.map((candidate) =>
        candidate.id === updatedOrder.id ? updatedOrder : candidate,
      );

      return HttpResponse.json(updatedOrder);
    },
  ),
];
