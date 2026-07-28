import {
  Alert02Icon,
  ArrowRight01Icon,
  Clock01Icon,
  Dollar01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "~/features/orders/components/order-badges";
import {
  isApprovalRequired,
  isOrderSlaBreached,
  ORDER_SLA_POLICY,
} from "~/features/orders/config/order-policy";
import { formatRelativeTime } from "~/lib/formatters";
import type { Order } from "~/features/orders/model/order";
import { orderPaths } from "~/features/orders/routes/order-paths";

export function AttentionOrdersCard({ orders }: { orders: Order[] }) {
  return (
    <Card className="rounded-xl">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon className="text-destructive" icon={Alert02Icon} />
          Needs attention
        </CardTitle>
        <CardDescription>SLA breaches and payment failures</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {orders.map((order) => {
          const approvalRequired = isApprovalRequired(order);
          const slaBreached = isOrderSlaBreached(order);

          return (
            <Link
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/70"
              key={order.id}
              to={orderPaths.details(order.id)}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <HugeiconsIcon
                  icon={
                    approvalRequired
                      ? Alert02Icon
                      : slaBreached
                        ? Clock01Icon
                        : Dollar01Icon
                  }
                  size={18}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-semibold">
                    {order.guestName} · Room {order.roomNumber}
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {formatRelativeTime(order.orderTime)}
                  </span>
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {approvalRequired
                    ? "Extra Bed request requires manager approval"
                    : slaBreached
                      ? `New order is past the ${ORDER_SLA_POLICY.breachAfterMinutes}-minute SLA`
                      : "Payment failed and needs review"}
                </span>
              </span>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function RecentOrdersCard({ orders }: { orders: Order[] }) {
  return (
    <Card className="rounded-xl">
      <CardHeader className="border-b">
        <CardTitle>Recent orders</CardTitle>
        <CardAction>
          <Button
            nativeButton={false}
            render={<Link to={orderPaths.list} />}
            size="sm"
            variant="ghost"
          >
            View all
            <HugeiconsIcon data-icon="inline-end" icon={ArrowRight01Icon} />
          </Button>
        </CardAction>
        <CardDescription>Latest guest service requests</CardDescription>
      </CardHeader>
      <CardContent className="divide-y px-0">
        {orders.map((order) => (
          <Link
            className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/60"
            key={order.id}
            to={orderPaths.details(order.id)}
          >
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold">
                {order.guestName} · Room {order.roomNumber}
              </span>
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                {order.service} · {formatRelativeTime(order.orderTime)}
              </span>
            </span>
            <span className="flex items-center gap-3">
              <span className="hidden sm:block">
                <PaymentStatusBadge status={order.paymentStatus} />
              </span>
              <OrderStatusBadge status={order.status} />
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
