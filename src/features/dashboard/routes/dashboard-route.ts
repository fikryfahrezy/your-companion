import { DashboardSquare01Icon } from "@hugeicons/core-free-icons";
import { lazy } from "react";
import type { AppRouteRegistration } from "~/types/route";
import { dashboardPaths } from "~/features/dashboard/routes/dashboard-paths";

export const dashboardRoute = {
  id: "overview",
  index: true,
  title: "Operations overview",
  navigation: {
    label: "Overview",
    to: dashboardPaths.overview,
    icon: DashboardSquare01Icon,
    end: true,
  },
  Component: lazy(() =>
    import("~/pages/dashboard-page").then((module) => ({
      default: module.DashboardPage,
    })),
  ),
} satisfies AppRouteRegistration;
