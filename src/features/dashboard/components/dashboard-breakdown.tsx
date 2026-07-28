import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type {
  DashboardServiceCount,
  DashboardStatusCount,
} from "~/features/dashboard/hooks/use-dashboard";
import {
  serviceColors,
  statusIndicatorStyles,
} from "~/features/orders/lib/order-utils";
import { cn } from "~/lib/utils";

export function OrderFlowCard({
  statusCounts,
  totalOrders,
}: {
  statusCounts: DashboardStatusCount[];
  totalOrders: number;
}) {
  const maximumCount = Math.max(...statusCounts.map(({ count }) => count), 1);

  return (
    <Card className="rounded-xl">
      <CardHeader className="border-b">
        <CardTitle>Order flow</CardTitle>
        <CardDescription>Current workload by order status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-[1fr_180px] sm:items-center">
          <div className="space-y-4">
            {statusCounts.map(({ status, count }) => (
              <div key={status}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium">{status}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-[width]",
                      statusIndicatorStyles[status],
                    )}
                    style={{ width: `${(count / maximumCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex aspect-square items-center justify-center rounded-full border-[18px] border-primary/10 bg-background">
            <div className="text-center">
              <p className="font-heading text-3xl font-semibold">
                {totalOrders}
              </p>
              <p className="text-xs text-muted-foreground">total orders</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ServiceDemandCard({
  serviceCounts,
}: {
  serviceCounts: DashboardServiceCount[];
}) {
  const maximumCount = Math.max(...serviceCounts.map(({ count }) => count), 1);

  return (
    <Card className="rounded-xl">
      <CardHeader className="border-b">
        <CardTitle>Service demand</CardTitle>
        <CardDescription>Units requested by service type</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {serviceCounts.map(({ service, count }, index) => (
          <div className="flex items-center gap-3" key={service}>
            <span className="w-24 truncate text-xs font-medium sm:w-28">
              {service}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full", serviceColors[service])}
                style={{ width: `${(count / maximumCount) * 100}%` }}
              />
            </div>
            <span className="w-5 text-right text-xs text-muted-foreground">
              {count}
            </span>
            {index === 0 ? (
              <Badge
                className="hidden rounded-full sm:inline-flex"
                variant="secondary"
              >
                Top
              </Badge>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
