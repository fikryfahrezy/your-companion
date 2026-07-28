import { Badge } from "~/components/ui/badge";
import type { PaymentStatus, OrderStatus } from "~/features/orders/model/order";
import { paymentStyles, statusStyles } from "~/features/orders/lib/order-utils";
import { cn } from "~/lib/utils";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={cn("rounded-full border", statusStyles[status])}>
      {status}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge className={cn("rounded-full border", paymentStyles[status])}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </Badge>
  );
}
