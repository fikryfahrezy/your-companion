import { generatePath } from "react-router";

const ordersSegment = "orders";
const ordersPath = `/${ordersSegment}` as const;
const orderDetailsPattern = `${ordersPath}/:orderId` as const;

export const orderPaths = {
  registrationPattern: `${ordersSegment}/:orderId?`,
  list: ordersPath,
  details: (orderId: string) => generatePath(orderDetailsPattern, { orderId }),
} as const;
