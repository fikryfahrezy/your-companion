import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "~/features/orders/components/order-badges";
import { isOrderSlaBreached } from "~/features/orders/config/order-policy";
import type { Order } from "~/features/orders/model/order";
import { formatCurrency, formatRelativeTime } from "~/lib/formatters";
import { cn } from "~/lib/utils";

function orderLink(orderId: string, search: string) {
  return { pathname: `/orders/${orderId}`, search };
}

export function OrdersList({
  orders,
  search,
}: {
  orders: Order[];
  search: string;
}) {
  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse text-left text-xs">
          <caption className="sr-only">Guest service orders</caption>
          <thead>
            <tr className="border-b bg-muted/50 text-[11px] tracking-wide text-muted-foreground uppercase">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Guest</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 text-center font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="w-12 px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => {
              const breached = isOrderSlaBreached(order);
              return (
                <tr
                  className={cn(
                    "transition-colors hover:bg-muted/50",
                    breached &&
                      "bg-destructive/[0.035] hover:bg-destructive/[0.06]",
                  )}
                  key={order.id}
                >
                  <td className="px-4 py-3.5">
                    <Link
                      className="font-semibold text-primary hover:underline"
                      to={orderLink(order.id, search)}
                    >
                      {order.id}
                    </Link>
                    {breached ? (
                      <Badge
                        className="mt-1 flex w-fit rounded-full border-destructive/20 bg-destructive/10 text-[10px] text-destructive"
                        variant="outline"
                      >
                        <HugeiconsIcon icon={Clock01Icon} size={11} />
                        SLA breached
                      </Badge>
                    ) : null}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium">{order.guestName}</p>
                    <p className="mt-0.5 text-muted-foreground">
                      Room {order.roomNumber}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium">{order.service}</p>
                    <p className="mt-0.5 text-muted-foreground">
                      {formatCurrency(order.amount)}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-center">{order.quantity}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {formatRelativeTime(order.orderTime)}
                  </td>
                  <td className="px-4 py-3.5">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Button
                      aria-label={`View ${order.id}`}
                      nativeButton={false}
                      render={<Link to={orderLink(order.id, search)} />}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <HugeiconsIcon icon={ArrowRight01Icon} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y lg:hidden">
        {orders.map((order) => {
          const breached = isOrderSlaBreached(order);
          return (
            <Link
              className={cn(
                "block p-4 transition-colors hover:bg-muted/50",
                breached && "bg-destructive/[0.035]",
              )}
              key={order.id}
              to={orderLink(order.id, search)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-primary">
                    {order.id}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {order.guestName} · Room {order.roomNumber}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Service</p>
                  <p className="mt-0.5 font-medium">
                    {order.service} × {order.quantity}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment</p>
                  <div className="mt-0.5">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                <span>{formatRelativeTime(order.orderTime)}</span>
                {breached ? (
                  <span className="flex items-center gap-1 font-medium text-destructive">
                    <HugeiconsIcon icon={Clock01Icon} size={13} />
                    Past SLA
                  </span>
                ) : (
                  <span>{formatCurrency(order.amount)}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
