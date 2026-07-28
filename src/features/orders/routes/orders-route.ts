import { Invoice02Icon } from "@hugeicons/core-free-icons";
import { lazy } from "react";
import type { AppRouteRegistration } from "~/types/route";
import { orderPaths } from "~/features/orders/routes/order-paths";

export const ordersRoute = {
  id: "orders",
  path: orderPaths.registrationPattern,
  title: "Order management",
  navigation: {
    label: "Orders",
    to: orderPaths.list,
    icon: Invoice02Icon,
    end: false,
  },
  Component: lazy(() =>
    import("~/pages/orders-page").then((module) => ({
      default: module.OrdersPage,
    })),
  ),
} satisfies AppRouteRegistration;
