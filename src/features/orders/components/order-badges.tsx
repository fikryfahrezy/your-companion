import { UserShield01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "~/components/ui/badge";
import {
  ORDER_STATUS,
  type PaymentStatus,
  type OrderStatus,
} from "~/features/orders/model/order";
import { paymentStyles, statusStyles } from "~/features/orders/lib/order-utils";
import { cn } from "~/lib/utils";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={cn("rounded-full border", statusStyles[status])}>
      {status === ORDER_STATUS.PENDING_APPROVAL ? (
        <HugeiconsIcon
          aria-hidden="true"
          data-icon="inline-start"
          icon={UserShield01Icon}
        />
      ) : null}
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
