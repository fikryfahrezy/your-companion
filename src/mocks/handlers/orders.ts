import { delay, http, HttpResponse } from "msw";
import {
  ORDER_LIST_CONFIG,
  ORDER_STATUS_TRANSITIONS,
} from "~/features/orders/config/order-policy";
import {
  orderSortDirections,
  orderStatuses,
  serviceTypes,
  type Order,
  type OrderStatus,
  type PaginatedOrders,
  type ServiceType,
  type UpdateOrderStatusInput,
} from "~/features/orders/model/order";
import { paginateItems } from "~/lib/pagination";
import {
  parsePositiveIntegerParam,
  parseStringParam,
} from "~/lib/search-params";
import { isOneOf } from "~/lib/type-guards";
import { initialOrders } from "~/mocks/data/orders";

const responseDelay = 450;
let orders = structuredClone(initialOrders);

function isOrderStatus(value: unknown): value is OrderStatus {
  return isOneOf(value, orderStatuses);
}

function isServiceType(value: unknown): value is ServiceType {
  return isOneOf(value, serviceTypes);
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
    const sort = parseStringParam(
      searchParams.get("sort"),
      orderSortDirections,
      "newest",
    );
    const requestedPage = parsePositiveIntegerParam(
      searchParams.get("page"),
      1,
    );
    const pageSize = Math.min(
      parsePositiveIntegerParam(
        searchParams.get("pageSize"),
        ORDER_LIST_CONFIG.defaultPageSize,
      ),
      ORDER_LIST_CONFIG.maximumPageSize,
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

    const response: PaginatedOrders = paginateItems(
      matchingOrders,
      requestedPage,
      pageSize,
    );

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

  http.post("*/api/orders/simulated", async () => {
    await delay(responseDelay);

    const nextSequence =
      Math.max(...orders.map(({ id }) => Number(id.match(/\d+$/)?.[0] ?? 0))) +
      1;
    const incomingOrder: Order = {
      id: `ORD-${nextSequence}`,
      guestName: "Nadia Putri",
      roomNumber: "608",
      service: "Room Service",
      quantity: 1,
      amount: 32,
      specialRequest: "Vegetarian meal, no dairy.",
      orderTime: new Date().toISOString(),
      status: "New",
      paymentStatus: "Pending",
    };

    orders = [incomingOrder, ...orders];
    return HttpResponse.json(incomingOrder, { status: 201 });
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

      if (
        !ORDER_STATUS_TRANSITIONS[order.status].some(
          (status) => status === body.status,
        )
      ) {
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
