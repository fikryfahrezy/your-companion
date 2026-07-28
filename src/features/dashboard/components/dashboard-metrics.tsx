import {
  ChartAverageIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Dollar01Icon,
  UserGroup02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { DashboardMetrics as DashboardMetricsData } from "~/features/dashboard/lib/dashboard-metrics";
import { cn } from "~/lib/utils";

const metricDefinitions = [
  {
    key: "activeGuests",
    label: "Active guests",
    icon: UserGroup02Icon,
    hint: "with open requests",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    key: "pendingOrders",
    label: "Pending orders",
    icon: Clock01Icon,
    hint: "need attention",
    color: "text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    key: "revenueToday",
    label: "Revenue today",
    icon: Dollar01Icon,
    hint: "paid services",
    color:
      "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300",
  },
  {
    key: "completedOrders",
    label: "Completed",
    icon: CheckmarkCircle02Icon,
    hint: "orders today",
    color:
      "text-violet-600 bg-violet-50 dark:bg-violet-950 dark:text-violet-300",
  },
  {
    key: "averageOrderValue",
    label: "Average order value",
    icon: ChartAverageIcon,
    hint: "paid orders",
    color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300",
  },
] as const;

export function DashboardMetrics({
  metrics,
}: {
  metrics: DashboardMetricsData;
}) {
  return (
    <section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
      aria-label="Daily metrics"
    >
      {metricDefinitions.map((definition) => (
        <Card className="rounded-xl" key={definition.key}>
          <CardHeader>
            <CardTitle className="font-sans text-xs text-muted-foreground">
              {definition.label}
            </CardTitle>
            <CardAction>
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg",
                  definition.color,
                )}
              >
                <HugeiconsIcon
                  icon={definition.icon}
                  size={18}
                  strokeWidth={2}
                />
              </span>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-semibold tracking-tight">
              {metrics[definition.key]}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {definition.hint}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
