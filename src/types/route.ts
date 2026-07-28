import { DashboardSquare01Icon } from "@hugeicons/core-free-icons";
import type { ComponentType, LazyExoticComponent } from "react";

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
