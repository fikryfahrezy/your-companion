import {
  DashboardSquare01Icon,
  Invoice02Icon,
} from "@hugeicons/core-free-icons";
import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { matchPath } from "react-router";

type NavigationIcon = typeof DashboardSquare01Icon;

export type NavigationItem = {
  label: string;
  to: string;
  icon: NavigationIcon;
  end: boolean;
};

type RouteRegistrationBase = {
  id: string;
  title: string;
  Component: LazyExoticComponent<ComponentType>;
  navigation?: NavigationItem;
};

type IndexRouteRegistration = RouteRegistrationBase & {
  index: true;
  path?: never;
};

type PathRouteRegistration = RouteRegistrationBase & {
  index?: false;
  path: string;
};

export type AppRouteRegistration =
  | IndexRouteRegistration
  | PathRouteRegistration;

export const appRoutes: readonly AppRouteRegistration[] = [];

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

  return route?.title ?? "CMPNION";
}
