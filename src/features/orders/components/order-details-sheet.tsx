import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { useToast } from "~/components/feedback/toast-provider";
import { useUpdateOrderStatus } from "~/features/orders/api/orders-queries";
import {
  getNextOrderStatus,
  getOrderStatusActionLabel,
  isFinalOrderStatus,
  isOrderSlaBreached,
  ORDER_LIFECYCLE_STATUSES,
  ORDER_SLA_POLICY,
} from "~/features/orders/config/order-policy";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "~/features/orders/components/order-badges";
import type { Order, OrderStatus } from "~/features/orders/model/order";
import {
  formatCurrency,
  formatDateTime,
  formatRelativeTime,
} from "~/lib/formatters";
import { cn } from "~/lib/utils";

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}

export function OrderDetailsSheet({
  order,
  requestedOrderId,
  isLoading = false,
  onClose,
}: {
  order?: Order;
  requestedOrderId?: string;
  isLoading?: boolean;
  onClose: () => void;
}) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const updateStatus = useUpdateOrderStatus();
  const { notify } = useToast();

  const handleStatusUpdate = async (status: OrderStatus) => {
    if (!order) return;

    try {
      await updateStatus.mutateAsync({ orderId: order.id, status });
      notify({
        title: status === "Cancelled" ? "Order cancelled" : "Order updated",
        description: `${order.id} is now ${status.toLowerCase()}.`,
        variant: status === "Cancelled" ? "error" : "success",
      });
      setCancelDialogOpen(false);
    } catch (error) {
      notify({
        title: "Update failed",
        description:
          error instanceof Error
            ? error.message
            : "The order could not be updated.",
        variant: "error",
      });
    }
  };

  const nextStatus = order ? getNextOrderStatus(order.status) : undefined;
  const actionLabel = order
    ? getOrderStatusActionLabel(order.status)
    : undefined;
  const currentStep = order
    ? ORDER_LIFECYCLE_STATUSES.findIndex((status) => status === order.status)
    : -1;

  return (
    <>
      <Sheet
        open={Boolean(requestedOrderId)}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <SheetContent className="w-full sm:max-w-xl" side="right">
          {isLoading ? (
            <div
              className="flex h-full flex-col items-center justify-center p-8 text-center"
              aria-busy="true"
            >
              <span className="size-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
              <SheetTitle className="mt-4 text-lg">Loading order</SheetTitle>
              <SheetDescription className="mt-1">
                Retrieving {requestedOrderId} details…
              </SheetDescription>
            </div>
          ) : order ? (
            <>
              <SheetHeader className="border-b px-5 py-5 sm:px-6">
                <div className="flex items-center gap-2 pr-8">
                  <SheetTitle className="text-lg">{order.id}</SheetTitle>
                  <OrderStatusBadge status={order.status} />
                </div>
                <SheetDescription>
                  Submitted {formatRelativeTime(order.orderTime)} by{" "}
                  {order.guestName}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                {isOrderSlaBreached(order) ? (
                  <div className="mb-5 flex gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-destructive">
                    <HugeiconsIcon
                      className="mt-0.5 shrink-0"
                      icon={Clock01Icon}
                      size={18}
                      strokeWidth={2}
                    />
                    <div>
                      <p className="text-xs font-semibold">SLA breached</p>
                      <p className="mt-0.5 text-xs opacity-80">
                        This order has remained new for more than{" "}
                        {ORDER_SLA_POLICY.breachAfterMinutes} minutes.
                      </p>
                    </div>
                  </div>
                ) : null}

                <section aria-labelledby="progress-heading">
                  <h2 className="text-xs font-semibold" id="progress-heading">
                    Order progress
                  </h2>
                  {order.status === "Cancelled" ? (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                      <HugeiconsIcon icon={Alert02Icon} size={18} />
                      This order was cancelled.
                    </div>
                  ) : (
                    <ol
                      className="mt-4 grid grid-cols-4"
                      aria-label="Order lifecycle"
                    >
                      {ORDER_LIFECYCLE_STATUSES.map((status, index) => {
                        const complete = index <= currentStep;
                        return (
                          <li className="relative text-center" key={status}>
                            {index > 0 ? (
                              <span
                                className={cn(
                                  "absolute top-3 right-1/2 h-0.5 w-full bg-border",
                                  complete && "bg-primary",
                                )}
                              />
                            ) : null}
                            <span
                              className={cn(
                                "relative z-10 mx-auto flex size-6 items-center justify-center rounded-full border bg-background text-[10px] font-semibold text-muted-foreground",
                                complete &&
                                  "border-primary bg-primary text-primary-foreground",
                              )}
                            >
                              {index < currentStep ? (
                                <HugeiconsIcon
                                  icon={CheckmarkCircle02Icon}
                                  size={14}
                                />
                              ) : (
                                index + 1
                              )}
                            </span>
                            <span
                              className={cn(
                                "mt-2 block text-[10px] leading-tight text-muted-foreground",
                                complete && "font-semibold text-foreground",
                              )}
                            >
                              {status}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </section>

                <Separator className="my-6" />

                <section aria-labelledby="guest-heading">
                  <h2 className="text-xs font-semibold" id="guest-heading">
                    Guest and request
                  </h2>
                  <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-5">
                    <DetailItem label="Guest" value={order.guestName} />
                    <DetailItem label="Room" value={order.roomNumber} />
                    <DetailItem label="Service" value={order.service} />
                    <DetailItem label="Quantity" value={order.quantity} />
                    <DetailItem
                      label="Order time"
                      value={formatDateTime(order.orderTime)}
                    />
                    <DetailItem
                      label="Amount"
                      value={formatCurrency(order.amount)}
                    />
                  </dl>
                </section>

                <Separator className="my-6" />

                <section aria-labelledby="payment-heading">
                  <h2 className="text-xs font-semibold" id="payment-heading">
                    Payment
                  </h2>
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/70 p-4">
                    <PaymentStatusBadge status={order.paymentStatus} />
                    <span className="font-heading text-lg font-semibold">
                      {formatCurrency(order.amount)}
                    </span>
                  </div>
                </section>

                <Separator className="my-6" />

                <section aria-labelledby="request-heading">
                  <h2 className="text-xs font-semibold" id="request-heading">
                    Special request
                  </h2>
                  <p className="mt-3 rounded-xl border bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
                    {order.specialRequest || "No special request provided."}
                  </p>
                </section>
              </div>

              {!isFinalOrderStatus(order.status) ? (
                <SheetFooter className="border-t bg-background px-5 py-4 sm:px-6">
                  {nextStatus && actionLabel ? (
                    <Button
                      disabled={updateStatus.isPending}
                      onClick={() => void handleStatusUpdate(nextStatus)}
                      size="lg"
                    >
                      {updateStatus.isPending ? "Updating…" : actionLabel}
                    </Button>
                  ) : null}
                  <Button
                    disabled={updateStatus.isPending}
                    onClick={() => setCancelDialogOpen(true)}
                    size="lg"
                    variant="destructive"
                  >
                    Cancel order
                  </Button>
                </SheetFooter>
              ) : null}
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <HugeiconsIcon icon={Alert02Icon} size={21} />
              </span>
              <SheetTitle className="mt-4 text-lg">Order not found</SheetTitle>
              <SheetDescription className="mt-1">
                We could not find {requestedOrderId} in the current order list.
              </SheetDescription>
              <Button className="mt-5" onClick={onClose} variant="outline">
                Back to orders
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogMedia className="rounded-full bg-destructive/10 text-destructive">
              <HugeiconsIcon icon={Alert02Icon} />
            </AlertDialogMedia>
            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will stop processing {order?.id}. The status cannot be
              changed after cancellation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateStatus.isPending}>
              Keep order
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={updateStatus.isPending}
              onClick={() => void handleStatusUpdate("Cancelled")}
              variant="destructive"
            >
              {updateStatus.isPending ? "Cancelling…" : "Cancel order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
