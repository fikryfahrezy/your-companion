import { lazy } from "react";
import { matchPath } from "react-router";
import type { AppRouteRegistration, NavigationItem } from "~/types/route";
import { dashboardRoute } from "~/features/dashboard/routes/dashboard-route";
import { ordersRoute } from "~/features/orders/routes/orders-route";

export type { NavigationItem } from "~/types/route";

const notFoundRoute = {
  id: "not-found",
  path: "*",
  title: "Page not found",
  Component: lazy(() =>
    import("~/pages/not-found-page").then((module) => ({
      default: module.NotFoundPage,
    })),
  ),
} satisfies AppRouteRegistration;

export const appRoutes: readonly AppRouteRegistration[] = [
  dashboardRoute,
  ordersRoute,
  notFoundRoute,
];

export const navigationItems = appRoutes.flatMap((route) =>
  route.navigation ? [route.navigation] : [],
);

export function isNavigationItemActive(item: NavigationItem, pathname: string) {
  if (item.end) return pathname === item.to;
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

export function getPageTitle(pathname: string) {
  const route = appRoutes.find((candidate) => {
    const path = candidate.index ? "/" : `/${candidate.path}`;
    return matchPath({ path, end: true }, pathname);
  });

  return route?.title ?? "Your Companion";
}
